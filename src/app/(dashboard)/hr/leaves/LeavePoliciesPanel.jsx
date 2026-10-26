"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    useCreateLeavePolicyMutation,
    useGetLeavePoliciesQuery,
    useAddLeaveBalanceEntryMutation,
} from "@/redux/leaves/leavesApi";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";

const initialForm = {
    code: "ANNUAL",
    name: "Annual Leave",
    annual_allowance: 14,
    carryover_limit: 0,
    counting_mode: "WORKING_DAYS",
    allow_negative_balance: false,
    exclude_public_holidays: true,
    accrual_frequency: "YEARLY",
    accrual_amount: 14,
    accrual_day: 1,
    policy_year_start_month: 1,
    policy_year_start_day: 1,
    is_default: true,
};

export default function LeavePoliciesPanel() {
    const { t } = useTranslation();
    const { data: policies = [], isLoading } = useGetLeavePoliciesQuery();
    const [createPolicy, { isLoading: isSaving }] = useCreateLeavePolicyMutation();
    const [addBalance, { isLoading: isAddingBalance }] = useAddLeaveBalanceEntryMutation();
    const { data: employees = [] } = useGetEmployeesQuery();
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [balanceForm, setBalanceForm] = useState({ employee_id: "", policy_id: "", amount: 0, reason: "Opening balance" });

    const update = (field, value) => setForm(current => ({ ...current, [field]: value }));
    const submit = async (event) => {
        event.preventDefault();
        setMessage("");
        try {
            await createPolicy({
                ...form,
                annual_allowance: Number(form.annual_allowance),
                carryover_limit: Number(form.carryover_limit),
                accrual_amount: Number(form.accrual_amount),
                accrual_day: Number(form.accrual_day),
                policy_year_start_month: Number(form.policy_year_start_month),
                policy_year_start_day: Number(form.policy_year_start_day),
            }).unwrap();
            setMessage(t("Leave policy created successfully"));
            setForm({ ...initialForm, code: "", name: "", is_default: false });
        } catch (error) {
            setMessage(t(error?.data?.message || "Failed to create leave policy"));
        }
    };
    const submitBalance = async (event) => {
        event.preventDefault();
        setMessage("");
        try {
            await addBalance({
                ...balanceForm,
                amount: Number(balanceForm.amount),
                idempotency_key: `opening:${balanceForm.employee_id}:${balanceForm.policy_id}:${new Date().getFullYear()}`,
            }).unwrap();
            setMessage(t("Opening balance added successfully"));
            setBalanceForm(current => ({ ...current, amount: 0 }));
        } catch (error) {
            setMessage(t(error?.data?.message || "Failed to add opening balance"));
        }
    };

    return (
        <section className="rounded-2xl border border-status-border bg-surface p-4">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-cell-primary">{t("Leave Policies")}</h2>
                <p className="text-sm text-cell-secondary">{t("Policies control balance checks and how requested days are counted.")}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <form onSubmit={submit} className="grid grid-cols-1 gap-3 rounded-xl bg-status-bg p-4 sm:grid-cols-2">
                    <label className="text-sm text-cell-secondary">
                        {t("Code")}
                        <input required value={form.code} onChange={e => update("code", e.target.value.toUpperCase())} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                    </label>
                    <label className="text-sm text-cell-secondary">
                        {t("Policy Name")}
                        <input required value={form.name} onChange={e => update("name", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                    </label>
                    <label className="text-sm text-cell-secondary">
                        {t("Annual Allowance")}
                        <input required type="number" min="0" max="365" value={form.annual_allowance} onChange={e => update("annual_allowance", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                    </label>
                    <label className="text-sm text-cell-secondary">
                        {t("Carryover Limit")}
                        <input required type="number" min="0" max="365" value={form.carryover_limit} onChange={e => update("carryover_limit", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                    </label>
                    <label className="text-sm text-cell-secondary sm:col-span-2">
                        {t("Counting Mode")}
                        <select value={form.counting_mode} onChange={e => update("counting_mode", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                            <option value="WORKING_DAYS">{t("Working Days")}</option>
                            <option value="CALENDAR_DAYS">{t("Calendar Days")}</option>
                        </select>
                    </label>
                    <label className="text-sm text-cell-secondary">
                        {t("Accrual Frequency")}
                        <select value={form.accrual_frequency} onChange={e => update("accrual_frequency", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                            <option value="NONE">{t("No automatic accrual")}</option>
                            <option value="MONTHLY">{t("Monthly")}</option>
                            <option value="YEARLY">{t("Yearly")}</option>
                        </select>
                    </label>
                    <label className="text-sm text-cell-secondary">
                        {t("Accrual Amount")}
                        <input type="number" min="0" max="365" step="0.01" value={form.accrual_amount} onChange={e => update("accrual_amount", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                    </label>
                    <label className="text-sm text-cell-secondary">
                        {t("Policy Year Start Month")}
                        <input type="number" min="1" max="12" value={form.policy_year_start_month} onChange={e => update("policy_year_start_month", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                    </label>
                    <label className="text-sm text-cell-secondary">
                        {t("Policy Year Start Day")}
                        <input type="number" min="1" max="28" value={form.policy_year_start_day} onChange={e => update("policy_year_start_day", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                    </label>
                    {form.accrual_frequency === "MONTHLY" && <label className="text-sm text-cell-secondary sm:col-span-2">
                        {t("Monthly Accrual Day")}
                        <input type="number" min="1" max="28" value={form.accrual_day} onChange={e => update("accrual_day", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                    </label>}
                    <label className="flex items-center gap-2 text-sm text-cell-secondary">
                        <input type="checkbox" checked={form.exclude_public_holidays} onChange={e => update("exclude_public_holidays", e.target.checked)} />
                        {t("Exclude public holidays")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-cell-secondary">
                        <input type="checkbox" checked={form.allow_negative_balance} onChange={e => update("allow_negative_balance", e.target.checked)} />
                        {t("Allow negative balance")}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-cell-secondary">
                        <input type="checkbox" checked={form.is_default} onChange={e => update("is_default", e.target.checked)} />
                        {t("Default policy")}
                    </label>
                    <button disabled={isSaving} className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">
                        {isSaving ? t("Saving...") : t("Create Policy")}
                    </button>
                    {message && <p className="text-sm text-cell-secondary sm:col-span-2">{message}</p>}
                </form>

                <div className="flex flex-col gap-2">
                    {isLoading ? <p className="text-sm text-cell-secondary">{t("Loading...")}</p> : policies.map(policy => (
                        <div key={policy._id} className="rounded-xl border border-status-border p-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-cell-primary">{policy.name}</span>
                                {policy.is_default && <span className="rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-600">{t("Default")}</span>}
                            </div>
                            <p className="mt-1 text-xs text-cell-secondary">
                                {policy.code} • {policy.annual_allowance} {t("days/year")} • {t(policy.counting_mode)} • {t(policy.accrual_frequency)}
                            </p>
                        </div>
                    ))}
                    {!isLoading && policies.length === 0 && <p className="text-sm text-cell-secondary">{t("No leave policies configured")}</p>}

                    <form onSubmit={submitBalance} className="mt-3 grid gap-3 rounded-xl bg-status-bg p-4 sm:grid-cols-2">
                        <h3 className="font-semibold text-cell-primary sm:col-span-2">{t("Set Opening Balance")}</h3>
                        <label className="text-sm text-cell-secondary">
                            {t("Employee")}
                            <select required value={balanceForm.employee_id} onChange={e => setBalanceForm(current => ({ ...current, employee_id: e.target.value }))} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                                <option value="">{t("Select Employee")}</option>
                                {employees.filter(employee => employee.registration_status !== "pending").map(employee => <option key={employee.user_id} value={employee.user_id}>{employee.user?.name}</option>)}
                            </select>
                        </label>
                        <label className="text-sm text-cell-secondary">
                            {t("Leave Policy")}
                            <select required value={balanceForm.policy_id} onChange={e => setBalanceForm(current => ({ ...current, policy_id: e.target.value }))} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                                <option value="">{t("Select leave policy")}</option>
                                {policies.filter(policy => policy.is_active).map(policy => <option key={policy._id} value={policy._id}>{policy.name}</option>)}
                            </select>
                        </label>
                        <label className="text-sm text-cell-secondary">
                            {t("Opening Days")}
                            <input required type="number" min="0" value={balanceForm.amount} onChange={e => setBalanceForm(current => ({ ...current, amount: e.target.value }))} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                        </label>
                        <label className="text-sm text-cell-secondary">
                            {t("Reason")}
                            <input required value={balanceForm.reason} onChange={e => setBalanceForm(current => ({ ...current, reason: e.target.value }))} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                        </label>
                        <button disabled={isAddingBalance || policies.length === 0} className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">
                            {isAddingBalance ? t("Saving...") : t("Add Opening Balance")}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
