"use client"

import {
    RiCloseCircleLine, RiEditLine, RiEyeLine,
    RiFlashlightLine
} from "@remixicon/react";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { useState } from "react";
import CreatePlanModal from "./_components/CreatePlan.modal";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import { useTranslation } from "react-i18next";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { RiDeleteBin7Line } from "react-icons/ri";
import { statusCell } from "@/components/StatusCell";
import { useRouter } from "next/navigation";
import { useGetSubscriptionPlansQuery } from "@/redux/plans/subscriptionPlansApi";
import { format } from "date-fns";

const headers = [
    { label: "Plan", width: "300px" },
    { label: "Price", width: "150px" },
    { label: "Created at", width: "150px" },
    { label: "Features", width: "300px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

// Sample data removed - using subscriptionPlansApi instead

function PlansPage() {
    const router = useRouter();
    const { data: plans, isLoading, error } = useGetSubscriptionPlansQuery();

    const PlanActions = ({ actualRowIndex, planId }) => {
        const { t, i18n } = useTranslation();
        const statesActions = [
            {
                text: "View", icon: <RiEyeLine className="text-primary-400" />, onClick: () => {
                    router.push(`/plans/${planId}/details`);
                }
            },
            {
                text: "Edit", icon: <RiEditLine className="text-primary-400" />, onClick: () => {
                    console.log("Edit", planId)
                },
            },
            {
                text: "Stop Free Trial", icon: <RiCloseCircleLine className="text-red-500" />, onClick: () => {
                    console.log("Stop trial", planId)
                },
            },
            {
                text: "Delete", icon: <RiDeleteBin7Line className="text-red-500" />, onClick: () => {
                    toggleCheckAlertDeletePlanModal()
                    console.log("Delete", planId)
                },
            }
        ]
        return (
            <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
                }`} />
        );
    }

    const [createPlanModalOpen, setCreatePlanModal] = useState();
    const [checkAlertDeletePlanModal, setCheckAlertDeletePlanModal] = useState();
    const toggleCreatePlanModalOpen = () => {
        setCreatePlanModal(!createPlanModalOpen);
    }
    const toggleCheckAlertDeletePlanModal = () => {
        setCheckAlertDeletePlanModal(!checkAlertDeletePlanModal);
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

        // Features cell
        <div key={`${plan._id}_features`} className="flex flex-col gap-1 max-w-[300px] overflow-hidden">
            {
                plan.features?.map((feature, idx) => {
                    return (
                        <div key={idx} className="flex flex-col border-b border-gray-100 last:border-0 pb-1 mb-1">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {feature.plan_feature?.title || "Feature"}
                            </span>
                            <span className="text-[10px] text-gray-500 line-clamp-1" title={feature.plan_feature?.details}>
                                {feature.plan_feature?.details}
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
        statusCell(plan.is_active ? "active" : "in-active", plan._id)
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
                handelDelete={toggleCheckAlertDeletePlanModal}
                rows={rows}
                customActions={(actualRowIndex) => (
                    <PlanActions planId={plans?.[actualRowIndex]?._id}
                        actualRowIndex={actualRowIndex} />)
                }
                isFilter={true}
            />
            <CheckAlert
                isOpen={checkAlertDeletePlanModal}
                onClose={toggleCheckAlertDeletePlanModal}
                type="cancel"
                title="Stop Free Trial"
                confirmBtnText="Yes, Stop"
                description={
                    <p>
                        Are you sure you want to <span className="font-bold text-black">Stop Free Trial</span> of the
                        <span className="font-bold text-black"> Basic plan</span>?
                    </p>
                }
                onSubmit={() => { }}
            />
            <CreatePlanModal isOpen={createPlanModalOpen} onClose={toggleCreatePlanModalOpen} />
        </Page>
    );
}

export default PlansPage;