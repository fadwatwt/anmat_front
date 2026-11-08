import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateTaskAutomationMutation, useGetTaskAutomationHistoryQuery, useGetTaskAutomationsQuery, useStopTaskAutomationMutation } from "@/redux/tasks/subscriberTasksApi";
import { getApiErrorMessage } from "@/functions/apiErrorMessage";

export default function TaskAutomationPanel() {
    const { t } = useTranslation();
    const { data: rules = [] } = useGetTaskAutomationsQuery();
    const { data: history = [] } = useGetTaskAutomationHistoryQuery(undefined, { pollingInterval: 60000 });
    const [create, { isLoading }] = useCreateTaskAutomationMutation();
    const [stop] = useStopTaskAutomationMutation();
    const [name, setName] = useState("");
    const [status, setStatus] = useState("completed");
    const [priority, setPriority] = useState("high");
    const [message, setMessage] = useState("");
    const add = async () => {
        try { await create({ name, trigger_status: status, action_priority: priority }).unwrap(); setName(""); setMessage(t("Automation rule saved")); }
        catch (error) { setMessage(getApiErrorMessage(error, t("Could not save automation rule"))); }
    };
    return <section className="rounded-xl border border-status-border bg-surface p-4">
        <h2 className="font-semibold text-cell-primary">{t("Task automation")}</h2>
        <p className="mt-1 text-sm text-cell-secondary">{t("Change task priority automatically when its status changes.")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
            <input aria-label={t("Rule name")} value={name} onChange={(event) => setName(event.target.value)} placeholder={t("Rule name")} className="rounded-lg border border-status-border bg-surface px-3 py-2 text-sm" />
            <select aria-label={t("When status becomes")} value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-status-border bg-surface px-3 py-2 text-sm">{["open", "pending", "in-progress", "completed", "done", "rejected", "cancelled"].map((item) => <option key={item} value={item}>{t(item)}</option>)}</select>
            <select aria-label={t("Set priority to")} value={priority} onChange={(event) => setPriority(event.target.value)} className="rounded-lg border border-status-border bg-surface px-3 py-2 text-sm">{["low", "medium", "high", "urgent"].map((item) => <option key={item} value={item}>{t(item)}</option>)}</select>
            <button type="button" disabled={!name.trim() || isLoading} onClick={add} className="rounded-lg bg-primary-500 px-3 py-2 text-sm text-white disabled:opacity-50">{t("Add rule")}</button>
        </div>
        {message && <p role="status" className="mt-2 text-sm text-cell-secondary">{message}</p>}
        <ul className="mt-3 space-y-1 text-sm">{rules.filter((rule) => rule.active).map((rule) => <li key={rule._id} className="flex items-center justify-between gap-2"><span className="text-cell-primary">{rule.name}: {t(rule.trigger_status)} → {t(rule.action_priority)}</span><button type="button" onClick={() => stop(rule._id)} className="text-red-600">{t("Stop rule")}</button></li>)}</ul>
        {history.length > 0 && <details className="mt-3 text-sm text-cell-secondary"><summary className="cursor-pointer">{t("Automation history")}</summary><ul className="mt-2 space-y-1">{history.slice(0, 10).map((entry) => <li key={entry._id}>{new Date(entry.createdAt || entry.updatedAt).toLocaleString()} · {t(entry.outcome)} · {String(entry.task_id)}</li>)}</ul></details>}
    </section>;
}
