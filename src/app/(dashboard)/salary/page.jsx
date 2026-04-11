"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { useGetEmployeeSalaryTransactionsQuery } from "@/redux/financial/employeeSalariesApi";
import { translateDate } from "@/functions/Days";

export default function EmployeeSalaryPage() {
    const { t } = useTranslation();
    const { data: transactions = [], isLoading, isError } = useGetEmployeeSalaryTransactionsQuery();

    const headers = [
        { label: t("Employees"), width: "250px" },
        { label: t("Salary Amount"), width: "120px" },
        { label: t("Bonus"), width: "100px" },
        { label: t("Deduction"), width: "100px" },
        { label: t("Comment"), width: "200px" },
        { label: t("Date"), width: "120px" },
    ];

    const rows = useMemo(() => {
        return transactions.map((transaction, index) => [
            <div key={`employee-${transaction._id || index}`} className="flex items-center gap-3">
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(transaction.employee?.name || "User")}`}
                    alt={transaction.employee?.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-cell-primary">
                        {transaction.employee?.name || t("Unknown")}
                    </span>
                    <span className="text-xs text-cell-secondary">
                        {transaction.employee?.email || "N/A"}
                    </span>
                </div>
            </div>,
            <span key={`salary-${transaction._id || index}`} className="text-sm text-cell-primary font-bold">
                {transaction.amount?.toLocaleString()}$
            </span>,
            <span key={`bonus-${transaction._id || index}`} className="text-sm text-green-success">
                +{transaction.bonus?.toLocaleString()}$
            </span>,
            <span key={`deduction-${transaction._id || index}`} className="text-sm text-red-error font-medium">
                -{transaction.discount?.toLocaleString()}$
            </span>,
            <span key={`comment-${transaction._id || index}`} className="text-sm text-cell-secondary truncate max-w-[180px]" title={transaction.comment}>
                {transaction.comment || "-"}
            </span>,
            <p key={`date-${transaction._id || index}`} className="text-sm text-cell-primary text-nowrap">
                {transaction.created_at ? translateDate(transaction.created_at) : "-"}
            </p>,
        ]);
    }, [transactions, t]);

    if (isError) {
        return (
            <Page title={t("Salary Transactions")}>
                <div className="text-center text-red-error mt-8 font-medium">
                    {t("Failed to load salary transactions. Please try again later.")}
                </div>
            </Page>
        );
    }

    return (
        <Page title={t("Salary Transactions")}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64 bg-surface rounded-2xl border border-status-border">
                            <div className="text-primary-base animate-pulse font-bold text-lg flex items-center gap-3">
                                <div className="w-3 h-3 bg-primary-base rounded-full animate-bounce"></div>
                                {t("Loading salary transactions...")}
                            </div>
                        </div>
                    ) : (
                        <Table
                            title={t("My Salary Transactions")}
                            headers={headers}
                            rows={rows}
                            isCheckInput={false}
                            isActions={false}
                            showStatusFilter={false}
                            isTitle={true}
                            classContainer="w-full"
                        />
                    )}
                </div>
            </div>
        </Page>
    );
}
