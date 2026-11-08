"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePermission } from "@/Hooks/usePermission";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetLeavePoliciesQuery } from "@/redux/leaves/leavesApi";
import { useCancelGroupHolidayMutation, useCreateGroupHolidayMutation, useGetGroupHolidaysQuery, usePreviewGroupHolidayMutation } from "@/redux/holidays/holidaysApi";

const emptyForm = { name: "", reason: "", start_date: "", end_date: "", employee_ids: [], deduct_from_balance: false, leave_policy_id: "", settle_overlaps: false };

export default function GroupHolidayForm() {
    const { t } = useTranslation();
    const canCreate = usePermission("holidays.create");
    const canCancel = usePermission("holidays.delete");
    const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canCreate });
    const { data: policies = [] } = useGetLeavePoliciesQuery(undefined, { skip: !canCreate });
    const { data: groups = [] } = useGetGroupHolidaysQuery();
    const [previewHoliday, { isLoading: previewing }] = usePreviewGroupHolidayMutation();
    const [createHoliday, { isLoading: creating }] = useCreateGroupHolidayMutation();
    const [cancelHoliday, { isLoading: cancelling }] = useCancelGroupHolidayMutation();
    const [form, setForm] = useState(emptyForm);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [cancelId, setCancelId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const update = (field, value) => { setForm(current => ({ ...current, [field]: value })); setPreview(null); setError(""); };
    const payload = () => ({ ...form, leave_policy_id: form.deduct_from_balance ? form.leave_policy_id : undefined });
    const runPreview = async event => {
        event.preventDefault();
        try { setPreview((await previewHoliday(payload()).unwrap()).data); setError(""); }
        catch (err) { setError(err?.data?.message || t("Could not preview group holiday")); }
    };
    const apply = async () => {
        if (!preview?.can_apply) return;
        try { await createHoliday(payload()).unwrap(); setForm(emptyForm); setPreview(null); setError(""); }
        catch (err) { setError(err?.data?.message?.message || err?.data?.message || t("Could not create group holiday")); }
    };
    const applyCancellation = async () => {
        if (!cancelId || !cancelReason.trim()) return;
        try { await cancelHoliday({ id: cancelId, reason: cancelReason.trim() }).unwrap(); setCancelId(null); setCancelReason(""); setError(""); }
        catch (err) { setError(err?.data?.message || t("Could not cancel group holiday")); }
    };
    return <section className="mt-6 rounded-2xl border border-status-border bg-surface p-4">
        <h2 className="text-lg font-bold text-cell-primary">{t("Group holiday")}</h2>
        <p className="mt-1 text-sm text-cell-secondary">{t("Select employees, dates, and whether to deduct leave balance. Preview before applying.")}</p>
        {canCreate && <form onSubmit={runPreview} className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm text-cell-secondary">{t("Holiday Name")}<input required maxLength={150} value={form.name} onChange={e => update("name", e.target.value)} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" /></label>
            <label className="grid gap-1 text-sm text-cell-secondary">{t("Reason")}<input required maxLength={500} value={form.reason} onChange={e => update("reason", e.target.value)} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" /></label>
            <label className="grid gap-1 text-sm text-cell-secondary">{t("Start date")}<input required type="date" value={form.start_date} onChange={e => update("start_date", e.target.value)} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" /></label>
            <label className="grid gap-1 text-sm text-cell-secondary">{t("End date")}<input required type="date" min={form.start_date || undefined} value={form.end_date} onChange={e => update("end_date", e.target.value)} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" /></label>
            <div className="md:col-span-2">
                <div className="flex items-center gap-3"><span className="text-sm text-cell-secondary">{t("Employees")}</span><button type="button" onClick={() => update("employee_ids", employees.map(item => item.user_id))} className="text-sm text-primary-600 underline">{t("Select all")}</button><button type="button" onClick={() => update("employee_ids", [])} className="text-sm text-cell-secondary underline">{t("Clear")}</button></div>
                <div className="mt-2 grid max-h-44 gap-2 overflow-y-auto rounded-lg border border-status-border p-3 sm:grid-cols-2 lg:grid-cols-3">{employees.map(employee => <label key={employee.user_id} className="flex items-center gap-2 text-sm text-cell-primary"><input type="checkbox" checked={form.employee_ids.includes(employee.user_id)} onChange={e => update("employee_ids", e.target.checked ? [...form.employee_ids, employee.user_id] : form.employee_ids.filter(id => id !== employee.user_id))} />{employee.user?.name || employee.user_id}</label>)}</div>
            </div>
            <label className="flex items-center gap-2 text-sm text-cell-primary"><input type="checkbox" checked={form.deduct_from_balance} onChange={e => update("deduct_from_balance", e.target.checked)} />{t("Deduct from leave balance")}</label>
            <label className="flex items-center gap-2 text-sm text-cell-primary"><input type="checkbox" checked={form.settle_overlaps} onChange={e => update("settle_overlaps", e.target.checked)} />{t("Settle overlapping leave requests")}</label>
            {form.deduct_from_balance && <label className="grid gap-1 text-sm text-cell-secondary">{t("Leave Policy")}<select required value={form.leave_policy_id} onChange={e => update("leave_policy_id", e.target.value)} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary"><option value="">{t("Select policy")}</option>{policies.filter(item => item.is_active).map(policy => <option key={policy._id} value={policy._id}>{policy.name}</option>)}</select></label>}
            <button disabled={previewing || !form.employee_ids.length} className="rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white disabled:opacity-50">{t("Preview")}</button>
        </form>}
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{String(error)}</p>}
        {preview && <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="p-2 text-start">{t("Employee")}</th><th className="p-2 text-start">{t("Days")}</th><th className="p-2 text-start">{t("Balance before")}</th><th className="p-2 text-start">{t("Refunded days")}</th><th className="p-2 text-start">{t("Balance after")}</th><th className="p-2 text-start">{t("Conflicts")}</th></tr></thead><tbody>{preview.employees.map(item => <tr key={item.employee_id} className="border-t border-status-border"><td className="p-2">{employees.find(e => e.user_id === item.employee_id)?.user?.name || item.employee_id}</td><td className="p-2">{item.days}</td><td className="p-2">{item.balance_before ?? "—"}</td><td className="p-2">{item.refunded_days || 0}</td><td className="p-2">{item.balance_after ?? "—"}</td><td className="p-2">{item.conflicts.map(t).join(", ") || "—"}</td></tr>)}</tbody></table><button type="button" disabled={!preview.can_apply || creating} onClick={apply} className="mt-3 rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white disabled:opacity-50">{t("Apply group holiday")}</button></div>}
        <div className="mt-6"><h3 className="font-semibold text-cell-primary">{t("Previous group holidays")}</h3><div className="mt-2 grid gap-2">{groups.map(group => <div key={group._id} className="rounded-lg border border-status-border p-2 text-sm text-cell-secondary">{group.name} · {group.start_date?.slice(0, 10)} – {group.end_date?.slice(0, 10)} · {group.employee_ids?.length} {t("employees")} · {group.deduct_from_balance ? t("Deducted") : t("Not deducted")} · {t(group.status || "ACTIVE")}{canCancel && group.status !== "CANCELLED" && <button type="button" onClick={() => { setCancelId(group._id); setCancelReason(""); }} className="ms-3 text-red-600 underline">{t("Cancel group holiday")}</button>}{cancelId === group._id && <div className="mt-2 flex flex-wrap gap-2"><input value={cancelReason} onChange={e => setCancelReason(e.target.value)} maxLength={500} placeholder={t("Cancellation reason")} className="rounded-lg border border-status-border bg-surface p-2 text-cell-primary" /><button type="button" disabled={cancelling || !cancelReason.trim()} onClick={applyCancellation} className="rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-50">{t("Confirm cancellation")}</button><button type="button" onClick={() => setCancelId(null)}>{t("Back")}</button></div>}</div>)}</div></div>
    </section>;
}
