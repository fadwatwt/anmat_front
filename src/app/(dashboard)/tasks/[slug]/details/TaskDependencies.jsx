"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const isFinished = (status) => status === "completed" || status === "done";

export default function TaskDependencies({ task, tasks = [], graph, canEdit, isUpdating, onReplace }) {
    const { t, i18n } = useTranslation();
    const [isAdding, setIsAdding] = useState(false);
    const [search, setSearch] = useState("");
    const blockedByIds = task.blocked_by_ids || [];
    const taskById = useMemo(() => new Map(tasks.map((item) => [String(item._id), item])), [tasks]);
    const dependencies = graph?.predecessors || blockedByIds.map((id) => {
        const item = taskById.get(String(id));
        return { _id: String(id), title: item?.title || null, status: item?.status || null, due_date: item?.due_date || null, can_view: Boolean(item) };
    });
    const remaining = dependencies.filter((item) => !isFinished(item.status)).length;
    const successors = graph?.successors || [];
    const startAt = task.start_date ? new Date(task.start_date).getTime() : null;
    const scheduleConflicts = Number.isFinite(startAt) ? dependencies.filter((item) => {
        const dueAt = item.due_date ? new Date(item.due_date).getTime() : null;
        return Number.isFinite(dueAt) && dueAt >= startAt;
    }) : [];
    const candidates = useMemo(() => tasks.filter((item) =>
        String(item._id) !== String(task._id) &&
        !blockedByIds.some((id) => String(id) === String(item._id)) &&
        item.title?.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
    ).slice(0, 8), [tasks, task._id, blockedByIds, search]);
    const formatDue = (value) => {
        if (!value) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        return new Intl.DateTimeFormat(i18n.language?.startsWith("ar") ? "ar" : "en", {
            day: "numeric", month: "short", year: "numeric",
        }).format(date);
    };

    return <section className="p-4 sm:p-5 bg-surface rounded-[24px] border border-status-border shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 className="text-lg font-bold text-table-title">{t("Dependencies")}</h2>
                <p className="mt-1 text-sm text-cell-secondary">{t("Finish these tasks before completing this task")}</p>
            </div>
            {dependencies.length > 0 && <span className={`rounded-full px-3 py-1 text-xs font-semibold ${remaining ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}`}>
                {remaining ? t("Remaining dependencies", { count: remaining }) : t("All dependencies completed")}
            </span>}
        </div>

        {isFinished(task.status) && remaining > 0 && <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">{t("Completed task has unfinished dependencies")}</p>}
        {scheduleConflicts.length > 0 && <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <span>{t("Task starts before a dependency is due")}</span>
            {canEdit && <Link href={`/tasks/${task._id}/edit`} className="font-semibold underline">{t("Review task dates")}</Link>}
        </div>}

        {dependencies.length === 0 ? <div className="rounded-xl border border-dashed border-status-border bg-status-bg px-4 py-5 text-sm text-cell-secondary">{t("No dependencies")}</div> :
            <div className="space-y-2">{dependencies.map((item) => {
                const finished = isFinished(item?.status);
                const due = formatDue(item?.due_date);
                return <div key={String(item._id)} className="flex flex-wrap items-center gap-3 rounded-xl border border-status-border bg-status-bg/50 px-3 py-3">
                    <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg ${finished ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`}>{finished ? "✓" : "○"}</span>
                    <div className="min-w-0 flex-1">
                        {item.can_view ? <Link href={`/tasks/${item._id}/details`} className="block w-fit max-w-full truncate text-sm font-semibold text-cell-primary hover:text-primary-500 hover:underline">{item.title}</Link> : <span className="text-sm font-semibold text-cell-primary">{t("Task details unavailable")}</span>}
                        <p className="mt-0.5 text-xs text-cell-secondary">{finished ? t("Completed") : t("Blocking")}{due ? ` · ${t("Due Date")}: ${due}` : ""}</p>
                    </div>
                    {canEdit && <button type="button" disabled={isUpdating} aria-label={`${t("Remove dependency")}: ${item?.title || t("Task details unavailable")}`} onClick={() => onReplace(blockedByIds.filter((value) => String(value) !== String(item._id)))} className="rounded-lg border border-status-border px-3 py-1.5 text-xs font-medium text-cell-secondary hover:border-red-300 hover:text-red-600 disabled:opacity-50">{t("Remove")}</button>}
                </div>;
            })}</div>}

        {canEdit && <div className="border-t border-status-border pt-4">
            <button type="button" aria-expanded={isAdding} onClick={() => setIsAdding((value) => !value)} className="rounded-lg border border-primary-500 px-3 py-2 text-sm font-semibold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950">{isAdding ? t("Cancel") : `+ ${t("Add dependency")}`}</button>
            {isAdding && <div className="mt-3 space-y-2">
                <label className="block text-xs font-medium text-cell-secondary" htmlFor="dependency-search">{t("Search for a task")}</label>
                <input id="dependency-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("Search for a task")} className="w-full rounded-lg border border-status-border bg-surface px-3 py-2 text-sm text-cell-primary outline-none focus:border-primary-500" />
                <div className="max-h-56 overflow-y-auto rounded-lg border border-status-border divide-y divide-status-border">
                    {candidates.length ? candidates.map((item) => <div key={item._id} className="flex items-center justify-between gap-3 px-3 py-2">
                        <div className="min-w-0"><p className="truncate text-sm font-medium text-cell-primary">{item.title}</p><p className="text-xs text-cell-secondary">{isFinished(item.status) ? t("Completed") : t("Blocking")}</p></div>
                        <button type="button" disabled={isUpdating} onClick={async () => { if (await onReplace([...blockedByIds, item._id])) { setSearch(""); setIsAdding(false); } }} className="shrink-0 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">{t("Add")}</button>
                    </div>) : <p className="px-3 py-4 text-sm text-cell-secondary">{t("No matching tasks")}</p>}
                </div>
            </div>}
        </div>}
        {graph && <div className="border-t border-status-border pt-4 space-y-3">
            <div><h3 className="text-sm font-semibold text-table-title">{t("Tasks waiting for this task")}</h3><p className="mt-1 text-xs text-cell-secondary">{t("These tasks can finish after this task is completed")}</p></div>
            {successors.length ? <div className="space-y-2">{successors.map((item) => <div key={item._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-status-border px-3 py-2">
                <Link href={`/tasks/${item._id}/details`} className="min-w-0 truncate text-sm font-medium text-cell-primary hover:text-primary-500 hover:underline">{item.title}</Link>
                <span className="text-xs text-cell-secondary">{isFinished(item.status) ? t("Completed") : t("Waiting")}</span>
            </div>)}</div> : <p className="text-sm text-cell-secondary">{t("No tasks depend on this task")}</p>}
        </div>}
    </section>;
}
