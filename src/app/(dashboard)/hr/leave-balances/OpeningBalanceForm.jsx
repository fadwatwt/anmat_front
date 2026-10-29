"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAddLeaveBalanceEntryMutation, useGetLeavePoliciesQuery } from "@/redux/leaves/leavesApi";

export default function OpeningBalanceForm({ employeeId, onDone, onCancel }) {
    const { t } = useTranslation();
    const { data: policies = [], isLoading: policiesLoading, isError: policiesError } = useGetLeavePoliciesQuery();
    const [addBalance, { isLoading: isSaving }] = useAddLeaveBalanceEntryMutation();
    const [form, setForm] = useState({ policy_id: "", amount: "", effective_at: "", reason: "" });
    const [error, setError] = useState("");

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        try {
            await addBalance({
                employee_id: employeeId,
                policy_id: form.policy_id,
                amount: Number(form.amount),
                effective_at: form.effective_at,
                reason: form.reason,
                idempotency_key: `opening:${employeeId}:${form.policy_id}`,
            }).unwrap();
            onDone();
        } catch (requestError) {
            setError(t(requestError?.data?.message || "Failed to add opening balance"));
        }
    };

    return <form onSubmit={submit} className="mt-4 grid max-w-3xl gap-4 rounded-xl bg-status-bg p-4 sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2">
            <h3 className="font-semibold text-cell-primary">{t("Set Opening Balance")}</h3>
            <p className="mt-1 text-sm text-cell-secondary">{t("Only use this for employees who already have a leave balance from an earlier system. Create a policy first.")}</p>
        </div>
        {policiesLoading && <p className="text-sm text-cell-secondary sm:col-span-2">{t("Loading...")}</p>}
        {policiesError && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{t("Could not load leave policies")}</p>}
        {!policiesLoading && !policiesError && policies.length === 0 && <p className="text-sm text-cell-secondary sm:col-span-2">{t("No leave policies configured")} <Link href="/hr/leaves" className="text-primary-600 underline">{t("Create Policy")}</Link></p>}
        <label className="text-sm text-cell-secondary">{t("Leave Policy")}
            <select required value={form.policy_id} onChange={(event) => setForm((current) => ({ ...current, policy_id: event.target.value }))} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                <option value="">{t("Select leave policy")}</option>
                {policies.filter((policy) => policy.is_active).map((policy) => <option key={policy._id} value={policy._id}>{policy.name}</option>)}
            </select>
        </label>
        <label className="text-sm text-cell-secondary">{t("Opening Days")}
            <input required type="number" min="0" max="365" step="0.01" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
        </label>
        <label className="text-sm text-cell-secondary">{t("Balance transfer date")}
            <input required type="date" value={form.effective_at} onChange={(event) => setForm((current) => ({ ...current, effective_at: event.target.value }))} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
        </label>
        <label className="text-sm text-cell-secondary">{t("Reason")}
            <input required value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
        </label>
        {error && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex justify-end gap-2 sm:col-span-2">
            <button type="button" onClick={onCancel} className="rounded-lg border border-status-border px-4 py-2 text-sm text-cell-primary">{t("Cancel")}</button>
            <button disabled={isSaving || policiesLoading || policies.length === 0} className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? t("Saving...") : t("Add Opening Balance")}</button>
        </div>
    </form>;
}
