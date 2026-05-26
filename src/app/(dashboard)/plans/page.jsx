"use client"
import { ImSpinner2 } from "react-icons/im";

import {
    RiCheckboxCircleLine,
    RiCloseCircleLine, RiEditLine, RiEyeLine,
    RiFlashlightLine,
    RiSparklingLine,
} from "@remixicon/react";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { useState } from "react";
import CreatePlanModal from "./_components/CreatePlan.modal";
import EditPlanModal from "./_components/EditPlan.modal";
import { useTranslation } from "react-i18next";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { RiDeleteBin7Line } from "react-icons/ri";
import { statusCell } from "@/components/StatusCell";
import { useRouter } from "next/navigation";
import {
    useGetSubscriptionPlansQuery,
    useDeleteSubscriptionPlanMutation,
    useToggleSubscriptionPlanActiveStatusMutation,
    useToggleSubscriptionPlanTrialStatusMutation
} from "@/redux/plans/subscriptionPlansApi";
import { format } from "date-fns";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import PermissionGuard from "@/components/PermissionGuard";
import { usePermission } from "@/Hooks/usePermission";
import Tabs from "@/components/Tabs";
import AIPlansTab from "./_components/AIPlansTab";

function SubscriptionPlansTab({ canCreate, canUpdate, canDelete, canToggleActivity, canManageTrial }) {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { data: plans, isLoading, error } = useGetSubscriptionPlansQuery();

    const headers = [
        { label: t("Plan"), width: "250px" },
        { label: t("Price"), width: "120px" },
        { label: t("Created at"), width: "130px" },
        { label: t("Trial"), width: "120px" },
        { label: t("Features"), width: "250px" },
        { label: t("Status"), width: "125px" },
        { label: "", width: "50px" }
    ];

    // Mutations
    const [deletePlan] = useDeleteSubscriptionPlanMutation();
    const [toggleActiveStatus] = useToggleSubscriptionPlanActiveStatusMutation();
    const [toggleTrialStatus] = useToggleSubscriptionPlanTrialStatusMutation();

    // Alert States
    const [approvalConfig, setApprovalConfig] = useState({ isOpen: false, type: "warning", title: "", message: "", onConfirm: null });
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [createPlanModalOpen, setCreatePlanModal] = useState(false);
    const [editPlanModalOpen, setEditPlanModal] = useState(false);
    const [selectedPlanForEdit, setSelectedPlanForEdit] = useState(null);

    const toggleCreatePlanModalOpen = () => {
        setCreatePlanModal(!createPlanModalOpen);
    }

    const toggleEditPlanModalOpen = () => {
        setEditPlanModal(!editPlanModalOpen);
    }

    const handleEdit = (plan) => {
        setSelectedPlanForEdit(plan);
        setEditPlanModal(true);
    }

    const handleAction = async (action, plan) => {
        let config = {
            isOpen: true,
            title: "",
            message: "",
            type: "warning",
            onConfirm: null
        };

        if (action === "delete") {
            config = {
                ...config,
                title: t("Delete Plan"),
                message: t(`Are you sure you want to delete the plan "${plan.name}"? This action cannot be undone.`),
                type: "danger",
                onConfirm: async () => {
                    try {
                        await deletePlan(plan._id).unwrap();
                        setApiResponse({ isOpen: true, status: "success", message: t("Plan deleted successfully!") });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || t("Failed to delete plan.") });
                    }
                }
            };
        } else if (action === "toggle-status") {
            config = {
                ...config,
                title: plan.is_active ? t("Deactivate Plan") : t("Activate Plan"),
                message: t(`Are you sure you want to ${plan.is_active ? "deactivate" : "activate"} the plan "${plan.name}"?`),
                type: "warning",
                onConfirm: async () => {
                    try {
                        await toggleActiveStatus(plan._id).unwrap();
                        setApiResponse({ isOpen: true, status: "success", message: t(`Plan ${plan.is_active ? "deactivated" : "activated"} successfully!`) });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || t("Failed to update status.") });
                    }
                }
            };
        } else if (action === "toggle-trial") {
            const isTrialActive = plan.trial?.is_active;
            config = {
                ...config,
                title: isTrialActive ? t("Stop Free Trial") : t("Start Free Trial"),
                message: t(`Are you sure you want to ${isTrialActive ? "stop" : "start"} the free trial for plan "${plan.name}"?`),
                type: "info",
                onConfirm: async () => {
                    try {
                        await toggleTrialStatus(plan._id).unwrap();
                        setApiResponse({ isOpen: true, status: "success", message: t(`Free trial ${isTrialActive ? "stopped" : "started"} successfully!`) });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || t("Failed to update trial status.") });
                    }
                }
            };
        }

        setApprovalConfig(config);
    };

    const PlanActions = ({ plan }) => {
        const planId = plan._id;
        const isTrialActive = plan.trial?.is_active;

        const statesActions = [
            {
                text: t("View"), icon: <RiEyeLine className="text-primary-400" />, onClick: () => {
                    router.push(`/plans/${planId}/details`);
                }
            },
            canUpdate && {
                text: t("Edit"), icon: <RiEditLine className="text-primary-400" />, onClick: () => {
                    handleEdit(plan)
                },
            },
            canToggleActivity && {
                text: plan.is_active ? t("Deactivate Plan") : t("Activate Plan"),
                icon: plan.is_active ? (
                    <RiCloseCircleLine className="text-orange-500" />
                ) : (
                    <RiCheckboxCircleLine className="text-green-500" />
                ),
                onClick: () => handleAction("toggle-status", plan)
            },
            canManageTrial && {
                text: isTrialActive ? t("Stop Free Trial") : t("Start Free Trial"),
                icon: <RiFlashlightLine className={isTrialActive ? "text-red-500" : "text-blue-500"} />,
                onClick: () => handleAction("toggle-trial", plan)
            },
            canDelete && {
                text: t("Delete"), icon: <RiDeleteBin7Line className="text-red-500" />, onClick: () => handleAction("delete", plan)
            }
        ].filter(Boolean);
        return (
            <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
                }`} />
        );
    }


    // Transform data into the format expected by the Table component
    const rows = plans?.map(plan => [

        // Plan Cell
        <div key={`${plan._id}_plan`} className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={18} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-sm font-medium text-cell-primary max-w-[150px] truncate" title={plan.name}>
                {plan.name}
            </span>
        </div>,

        // Price cell
        <div key={`${plan._id}_price`} className="text-sm">
            {plan.pricing?.[0] ? `${plan.pricing[0].price} / ${plan.pricing[0].interval}` : t("N/A")}
        </div>,

        // Created at cell
        <div key={`${plan._id}_created_at`} className="text-sm">
            {plan.createdAt ? format(new Date(plan.createdAt), "MMM dd, yyyy") : t("N/A")}
        </div>,

        // Trial Cell
        <div key={`${plan._id}_trial`} className="flex flex-col gap-1">
            <span className="text-sm font-medium">{plan.trial?.trial_days || 0} {t("days")}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full w-fit ${plan.trial?.is_active ? 'bg-green-100 text-green-700' : 'bg-badge-bg text-badge-text border border-status-border'}`}>
                {plan.trial?.is_active ? t("Active") : t("Inactive")}
            </span>
        </div>,

        // Features cell
        <div key={`${plan._id}_features`} className="flex flex-col gap-3 max-w-[300px] py-1">
            {
                plan.features?.map((feature, idx) => {
                    return (
                        <div key={idx} className="flex flex-col gap-1.5">
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                                <span className="text-sm font-semibold text-cell-primary leading-tight">
                                    {feature.plan_feature?.title || feature.feature_type?.title || t("Feature")}
                                </span>
                            </div>
                            
                            {feature.properties?.length > 0 && (
                                <div className="flex flex-wrap gap-2 ml-3.5">
                                    {feature.properties.map((prop, pIdx) => (
                                        <div key={pIdx} className="bg-slate-50 border border-slate-100 rounded-md px-2 py-1 flex items-center gap-1.5 shadow-sm">
                                            <span className="text-[11px] text-slate-400 font-medium">
                                                {prop.key}:
                                            </span>
                                            <span className="text-[11px] font-bold text-blue-600">
                                                {prop.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })
            }
        </div>,

        // Status cell
        <div key={`${plan._id}_status_wrapper`} className="cursor-pointer" onClick={() => handleAction("toggle-status", plan)}>
            {statusCell(plan.is_active ? "active" : "in-active", plan._id)}
        </div>
    ]) || [];

    if (isLoading) return <div className="flex justify-center items-center h-full p-10"> <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div> </div>;
    if (error) return <div className="flex justify-center items-center h-full p-10 text-red-500">{t("Error loading plans.")}</div>;

    return (
        <div>
            {canCreate && (
                <div className="flex justify-end mb-4 px-2">
                    <button
                        onClick={toggleCreatePlanModalOpen}
                        className="bg-primary-base dark:bg-primary-200 flex gap-1 items-center px-3 py-2 rounded-lg text-sm"
                    >
                        <span className="text-white dark:text-black font-medium">+ {t("Add Plan")}</span>
                    </button>
                </div>
            )}

            <Table
                classContainer={"rounded-2xl px-8"}
                title={t("All Plans")}
                headers={headers}
                isActions={false}
                rows={rows}
                customActions={(actualRowIndex) => (
                    <PlanActions plan={plans?.[actualRowIndex]} />)
                }
                isFilter={true}
            />

            <ApprovalAlert
                isOpen={approvalConfig.isOpen}
                onClose={() => setApprovalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={approvalConfig.onConfirm}
                title={approvalConfig.title}
                message={approvalConfig.message}
                type={approvalConfig.type}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse(prev => ({ ...prev, isOpen: false }))}
            />

            <CreatePlanModal isOpen={createPlanModalOpen} onClose={toggleCreatePlanModalOpen} />
            <EditPlanModal 
                isOpen={editPlanModalOpen} 
                onClose={() => {
                    setEditPlanModal(false);
                    setSelectedPlanForEdit(null);
                }} 
                plan={selectedPlanForEdit}
            />
        </div>
    );
}

function PlansPageContent() {
    const { t } = useTranslation();

    const canCreate = usePermission("admin.subscription_plans.create");
    const canUpdate = usePermission("admin.subscription_plans.update");
    const canDelete = usePermission("admin.subscription_plans.delete");
    const canToggleActivity = usePermission("admin.subscription_plans.toggle_activity");
    const canManageTrial = usePermission("admin.subscription_plans.manage_trial");

    const tabs = [
        {
            title: t("Subscription Plans"),
            icon: RiFlashlightLine,
            content: (
                <SubscriptionPlansTab
                    canCreate={canCreate}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    canToggleActivity={canToggleActivity}
                    canManageTrial={canManageTrial}
                />
            ),
        },
        {
            title: t("AI Token Plans"),
            icon: RiSparklingLine,
            content: (
                <AIPlansTab
                    canCreate={canCreate}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                />
            ),
        },
    ];

    return (
        <Page title={t("Plans")}>
            <Tabs tabs={tabs} />
        </Page>
    );
}

export default function PlansPage() {
    return (
        <PermissionGuard permission="admin.subscription_plans.list">
            <PlansPageContent />
        </PermissionGuard>
    );
}