"use client"

import {
    RiBuilding2Fill,
    RiCheckboxCircleFill,
    RiCheckDoubleFill,
    RiCloseCircleFill,
    RiFlashlightLine,
    RiQuestionLine,
    RiTimeLine
} from "@remixicon/react";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";

const headers = [
    { label: "Company Name", width: "300px" },
    { label: "Plan", width: "300px" },
    { label: "Renewal Date", width: "150px" },
    { label: "Users Subscribed", width: "100px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

// Sample data - replace with your actual data
const ordersData = [
    {
        company: "Company Name",
        companyUrl: "company.url",
        plan: "Basic Plan",
        date: "May 24, 2025",
        usersSubscribed: "3",
        status: "Approved"
    },
    {
        company: "Company Name",
        companyUrl: "company.url",
        plan: "Premium Plan",
        date: "May 24, 2025",
        usersSubscribed: "10",
        status: "Pending"
    },
    {
        company: "Company Name",
        companyUrl: "company.url",
        plan: "Basic Plan",
        date: "May 24, 2025",
        usersSubscribed: "25",
        status: "Rejected"
    },
    {
        company: "Company Name",
        companyUrl: "company.url",
        plan: "Premium Plan",
        date: "May 24, 2025",
        usersSubscribed: "12",
        status: "Completed"
    }
];

const statusConfig = {
    Approved: {
        bgColor: "bg-green-50",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
        textColor: "text-green-700",
    },
    Pending: {
        bgColor: "bg-yellow-50",
        icon: <RiTimeLine size={15} className="text-yellow-700" />,
        textColor: "text-yellow-700",
    },
    Rejected: {
        bgColor: "bg-red-50",
        icon: <RiCloseCircleFill size={15} className="text-red-700" />,
        textColor: "text-red-700",
    },
    Completed: {
        bgColor: "bg-blue-50",
        icon: <RiCheckDoubleFill size={15} className="text-blue-700" />,
        textColor: "text-blue-700",
    }
};

function CompaniesSubscriptions() {

    const statusCell = (status) => {
        const config = statusConfig[status] || {
            bgColor: "bg-gray-50",
            icon: <RiQuestionLine size={15} className="text-gray-700" />,
            textColor: "text-gray-700",
        };

        return (
            <div className="px-2 py-1">
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
    const rows = ordersData.map(order => [
        // Company Name cell
        <div key="company" className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiBuilding2Fill size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-0">
                <span className="text-lg text-gray-900 dark:text-gray-50">
                    {order.company}
                </span>
                <span className="text-sm text-gray-500">
                    {order.companyUrl}
                </span>
            </div>
        </div>,

        // Plan Cell
        <div key="plan" className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-lg text-gray-900 dark:text-gray-50">
                {order.plan}
            </span>
        </div>,

        // Date cell
        <div key="date">{order.date}</div>,

        // Users Subscribed cell
        <div key="amount" className="px-2 py-1 text-gray-900 text-md font-bold bg-gray-50 text-center rounded-[25px]">
            {order.usersSubscribed}
        </div>,

        // Status cell
        statusCell(order.status)
    ]);

    const statusOptions = [
        { name: "All", value: "All" },
        { name: "Approved", value: "Approved" },
        { name: "Pending", value: "Pending" },
        { name: "Rejected", value: "Rejected" }
    ];

    const industryOptions = [
        { name: "All", value: "All" },
        { name: "Design", value: "design" },
        { name: "Product Management", value: "product management" }
    ];

    return (
        <Page title="Companies" isBtn={false}>
            <Table
                classContainer={"rounded-2xl px-8"}
                title="All Companies"
                headers={headers}
                isActions={true}
                rows={rows}
                isFilter={true}
                showStatusFilter={true}
                statusOptions={statusOptions}
                showIndustryFilter={true}
                industryOptions={industryOptions}
            />
        </Page>
    );
}

export default CompaniesSubscriptions;