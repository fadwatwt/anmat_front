"use client"

import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { statusCell } from "@/components/StatusCell";
import { useTranslation } from "react-i18next";
import { useGetMoneyReceivingMethodsQuery } from "@/redux/money-receiving/moneyReceivingApi";

function MoneyReceivingPage() {
    const { t } = useTranslation();
    const { data: methodsResponse, isLoading } = useGetMoneyReceivingMethodsQuery();
    const methods = methodsResponse?.data || [];

    const headers = [
        { label: "Name", width: "300px" },
        { label: "Type", width: "200px" },
        { label: "Activity Status", width: "150px" },
        { label: "Attributes Keys", width: "300px" }
    ];

    const rows = methods.map((method => [
        // Name Cell
        <div key={`${method._id}_title`} className="flex items-center justify-start gap-2">
            <span className="text-md text-cell-primary font-medium">
                {method.title}
            </span>
        </div>,

        <div key={`${method._id}_type`} className="text-cell-secondary">
            {method.type}
        </div>,

        // Status cell
        statusCell(method.is_active ? "active" : "inactive", method._id),

        // Attributes Keys Cell
        <div key={`${method._id}_attributes`} className="flex flex-wrap gap-1">
            {method.attributes?.map(attr => (
                <span key={attr._id} className="text-xs bg-badge-bg border border-status-border px-2 py-0.5 rounded text-badge-text">
                    {attr.key}
                </span>
            ))}
        </div>
    ]));

    if (isLoading) {
        return (
            <Page title="Money Receiving Methods" isBtn={false}>
                <div className="flex justify-center items-center h-64">
                    <p className="text-cell-secondary">{t("Loading...")}</p>
                </div>
            </Page>
        );
    }

    return (
        <Page title="Money Receiving Methods" isBtn={false}>
            <Table
                classContainer={"rounded-2xl px-8"}
                title="All money receiving methods"
                headers={headers}
                isActions={false}
                handelDelete={() => { }}
                rows={rows}
                isFilter={true}
            />
        </Page>
    );
}

export default MoneyReceivingPage;