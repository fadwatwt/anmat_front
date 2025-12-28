"use client"

import {RiCloseCircleLine, RiEditLine, RiEyeLine, RiFlashlightLine} from "@remixicon/react";
import Table from "@/components/Tables/Table";
import {statusCell} from "@/components/StatusCell";
import {useTranslation} from "react-i18next";
import {RiDeleteBin7Line} from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";

const headers = [
    { label: "Product", width: "300px" },
    { label: "Reference", width: "200px" },
    { label: "Date", width: "150px" },
    { label: "Amount", width: "100px" },
    { label: "Status", width: "125px" },
    // { label: "", width: "50px" }
];

// Sample data - replace with your actual data
const ordersData = [
    {
        product: "Basic Plan",
        reference: "MGU67900",
        date: "2023-05-15",
        amount: "$99.00",
        status: "Paid"
    },
    {
        product: "Premium Plan",
        reference: "MGU679001",
        date: "2023-05-16",
        amount: "$199.00",
        status: "Not-paid"
    },
    {
        product: "Basic Plan",
        reference: "MGU679002",
        date: "2023-05-15",
        amount: "$99.00",
        status: "Paid"
    },
    {
        product: "Premium Plan",
        reference: "MGU679003",
        date: "2023-05-16",
        amount: "$199.00",
        status: "Paid"
    }
];

function BillingHistory() {

    // Transform data into the format expected by the Table component
    const rows = ordersData.map(order => [
        // Product cell
        <div key="product" className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-sm text-gray-900">
                {order.product}
            </span>
        </div>,

        // Payment Method cell
        <div key="reference" className="flex items-center justify-start gap-2">
            <span className="text-md text-gray-900">
                {order.reference}
            </span>
        </div>,

        // Date cell
        <div key="date">{order.date}</div>,

        // Amount cell
        <div key="amount">{order.amount}</div>,

        // Status cell
        statusCell(order.status)
    ]);

    return (
        <Table
            classContainer={"rounded-2xl px-8"}
            title="Invoices"
            headers={headers}
            isActions={false}
            rows={rows}
            isFilter={true}
        />
    );
}

export default BillingHistory;