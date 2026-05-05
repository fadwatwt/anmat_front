"use client"

import { RiFlashlightLine } from "@remixicon/react";
import Table from "@/components/Tables/Table";
import { statusCell } from "@/components/StatusCell";
import { useTranslation } from "react-i18next";
import StatusActions from "@/components/Dropdowns/StatusActions";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import { useGetMyPaymentsQuery } from "@/redux/subscriptions/subscriptionsApi";
import { format } from "date-fns";

const headers = [
    { label: "Product", width: "200px" },
    { label: "Payment Method", width: "200px" },
    { label: "Date", width: "150px" },
    { label: "Amount", width: "100px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

function History() {
    const { t, i18n } = useTranslation();
    const { data: payments = [], isLoading } = useGetMyPaymentsQuery();

    const HistoryActions = ({ actualRowIndex }) => {
        const statesActions = [
            {
                text: t("Re-order"), icon: null, onClick: () => {
                    console.log(actualRowIndex)
                }
            },
        ]
        return (
            <StatusActions states={statesActions} className={` *:text-blue-500 p-1 bg-blue-100 block text-center rounded ${i18n.language === "ar" ? "left-0" : "right-0"
                }`} />
        );
    }

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

        // Payment Method cell
        <div key={`pm-${payment._id}`} className="flex items-center justify-start gap-2">
            <div className="p-2 h-12 w-18">
                <img src={payment.payment_method_id?.card_brand === 'visa' ? "/images/payments/visa.png" : "/images/payments/mastercard.png"} alt={"img"} className={"w-full h-full object-cover"} />
            </div>
            <span className="text-sm text-gray-900">
                {payment.payment_method_id?.card_brand || t("Card")} **** {payment.payment_method_id?.last4 || ""}
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
        <>
            <Table
                classContainer={"rounded-2xl px-8"}
                title={t("Invoices")}
                headers={headers}
                isActions={false}
                rows={rows}
                isFilter={true}
                customActions={(actualRowIndex) => (
                    <HistoryActions actualRowIndex={actualRowIndex} />)
                }
            />
            <CheckAlert
                isOpen={false}
                onClose={() => { }}
                type="warning"
                title={t("Confirm Re-Order")}
                confirmBtnText={t("Confirm")}
                description={
                    <p>
                        {t("Are you sure you want to")} <span className="font-bold text-black">{t("Re-Order")}</span> {t("the plan")}?
                    </p>
                }
                onSubmit={() => { }}
            />
        </>
    );
}

export default History;