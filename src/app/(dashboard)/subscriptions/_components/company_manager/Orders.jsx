"use client"

import {
    RiCheckboxCircleFill,
    RiCheckDoubleFill,
    RiCloseCircleFill,
    RiHourglass2Line,
    RiMastercardFill,
    RiQuestionLine,
    RiTimeLine,
    RiVisaFill
} from "@remixicon/react";
import Table from "@/components/Tables/Table";

const headers = [
    { label: "Product", width: "300px" },
    { label: "Payment Method", width: "300px" },
    { label: "Date", width: "150px" },
    { label: "Amount", width: "100px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

// Sample data - replace with your actual data
const ordersData = [
    {
        product: "Basic Plan",
        paymentMethod: "Master Card",
        date: "2023-05-15",
        amount: "$99.00",
        status: "Active"
    },
    {
        product: "Premium Plan",
        paymentMethod: "Visa",
        date: "2023-05-16",
        amount: "$199.00",
        status: "Pending"
    },
    {
        product: "Basic Plan",
        paymentMethod: "Master Card",
        date: "2023-05-15",
        amount: "$99.00",
        status: "Cancelled"
    },
    {
        product: "Premium Plan",
        paymentMethod: "Visa",
        date: "2023-05-16",
        amount: "$199.00",
        status: "Completed"
    }
];

const statusConfig = {
    Active: {
        bgColor: "bg-green-50",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
        textColor: "text-green-700",
    },
    Pending: {
        bgColor: "bg-yellow-50",
        icon: <RiTimeLine size={15} className="text-yellow-700" />,
        textColor: "text-yellow-700",
    },
    Cancelled: {
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

function OrdersTable() {

    const statusCell = (status) => {
        const config = statusConfig[status] || {
            bgColor: "bg-gray-50",
            icon: <RiQuestionLine size={15} className="text-gray-700" />,
            textColor: "text-gray-700",
        };

        return (
            <div
                key={`status-${status}`}
                className={`flex items-center justify-center gap-1 ${config.bgColor} px-1 py-1 rounded-md`}
            >
                {config.icon}
                <span className={`text-xs ${config.textColor}`}>
                    {status}
                </span>
            </div>
        );
    };

    // Transform data into the format expected by the Table component
    const rows = ordersData.map(order => [
        // Product cell
        <div key="product" className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiHourglass2Line size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-md text-gray-900">
                {order.product}
            </span>
        </div>,

        // Payment Method cell
        <div key="payment" className="flex items-center justify-start gap-2">
            {order.paymentMethod === 'Visa' ? <RiVisaFill size={35} className="rounded-full stroke-[5px]" /> : <RiMastercardFill size={35} className="rounded-full stroke-[5px]" />}
            <span className="text-md text-gray-900">
                {order.paymentMethod}
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
            title="Orders"
            headers={headers}
            isActions={true}
            rows={rows}
            isFilter={true}
        />
    );
}

export default OrdersTable;