"use client"

import {
    RiCheckboxCircleFill,
    RiCloseCircleFill,
    RiFlashlightLine,
    RiQuestionLine,
} from "@remixicon/react";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { useState } from "react";
import CreatePlanModal from "./_components/CreatePlanModal";

const headers = [
    { label: "Plan", width: "300px" },
    { label: "Price", width: "150px" },
    { label: "Created at", width: "150px" },
    { label: "Features", width: "300px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

// Sample data - replace with your actual data
const plansData = [
    {
        _id: "p1",
        name: "Basic Plan",
        created_at: "May 24, 2025",
        price: "$3/mth",
        status: "Active",
        features: [
            'Access to core dashboard features',
            'Up to 5 team members',
            'Access to core dashboard features',
        ]
    },
    {
        _id: "p2",
        name: "Premium Plan",
        created_at: "May 24, 2025",
        price: "$10/mth",
        status: "Active",
        features: [
            'Access to core dashboard features',
            'Up to 5 team members'
        ]
    },
    {
        _id: "p3",
        name: "Basic Plan",
        created_at: "May 24, 2025",
        price: "$25/mth",
        status: "Not-active",
        features: [
            'Access to core dashboard features',
            'Up to 5 team members',
            'Access to core dashboard features',
        ]
    },
    {
        _id: "p4",
        name: "Premium Plan",
        created_at: "May 24, 2025",
        price: "$12/mth",
        status: "Not-active",
        features: [
            'Access to core dashboard features',
            'Up to 5 team members'
        ]
    }
];

const statusConfig = {
    Active: {
        bgColor: "bg-green-50",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
        textColor: "text-green-700",
    },
    'Not-active': {
        bgColor: "bg-red-50",
        icon: <RiCloseCircleFill size={15} className="text-red-700" />,
        textColor: "text-red-700",
    }
};

function PlansPage() {

    const [createPlanModalOpen, setCreatePlanModal] = useState();
    const toggleCreatePlanModalOpen = () => {
        setCreatePlanModal(!createPlanModalOpen);
    }

    const statusCell = (status, _id) => {
        const config = statusConfig[status] || {
            bgColor: "bg-gray-50",
            icon: <RiQuestionLine size={15} className="text-gray-700" />,
            textColor: "text-gray-700",
        };

        return (
            <div key={`${_id}_status`} className="px-2 py-1">
                <div
                    key={`status-${status}`}
                    className={`flex items-center justify-center gap-1 ${config.bgColor} px-1 py-1 rounded-md`}
                >
                    {config.icon}
                    <span className={`text-xs ${config.textColor}`}>
                        {status}
                    </span>
                </div>
            </div>
        );
    };

    // Transform data into the format expected by the Table component
    const rows = plansData.map(plan => [

        // Plan Cell
        <div key={`${plan._id}_plan`} className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-md text-gray-900 dark:text-gray-50">
                {plan.name}
            </span>
        </div>,

        // Price cell
        <div key={`${plan._id}_price`}>{plan.price}</div>,

        // Created at cell
        <div key={`${plan._id}_created_at`}>{plan.created_at}</div>,

        // Features cell
        <div key={`${plan._id}_features`} className="flex flex-row flex-nowrap items-center justify-start gap-2 overflow-x-auto">
            {
                plan.features.map(feature => {
                    return (
                        <div key="features" className="px-2 py-1 text-primary-600 text-sm bg-primary-50 text-center rounded-[25px]">
                            {feature}
                        </div>
                    )
                })
            }
        </div>,

        // Status cell
        statusCell(plan.status, plan._id)
    ]);

    return (
        <Page title="Plans" isBtn={true} btnTitle="Add Plan" btnOnClick={toggleCreatePlanModalOpen}>
            <Table
                classContainer={"rounded-2xl px-8"}
                title="All Plans"
                headers={headers}
                isActions={true}
                rows={rows}
                isFilter={true}
            />
            <CreatePlanModal isOpen={createPlanModalOpen} onClose={toggleCreatePlanModalOpen} />
        </Page>
    );
}

export default PlansPage;