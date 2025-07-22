"use client"

import {
    RiBuilding2Fill,
    RiCheckboxCircleFill,
    RiForbidFill,
    RiQuestionLine,
} from "@remixicon/react";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";

const headers = [
    { label: "Company", width: "300px" },
    { label: "Industry", width: "150px" },
    { label: "Subscribed at", width: "150px" },
    { label: "Users", width: "100px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

// Sample data - replace with your actual data
const companysData = [
    {
        company: "Company Name",
        companyUrl: "company.url",
        industry: "Design",
        subscribed_at: "May 24, 2025",
        usersNumber: "3",
        status: "Churned"
    },
    {
        company: "Company Name",
        companyUrl: "company.url",
        industry: "Fintech",
        subscribed_at: "May 24, 2025",
        usersNumber: "10",
        status: "Customer"
    },
    {
        company: "Company Name",
        companyUrl: "company.url",
        industry: "Design",
        subscribed_at: "May 24, 2025",
        usersNumber: "25",
        status: "Churned"
    },
    {
        company: "Company Name",
        companyUrl: "company.url",
        industry: "Fintech",
        subscribed_at: "May 24, 2025",
        usersNumber: "12",
        status: "Customer"
    }
];

const statusConfig = {
    Customer: {
        bgColor: "bg-green-50",
        icon: <RiCheckboxCircleFill size={15} className="text-green-success" />,
        textColor: "text-green-success",
    },
    Churned: {
        bgColor: "bg-weak-100",
        icon: <RiForbidFill size={15} className="text-soft-400" />,
        textColor: "text-soft-400",
    }
};

function Companies() {

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
    const rows = companysData.map(company => [
        // Company Name cell
        <div key="company" className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiBuilding2Fill size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-0">
                <span className="text-lg text-gray-900 dark:text-gray-50">
                    {company.company}
                </span>
                <span className="text-sm text-gray-500">
                    {company.companyUrl}
                </span>
            </div>
        </div>,

        // Plan Cell
        <div key="industry" className="flex items-center justify-start gap-2">
            <span className="text-lg text-gray-900 dark:text-gray-50">
                {company.industry}
            </span>
        </div>,

        // Date cell
        <div key="subscribed_at">{company.subscribed_at}</div>,

        // Users Subscribed cell
        <div key="amount" className="px-2 py-1 text-gray-900 text-md font-bold bg-gray-50 text-center rounded-[25px]">
            {company.usersNumber}
        </div>,

        // Status cell
        statusCell(company.status)
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

export default Companies;