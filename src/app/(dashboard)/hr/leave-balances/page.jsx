"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import { usePermission } from "@/Hooks/usePermission";
import { useSelector } from "react-redux";
import { selectPermissionsLoaded } from "@/redux/auth/authSlice";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import {
    useGetEmployeeLeaveBalancesQuery,
    useGetEmployeeLeaveBalanceHistoryQuery,
} from "@/redux/leaves/leavesApi";
import OpeningBalanceForm from "./OpeningBalanceForm";

const movementLabels = {
    OPENING: "Opening balance",
    ACCRUAL: "Granted days",
    HOLD: "Reserved for pending request",
    RELEASE: "Reservation released",
    CONSUME: "Approved leave used",
    ADJUSTMENT: "Manual adjustment",
    CARRYOVER: "Yearly carryover adjustment",
};

export default function LeaveBalancesPage() {
    const { t, i18n } = useTranslation();
    const permissionsLoaded = useSelector(selectPermissionsLoaded);
    const canManage = usePermission("leave_policies.manage_settings");
    const [employeeId, setEmployeeId] = useState("");
    const [showImport, setShowImport] = useState(false);
    const [imported, setImported] = useState(false);
    const { data: employees = [], isLoading: employeesLoading, isError: employeesError } = useGetEmployeesQuery(undefined, { skip: !canManage });
    const { data: balances = [], isLoading: balancesLoading, isError: balancesError } = useGetEmployeeLeaveBalancesQuery(employeeId, { skip: !canManage || !employeeId });
    const { data: history = [], isLoading: historyLoading, isError: historyError } = useGetEmployeeLeaveBalanceHistoryQuery(employeeId, { skip: !canManage || !employeeId });

    if (!permissionsLoaded) return <Page title={t("Employee leave balances")}><p className="text-cell-secondary">{t("Loading...")}</p></Page>;
    if (!canManage) return <Page title={t("Employee leave balances")}><p className="text-cell-secondary">{t("You do not have permission to view employee leave balances.")}</p></Page>;

    return (
        <Page title={t("Employee leave balances")}>
            <div className="space-y-5">
                <p className="text-sm text-cell-secondary">{t("Choose an employee to inspect available, reserved, and used days and the latest balance movements.")}</p>
                <label className="block max-w-md text-sm text-cell-secondary">
                    {t("Employee")}
                    <select value={employeeId} onChange={(event) => { setEmployeeId(event.target.value); setShowImport(false); setImported(false); }} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                        <option value="">{t("Select Employee")}</option>
                        {employees.filter((employee) => employee.registration_status !== "pending").map((employee) => (
                            <option key={employee.user_id} value={employee.user_id}>{employee.user?.name || employee.employee_number || employee.user_id}</option>
                        ))}
                    </select>
                </label>
                {employeesLoading && <p className="text-sm text-cell-secondary">{t("Loading...")}</p>}
                {employeesError && <p role="alert" className="text-sm text-red-600">{t("Could not load employees")}</p>}
                {employeeId && <>
                    <section className="rounded-2xl border border-status-border bg-surface p-4 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="font-semibold text-cell-primary">{t("Import existing balances")}</h2>
                                <p className="mt-1 text-sm text-cell-secondary">{t("Use only when moving an employee's existing leave days from another system.")}</p>
                            </div>
                            <button type="button" aria-expanded={showImport} onClick={() => { setShowImport((open) => !open); setImported(false); }} className="rounded-lg border border-status-border px-4 py-2 text-sm font-semibold text-cell-primary">{showImport ? t("Cancel") : t("Set Opening Balance")}</button>
                        </div>
                        {imported && <p role="status" className="mt-3 text-sm text-green-700">{t("Opening balance added successfully")}</p>}
                        {showImport && <OpeningBalanceForm employeeId={employeeId} onDone={() => { setShowImport(false); setImported(true); }} onCancel={() => setShowImport(false)} />}
                    </section>
                    <section className="rounded-2xl border border-status-border bg-surface p-4">
                        <h2 className="mb-3 font-semibold text-cell-primary">{t("Current balances")}</h2>
                        {balancesLoading && <p className="text-sm text-cell-secondary">{t("Loading...")}</p>}
                        {balancesError && <p role="alert" className="text-sm text-red-600">{t("Could not load leave balances")}</p>}
                        {!balancesLoading && !balancesError && balances.length === 0 && <p className="text-sm text-cell-secondary">{t("No leave policies configured")}</p>}
                        <div className="grid gap-3 md:grid-cols-2">
                            {balances.map((item) => <div key={item.policy._id} className="rounded-xl border border-status-border p-3">
                                <h3 className="font-semibold text-cell-primary">{item.policy.name}</h3>
                                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                                    <div><p className="text-cell-secondary">{t("Available days")}</p><strong className="text-cell-primary">{item.balance}</strong></div>
                                    <div><p className="text-cell-secondary">{t("Reserved days")}</p><strong className="text-cell-primary">{item.held}</strong></div>
                                    <div><p className="text-cell-secondary">{t("Used days")}</p><strong className="text-cell-primary">{item.consumed}</strong></div>
                                </div>
                            </div>)}
                        </div>
                    </section>
                    <section className="rounded-2xl border border-status-border bg-surface p-4">
                        <h2 className="mb-1 font-semibold text-cell-primary">{t("Balance movement history")}</h2>
                        <p className="mb-3 text-xs text-cell-secondary">{t("Showing the latest 100 movements")}</p>
                        {historyLoading && <p className="text-sm text-cell-secondary">{t("Loading...")}</p>}
                        {historyError && <p role="alert" className="text-sm text-red-600">{t("Could not load balance history")}</p>}
                        {!historyLoading && !historyError && history.length === 0 && <p className="text-sm text-cell-secondary">{t("No balance movements yet")}</p>}
                        {!historyLoading && !historyError && history.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[580px] text-sm">
                            <thead><tr className="border-b border-status-border text-cell-secondary"><th className="p-2 text-start">{t("Date")}</th><th className="p-2 text-start">{t("Leave Policy")}</th><th className="p-2 text-start">{t("Movement")}</th><th className="p-2 text-start">{t("Days")}</th></tr></thead>
                            <tbody>{history.map((entry) => <tr key={entry._id} className="border-b border-status-border text-cell-primary">
                                <td className="p-2">{new Date(entry.effective_at).toLocaleDateString(i18n.language === "ar" ? "ar-PS" : "en-US")}</td>
                                <td className="p-2">{balances.find((item) => item.policy._id === entry.policy_id)?.policy.name || "—"}</td>
                                <td className="p-2">{t(movementLabels[entry.transaction_type] || entry.transaction_type)}</td>
                                <td className="p-2" dir="ltr">{entry.amount > 0 ? "+" : ""}{entry.amount}</td>
                            </tr>)}</tbody>
                        </table></div>}
                    </section>
                </>}
            </div>
        </Page>
    );
}
