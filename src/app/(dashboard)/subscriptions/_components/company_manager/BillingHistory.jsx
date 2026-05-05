"use client"

import { RiFlashlightLine } from "@remixicon/react";
import Table from "@/components/Tables/Table";
import { statusCell } from "@/components/StatusCell";
import { useTranslation } from "react-i18next";
import { useGetMyPaymentsQuery } from "@/redux/subscriptions/subscriptionsApi";
import { format } from "date-fns";

const headers = [
    { label: "Product", width: "300px" },
    { label: "Reference", width: "200px" },
    { label: "Date", width: "150px" },
    { label: "Amount", width: "100px" },
    { label: "Status", width: "125px" },
];

function BillingHistory() {
    const { t } = useTranslation();
    const { data: payments = [], isLoading } = useGetMyPaymentsQuery();

    // Transform data into the format expected by the Table component
    const rows = payments.map(payment => [
        // Product cell
        <div key={`product-${payment._id}`} className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-sm text-gray-900">
                {payment.stripe_metadata?.[0]?.split(': ')[1] || t("Subscription")}
            </span>
        </div>,

        // Reference cell
        <div key={`ref-${payment._id}`} className="flex items-center justify-start gap-2">
            <span className="text-sm text-gray-900">
                {payment.stripe_invoice_id || "N/A"}
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
            title={t("Invoices")}
            headers={headers}
            isActions={false}
            rows={rows}
            isFilter={true}
        />
    );
}

export default BillingHistory;