"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { useGetEmployeeSalaryTransactionsQuery } from "@/redux/financial/employeeSalariesApi";
import { translateDate } from "@/functions/Days";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";
import { useGetMyPayslipsQuery } from "@/redux/employees/payrollRunsApi";

export default function EmployeeSalaryPage() {
    const { t } = useTranslation();
    const userType = useSelector(selectUserType);
    const { data: transactions = [], isLoading, isError } = useGetEmployeeSalaryTransactionsQuery();
    const { data: payslips = [], isLoading: loadingPayslips, error: payslipsError } = useGetMyPayslipsQuery(undefined, { skip: userType !== "Employee" });

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
                        {transaction.employee?.email || t("N/A")}
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

    return (
        <Page title={t("Salary Transactions")}>
            <div className="flex flex-col gap-6">
                {userType === "Employee" && <section className="rounded-2xl border border-status-border bg-surface p-5">
                    <h2 className="mb-3 text-lg font-semibold text-cell-primary">{t("My payslips")}</h2>
                    {loadingPayslips && <p className="text-cell-secondary">{t("Loading...")}</p>}
                    {payslipsError && <p role="alert" className="text-red-error">{t("Failed to load payslips")}</p>}
                    {!loadingPayslips && !payslipsError && !payslips.length && <p className="text-cell-secondary">{t("No payslips yet")}</p>}
                    <div className="space-y-2">{payslips.map((payslip) => {
                        const snapshot = payslip.immutable_snapshot;
                        const run = snapshot?.run;
                        const item = snapshot?.item;
                        const digits = run?.currency_minor_unit_digits ?? (run?.currency
                            ? new Intl.NumberFormat("en", { style: "currency", currency: run.currency }).resolvedOptions().maximumFractionDigits
                            : 2);
                        const money = (value) => run?.currency
                            ? new Intl.NumberFormat(undefined, { style: "currency", currency: run.currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format((value || 0) / 10 ** digits)
                            : value;
                        return <details key={payslip._id} className="rounded-lg bg-status-bg p-3 text-sm text-cell-primary">
                            <summary className="cursor-pointer font-medium">{run?.name || t("Payslip")} · {new Date(payslip.issued_at).toLocaleDateString()} · {money(item?.net_minor)}</summary>
                            <p className="mt-2">{t("Gross")}: {money(item?.gross_minor)} · {t("Deductions")}: {money(item?.deductions_minor)} · {t("Net")}: {money(item?.net_minor)}</p>
                            <ul className="mt-1">{item?.components?.map((component) => <li key={component.code}>{component.name}: {money(component.amount_minor)}</li>)}</ul>
                        </details>;
                    })}</div>
                </section>}
                <div className="flex flex-col gap-2 h-full">
                    {isError ? (
                        <div role="alert" className="text-center text-red-error mt-8 font-medium">
                            {t("Failed to load salary transactions. Please try again later.")}
                        </div>
                    ) : isLoading ? (
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
