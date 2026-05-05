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
import { useTranslation } from "react-i18next";
import { useGetMyPaymentsQuery } from "@/redux/subscriptions/subscriptionsApi";
import { format } from "date-fns";

const headers = [
    { label: "Product", width: "300px" },
    { label: "Payment Method", width: "300px" },
    { label: "Date", width: "150px" },
    { label: "Amount", width: "100px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

const statusConfig = {
    paid: {
        bgColor: "bg-green-50",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
        textColor: "text-green-700",
    },
    pending: {
        bgColor: "bg-yellow-50",
        icon: <RiTimeLine size={15} className="text-yellow-700" />,
        textColor: "text-yellow-700",
    },
    failed: {
        bgColor: "bg-red-50",
        icon: <RiCloseCircleFill size={15} className="text-red-700" />,
        textColor: "text-red-700",
    },
    succeeded: {
        bgColor: "bg-blue-50",
        icon: <RiCheckDoubleFill size={15} className="text-blue-700" />,
        textColor: "text-blue-700",
    }
};

function OrdersTable() {
    const { t } = useTranslation();
    const { data: payments = [], isLoading } = useGetMyPaymentsQuery();

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
                    {t(status)}
                </span>
            </div>
        );
    };

    // Transform data into the format expected by the Table component
    const rows = payments.map(payment => [
        // Product cell
        <div key={`product-${payment._id}`} className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiHourglass2Line size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-md text-gray-900">
                {payment.stripe_metadata?.[0]?.split(': ')[1] || t("Subscription")}
            </span>
        </div>,

        // Payment Method cell
        <div key={`pm-${payment._id}`} className="flex items-center justify-start gap-2">
            {payment.payment_method_id?.card_brand === 'visa' ? <RiVisaFill size={35} className="rounded-full stroke-[5px]" /> : <RiMastercardFill size={35} className="rounded-full stroke-[5px]" />}
            <span className="text-md text-gray-900">
                {payment.payment_method_id?.card_brand || t("Card")}
            </span>
        </div>,

        // Date cell
        <div key={`date-${payment._id}`}>{payment.createdAt ? format(new Date(payment.createdAt), "MMM dd, yyyy") : "N/A"}</div>,

        // Amount cell
        <div key={`amount-${payment._id}`}>{payment.currency?.toUpperCase()} {payment.amount}</div>,

        // Status cell
        statusCell(payment.status)
    ]);

    if (isLoading) return <div className="p-5 text-center">{t("Loading...")}</div>;

    return (
        <Table
            classContainer={"rounded-2xl px-8"}
            title={t("Orders")}
            headers={headers}
            isActions={true}
            rows={rows}
            isFilter={true}
        />
    );
}

export default OrdersTable;