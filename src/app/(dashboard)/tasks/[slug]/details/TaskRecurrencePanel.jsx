import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useConfigureTaskRecurrenceMutation, useGetTaskRecurrencesQuery, useStopTaskRecurrenceMutation } from "@/redux/tasks/subscriberTasksApi";
import { getApiErrorMessage } from "@/functions/apiErrorMessage";

export default function TaskRecurrencePanel({ taskId }) {
    const { t } = useTranslation();
    const { data: rules = [] } = useGetTaskRecurrencesQuery();
    const rule = rules.find((item) => String(item.source_task_id) === String(taskId));
    const [configure, { isLoading }] = useConfigureTaskRecurrenceMutation();
    const [stop] = useStopTaskRecurrenceMutation();
    const [cadence, setCadence] = useState("weekly");
    const [interval, setInterval] = useState(1);
    const [first, setFirst] = useState("");
    const [until, setUntil] = useState("");
    const [message, setMessage] = useState("");
    const save = async () => {
        try {
            await configure({ taskId, cadence, interval: Number(interval), first_occurrence: first, ...(until ? { until } : {}) }).unwrap();
            setMessage(t("Recurring task saved"));
        } catch (error) { setMessage(getApiErrorMessage(error, t("Could not save recurring task"))); }
    };
    return <section className="rounded-[24px] border border-status-border bg-surface p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-bold text-table-title">{t("Recurring task")}</h2>
        {rule?.active && <p className="mt-2 text-sm text-cell-secondary">{t("Next occurrence")}: {new Date(rule.next_run_at).toLocaleDateString()}</p>}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="text-sm text-cell-primary">{t("Repeat every")}<select value={cadence} onChange={(event) => setCadence(event.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2"><option value="daily">{t("Day")}</option><option value="weekly">{t("Week")}</option><option value="monthly">{t("Month")}</option></select></label>
            <label className="text-sm text-cell-primary">{t("Interval")}<input type="number" min="1" max="12" value={interval} onChange={(event) => setInterval(event.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2" /></label>
            <label className="text-sm text-cell-primary">{t("First occurrence")}<input type="date" value={first} onChange={(event) => setFirst(event.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2" /></label>
            <label className="text-sm text-cell-primary">{t("Repeat until (optional)")}<input type="date" value={until} onChange={(event) => setUntil(event.target.value)} className="mt-1 w-full rounded-lg border border-status-border bg-surface p-2" /></label>
        </div>
        {message && <p role="status" className="mt-2 text-sm text-cell-secondary">{message}</p>}
        <div className="mt-3 flex gap-2"><button type="button" disabled={!first || isLoading} onClick={save} className="rounded-lg bg-primary-500 px-3 py-2 text-sm text-white disabled:opacity-50">{t("Save recurrence")}</button>{rule?.active && <button type="button" onClick={async () => { await stop(taskId); setMessage(t("Recurring task stopped")); }} className="rounded-lg border border-status-border px-3 py-2 text-sm text-cell-primary">{t("Stop recurrence")}</button>}</div>
    </section>;
}
