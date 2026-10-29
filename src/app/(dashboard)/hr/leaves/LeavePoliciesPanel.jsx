"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateLeavePolicyMutation, useGetLeavePoliciesQuery, useSetDefaultLeavePolicyMutation } from "@/redux/leaves/leavesApi";

const initialForm = {
    code: "ANNUAL",
    name: "",
    annual_allowance: "",
    carryover_limit: 0,
    counting_mode: "WORKING_DAYS",
    allow_negative_balance: false,
    exclude_public_holidays: true,
    accrual_frequency: "YEARLY",
    accrual_day: 1,
    policy_year_start_month: 1,
    policy_year_start_day: 1,
    is_default: false,
};

export default function LeavePoliciesPanel() {
    const { t } = useTranslation();
    const { data: policies = [], isLoading, isError } = useGetLeavePoliciesQuery();
    const [createPolicy, { isLoading: isSaving }] = useCreateLeavePolicyMutation();
    const [setDefaultPolicy, { isLoading: isChangingDefault }] = useSetDefaultLeavePolicyMutation();
    const [form, setForm] = useState(initialForm);
    const [showForm, setShowForm] = useState(false);
    const [selectedPolicyId, setSelectedPolicyId] = useState(null);
    const [message, setMessage] = useState(null);
    const selectedPolicy = policies.find((policy) => policy._id === selectedPolicyId);
    const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
    const allowance = Number(form.annual_allowance);
    const accrualPreview = form.annual_allowance !== "" && Number.isFinite(allowance)
        ? form.accrual_frequency === "MONTHLY"
            ? t("Monthly grant preview", { amount: (allowance / 12).toFixed(2) })
            : form.accrual_frequency === "YEARLY"
                ? t("Yearly grant preview", { amount: allowance })
                : t("No automatic days will be granted")
        : t("Enter the annual allowance to preview the grant");

    const submit = async (event) => {
        event.preventDefault();
        setMessage(null);
        try {
            await createPolicy({
                ...form,
                annual_allowance: Number(form.annual_allowance),
                carryover_limit: Number(form.carryover_limit),
                accrual_day: Number(form.accrual_day),
                policy_year_start_month: Number(form.policy_year_start_month),
                policy_year_start_day: Number(form.policy_year_start_day),
            }).unwrap();
            setMessage({ text: t("Leave policy created successfully"), error: false });
            setForm({ ...initialForm, code: "" });
            setShowForm(false);
        } catch (error) {
            setMessage({ text: t(error?.data?.message || "Failed to create leave policy"), error: true });
        }
    };
    const changeDefault = async (policyId) => {
        setMessage(null);
        try {
            await setDefaultPolicy(policyId).unwrap();
            setMessage({ text: t("Default leave policy updated"), error: false });
        } catch (error) {
            setMessage({ text: t(error?.data?.message || "Failed to update default policy"), error: true });
        }
    };

    return <section className="rounded-2xl border border-status-border bg-surface p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h2 className="text-lg font-bold text-cell-primary">{t("Leave Policies")}</h2>
                <p className="mt-1 text-sm text-cell-secondary">{t("Set your organization's leave entitlement and how leave days are calculated.")}</p>
                <p className="mt-2 max-w-3xl text-xs text-cell-secondary">{t("Create separate policies for different leave types. Each policy has its own employee balance. The default is preselected on new leave requests, and employees may choose another active policy.")}</p>
            </div>
            <button type="button" aria-expanded={showForm} onClick={() => { setShowForm((open) => !open); setMessage(null); }} className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white">
                {showForm ? t("Cancel") : t("Create Policy")}
            </button>
        </div>

        {message && <p role={message.error ? "alert" : "status"} className={`mt-4 text-sm ${message.error ? "text-red-600" : "text-green-700"}`}>{message.text}</p>}

        {!showForm && <div className="mt-6">
            {isLoading && <p className="text-sm text-cell-secondary">{t("Loading...")}</p>}
            {isError && <p role="alert" className="text-sm text-red-600">{t("Could not load leave policies")}</p>}
            {!isLoading && !isError && policies.length === 0 && <div className="rounded-xl border border-dashed border-status-border bg-status-bg px-5 py-8 text-center">
                <p className="font-semibold text-cell-primary">{t("No leave policies configured")}</p>
                <p className="mt-1 text-sm text-cell-secondary">{t("Create the first policy to define leave days for this organization.")}</p>
            </div>}
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {policies.map((policy) => <article key={policy._id} className="rounded-xl border border-status-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-cell-primary">{policy.name}</h3>
                        {policy.is_default && <span className="rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-600">{t("Default")}</span>}
                    </div>
                    <p className="mt-1 text-xs text-cell-secondary" dir="ltr">{policy.code}</p>
                    <p className="mt-3 text-sm text-cell-primary">{policy.annual_allowance} {t("days/year")}</p>
                    <p className="mt-1 text-sm text-cell-secondary">{t(policy.counting_mode)} · {t(policy.accrual_frequency)}</p>
                    <button type="button" aria-expanded={selectedPolicyId === policy._id} onClick={() => setSelectedPolicyId((current) => current === policy._id ? null : policy._id)} className="mt-3 rounded-lg border border-status-border px-3 py-1.5 text-sm font-semibold text-cell-primary hover:bg-status-bg">{selectedPolicyId === policy._id ? t("Hide details") : t("View details")}</button>
                </article>)}
            </div>
            {selectedPolicy && <div className="mt-4 rounded-xl border border-status-border bg-status-bg p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><h3 className="font-semibold text-cell-primary">{selectedPolicy.name}</h3><p className="text-sm text-cell-secondary" dir="ltr">{selectedPolicy.code}</p></div>
                    {!selectedPolicy.is_default && selectedPolicy.is_active && <button type="button" disabled={isChangingDefault} onClick={() => changeDefault(selectedPolicy._id)} className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isChangingDefault ? t("Saving...") : t("Set as default")}</button>}
                    {selectedPolicy.is_default && <span className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-600">{t("Default policy")}</span>}
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div><dt className="text-cell-secondary">{t("Annual Allowance")}</dt><dd className="font-medium text-cell-primary">{selectedPolicy.annual_allowance} {t("days/year")}</dd></div>
                    <div><dt className="text-cell-secondary">{t("Counting Mode")}</dt><dd className="font-medium text-cell-primary">{t(selectedPolicy.counting_mode)}</dd></div>
                    <div><dt className="text-cell-secondary">{t("Accrual Frequency")}</dt><dd className="font-medium text-cell-primary">{t(selectedPolicy.accrual_frequency)}</dd></div>
                    {selectedPolicy.accrual_amount != null && <div><dt className="text-cell-secondary">{t("Accrual Amount")}</dt><dd className="font-medium text-cell-primary">{selectedPolicy.accrual_amount} {t("days")}</dd></div>}
                    <div><dt className="text-cell-secondary">{t("Carryover Limit")}</dt><dd className="font-medium text-cell-primary">{selectedPolicy.carryover_limit ?? 0} {t("days")}</dd></div>
                    <div><dt className="text-cell-secondary">{t("Policy Year Start")}</dt><dd className="font-medium text-cell-primary">{selectedPolicy.policy_year_start_day}/{selectedPolicy.policy_year_start_month}</dd></div>
                    {selectedPolicy.accrual_frequency === "MONTHLY" && <div><dt className="text-cell-secondary">{t("Monthly Accrual Day")}</dt><dd className="font-medium text-cell-primary">{selectedPolicy.accrual_day}</dd></div>}
                    <div><dt className="text-cell-secondary">{t("Exclude public holidays")}</dt><dd className="font-medium text-cell-primary">{selectedPolicy.exclude_public_holidays ? t("Yes") : t("No")}</dd></div>
                    <div><dt className="text-cell-secondary">{t("Allow negative balance")}</dt><dd className="font-medium text-cell-primary">{selectedPolicy.allow_negative_balance ? t("Yes") : t("No")}</dd></div>
                    <div><dt className="text-cell-secondary">{t("Status")}</dt><dd className="font-medium text-cell-primary">{selectedPolicy.is_active ? t("Active") : t("Inactive")}</dd></div>
                </dl>
            </div>}
        </div>}

        {showForm && <form onSubmit={submit} className="mt-6 grid max-w-3xl grid-cols-1 gap-4 rounded-xl bg-status-bg p-4 sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2">
                <h3 className="font-semibold text-cell-primary">{t("Create a leave policy")}</h3>
                <p className="text-sm text-cell-secondary">{t("Choose the yearly allowance for this organization. No allowance is set automatically.")}</p>
            </div>
            <label className="text-sm text-cell-secondary">{t("Policy Name")}
                <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            </label>
            <label className="text-sm text-cell-secondary">{t("Code")}
                <input required value={form.code} onChange={(e) => update("code", e.target.value.toUpperCase())} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" dir="ltr" />
            </label>
            <label className="text-sm text-cell-secondary">{t("Annual Allowance")}
                <input required type="number" min="0" max="365" step="0.01" value={form.annual_allowance} onChange={(e) => update("annual_allowance", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            </label>
            <label className="text-sm text-cell-secondary">{t("Counting Mode")}
                <select value={form.counting_mode} onChange={(e) => update("counting_mode", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                    <option value="WORKING_DAYS">{t("Working Days")}</option><option value="CALENDAR_DAYS">{t("Calendar Days")}</option>
                </select>
            </label>
            <label className="text-sm text-cell-secondary sm:col-span-2">{t("Accrual Frequency")}
                <select value={form.accrual_frequency} onChange={(e) => update("accrual_frequency", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary">
                    <option value="NONE">{t("No automatic accrual")}</option><option value="MONTHLY">{t("Monthly")}</option><option value="YEARLY">{t("Yearly")}</option>
                </select>
            </label>
            <p role="status" className="rounded-lg border border-status-border bg-surface p-3 text-sm text-cell-primary sm:col-span-2">{accrualPreview}</p>
            <p className="text-xs text-cell-secondary sm:col-span-2">{t("New employees receive automatic days on the next scheduled grant date; partial-year proration is not configured yet.")}</p>
            {form.accrual_frequency !== "NONE" && <>
                <label className="text-sm text-cell-secondary">{t("Policy Year Start Month")}
                    <input required type="number" min="1" max="12" value={form.policy_year_start_month} onChange={(e) => update("policy_year_start_month", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                </label>
                <label className="text-sm text-cell-secondary">{t("Policy Year Start Day")}
                    <input required type="number" min="1" max="28" value={form.policy_year_start_day} onChange={(e) => update("policy_year_start_day", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                </label>
            </>}
            {form.accrual_frequency === "MONTHLY" && <label className="text-sm text-cell-secondary sm:col-span-2">{t("Monthly Accrual Day")}
                <input required type="number" min="1" max="28" value={form.accrual_day} onChange={(e) => update("accrual_day", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
            </label>}
            <details className="rounded-lg border border-status-border bg-surface p-3 sm:col-span-2">
                <summary className="cursor-pointer font-semibold text-cell-primary">{t("Advanced leave settings")}</summary>
                <label className="mt-3 block text-sm text-cell-secondary">{t("Carryover Limit")}
                    <input required type="number" min="0" max="365" step="0.01" value={form.carryover_limit} onChange={(e) => update("carryover_limit", e.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2 text-cell-primary" />
                </label>
                <label className="mt-3 flex items-center gap-2 text-sm text-cell-secondary"><input type="checkbox" checked={form.exclude_public_holidays} onChange={(e) => update("exclude_public_holidays", e.target.checked)} />{t("Exclude public holidays")}</label>
                <label className="mt-3 flex items-center gap-2 text-sm text-cell-secondary"><input type="checkbox" checked={form.allow_negative_balance} onChange={(e) => update("allow_negative_balance", e.target.checked)} />{t("Allow negative balance")}</label>
            </details>
            <p className="text-sm text-cell-secondary sm:col-span-2">{Number(form.carryover_limit) === 0 ? t("Zero carryover means unused days expire at the policy year boundary.") : t("Carryover preview", { amount: form.carryover_limit })}</p>
            <div className="flex justify-end gap-2 sm:col-span-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-status-border px-4 py-2 text-sm text-cell-primary">{t("Cancel")}</button>
                <button disabled={isSaving} className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? t("Saving...") : t("Create Policy")}</button>
            </div>
        </form>}
    </section>;
}
