"use client"

import {
    RiCheckboxCircleLine,
    RiCloseCircleLine, RiEditLine, RiEyeLine,
    RiFlashlightLine
} from "@remixicon/react";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { useState } from "react";
import CreatePlanModal from "./_components/CreatePlan.modal";
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

const headers = [
    { label: "Plan", width: "250px" },
    { label: "Price", width: "120px" },
    { label: "Created at", width: "130px" },
    { label: "Trial", width: "120px" },
    { label: "Features", width: "250px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

function PlansPage() {
    const router = useRouter();
    const { data: plans, isLoading, error } = useGetSubscriptionPlansQuery();

    // Mutations
    const [deletePlan] = useDeleteSubscriptionPlanMutation();
    const [toggleActiveStatus] = useToggleSubscriptionPlanActiveStatusMutation();
    const [toggleTrialStatus] = useToggleSubscriptionPlanTrialStatusMutation();

    // Alert States
    const [approvalConfig, setApprovalConfig] = useState({ isOpen: false, type: "warning", title: "", message: "", onConfirm: null });
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [createPlanModalOpen, setCreatePlanModal] = useState(false);

    const toggleCreatePlanModalOpen = () => {
        setCreatePlanModal(!createPlanModalOpen);
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
                title: "Delete Plan",
                message: `Are you sure you want to delete the plan "${plan.name}"? This action cannot be undone.`,
                type: "danger",
                onConfirm: async () => {
                    try {
                        await deletePlan(plan._id).unwrap();
                        setApiResponse({ isOpen: true, status: "success", message: "Plan deleted successfully!" });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || "Failed to delete plan." });
                    }
                }
            };
        } else if (action === "toggle-status") {
            config = {
                ...config,
                title: plan.is_active ? "Deactivate Plan" : "Activate Plan",
                message: `Are you sure you want to ${plan.is_active ? "deactivate" : "activate"} the plan "${plan.name}"?`,
                type: "warning",
                onConfirm: async () => {
                    try {
                        await toggleActiveStatus(plan._id).unwrap();
                        setApiResponse({ isOpen: true, status: "success", message: `Plan ${plan.is_active ? "deactivated" : "activated"} successfully!` });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || "Failed to update status." });
                    }
                }
            };
        } else if (action === "toggle-trial") {
            const isTrialActive = plan.trial?.is_active;
            config = {
                ...config,
                title: isTrialActive ? "Stop Free Trial" : "Start Free Trial",
                message: `Are you sure you want to ${isTrialActive ? "stop" : "start"} the free trial for plan "${plan.name}"?`,
                type: "info",
                onConfirm: async () => {
                    try {
                        await toggleTrialStatus(plan._id).unwrap();
                        setApiResponse({ isOpen: true, status: "success", message: `Free trial ${isTrialActive ? "stopped" : "started"} successfully!` });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || "Failed to update trial status." });
                    }
                }
            };
        }

        setApprovalConfig(config);
    };

    const PlanActions = ({ plan }) => {
        const { i18n } = useTranslation();
        const planId = plan._id;
        const isTrialActive = plan.trial?.is_active;

        const statesActions = [
            {
                text: "View", icon: <RiEyeLine className="text-primary-400" />, onClick: () => {
                    router.push(`/plans/${planId}/details`);
                }
            },
            // {
            //     text: "Edit", icon: <RiEditLine className="text-primary-400" />, onClick: () => {
            //         console.log("Edit", planId)
            //     },
            // },
            {
                text: plan.is_active ? "Deactivate Plan" : "Activate Plan",
                icon: plan.is_active ? (
                    <RiCloseCircleLine className="text-orange-500" />
                ) : (
                    <RiCheckboxCircleLine className="text-green-500" />
                ),
                onClick: () => handleAction("toggle-status", plan)
            },
            {
                text: isTrialActive ? "Stop Free Trial" : "Start Free Trial",
                icon: <RiFlashlightLine className={isTrialActive ? "text-red-500" : "text-blue-500"} />,
                onClick: () => handleAction("toggle-trial", plan)
            },
            {
                text: "Delete", icon: <RiDeleteBin7Line className="text-red-500" />, onClick: () => handleAction("delete", plan)
            }
        ]
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
            <span className="text-sm font-medium text-gray-900 dark:text-gray-50 max-w-[150px] truncate" title={plan.name}>
                {plan.name}
            </span>
        </div>,

        // Price cell
        <div key={`${plan._id}_price`} className="text-sm">
            {plan.pricing?.[0] ? `${plan.pricing[0].price} / ${plan.pricing[0].interval}` : "N/A"}
        </div>,

        // Created at cell
        <div key={`${plan._id}_created_at`} className="text-sm">
            {plan.createdAt ? format(new Date(plan.createdAt), "MMM dd, yyyy") : "N/A"}
        </div>,

        // Trial Cell
        <div key={`${plan._id}_trial`} className="flex flex-col gap-1">
            <span className="text-sm font-medium">{plan.trial?.trial_days || 0} days</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full w-fit ${plan.trial?.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {plan.trial?.is_active ? 'Active' : 'Inactive'}
            </span>
        </div>,

        // Features cell
        <div key={`${plan._id}_features`} className="flex flex-col gap-1 max-w-[300px] overflow-hidden">
            {
                plan.features?.map((feature, idx) => {
                    return (
                        <div key={idx} className="flex flex-col border-b border-gray-100 last:border-0 pb-1 mb-1">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {feature.plan_feature?.title || feature.feature_type?.title || "Feature"}
                            </span>
                            <span className="text-[10px] text-gray-500 line-clamp-1" title={feature.plan_feature?.details || feature.feature_type?.details}>
                                {feature.plan_feature?.details || feature.feature_type?.details}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                                {feature.properties?.map((prop, pIdx) => (
                                    <span key={pIdx} className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[9px] text-gray-600 dark:text-gray-400">
                                        {prop.key}: {prop.value}
                                    </span>
                                ))}
                            </div>
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

    if (isLoading) return <div className="flex justify-center items-center h-full p-10">Loading plans...</div>;
    if (error) return <div className="flex justify-center items-center h-full p-10 text-red-500">Error loading plans.</div>;

    return (
        <Page title="Plans" isBtn={true} btnTitle="Add Plan" btnOnClick={toggleCreatePlanModalOpen}>
            <Table
                classContainer={"rounded-2xl px-8"}
                title="All Plans"
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
        </Page>
    );
}

export default PlansPage;