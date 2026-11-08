import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBulkEstimateProjectTasksMutation } from "@/redux/projects/subscriberProjectsApi";
import { getApiErrorMessage } from "@/functions/apiErrorMessage";

export default function BulkTaskEstimates({ project }) {
    const { t } = useTranslation();
    const missing = (project?.tasks || []).filter((task) => !["completed", "done", "cancelled"].includes(task.status) && !Number(task.estimated_hours));
    const [values, setValues] = useState({});
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");
    const [submit, { isLoading }] = useBulkEstimateProjectTasksMutation();
    if (!missing.length) return null;
    const estimates = missing.filter((task) => values[task._id] !== undefined && values[task._id] !== "").map((task) => ({ task_id: String(task._id), hours: Number(values[task._id]) }));
    const valid = estimates.length > 0 && estimates.every((entry) => Number.isFinite(entry.hours) && entry.hours > 0 && entry.hours <= 10000);
    const run = async (apply) => {
        try {
            const response = await submit({ id: project._id, estimates, apply }).unwrap();
            const data = response?.data || response;
            if (data.conflicts?.length) { setPreview(null); setMessage(t("Some task estimates changed. Refresh and try again.")); return; }
            if (apply) { setPreview(null); setValues({}); setMessage(t("Task estimates updated", { count: data.updated })); }
            else { setPreview(JSON.stringify(estimates)); setMessage(t("Ready to update task estimates", { count: data.would_update })); }
        } catch (error) { setPreview(null); setMessage(getApiErrorMessage(error, t("Failed to update task estimates"))); }
    };
    return <section className="rounded-[24px] border border-status-border bg-surface p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-bold text-table-title">{t("Estimate missing task hours")}</h2>
        <p className="mt-1 text-sm text-cell-secondary">{t("Enter estimates, review them, then apply changes.")}</p>
        <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">{missing.map((task) => <label key={task._id} className="flex items-center justify-between gap-3 text-sm text-cell-primary"><span className="min-w-0 truncate">{task.title}</span><input type="number" min="0.1" max="10000" step="0.1" value={values[task._id] ?? ""} onChange={(event) => { setValues((current) => ({ ...current, [task._id]: event.target.value })); setPreview(null); setMessage(""); }} className="w-28 rounded-lg border border-status-border bg-surface px-2 py-1" aria-label={`${t("Estimated hours")}: ${task.title}`} /></label>)}</div>
        {message && <p className="mt-3 text-sm text-cell-secondary" role="status">{message}</p>}
        <div className="mt-4 flex gap-2"><button type="button" disabled={!valid || isLoading} onClick={() => run(false)} className="rounded-lg border border-primary-500 px-4 py-2 text-sm text-primary-600 disabled:opacity-50">{t("Review estimates")}</button><button type="button" disabled={!valid || preview !== JSON.stringify(estimates) || isLoading} onClick={() => run(true)} className="rounded-lg bg-primary-500 px-4 py-2 text-sm text-white disabled:opacity-50">{t("Apply estimates")}</button></div>
    </section>;
}
