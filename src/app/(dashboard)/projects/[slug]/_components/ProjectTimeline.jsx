import { useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const DAY = 24 * 60 * 60 * 1000;
const ROW_HEIGHT = 64;
const isFinished = (status) => status === "completed" || status === "done";

function dayValue(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function ProjectTimeline({ tasks = [], canEditDates = false }) {
    const { t, i18n } = useTranslation();
    const locale = i18n.language?.startsWith("ar") ? "ar" : "en";
    const formatDate = (value) => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(value);

    const { scheduled, unscheduled, minDay, totalDays, ticks, taskById, links, externalCount } = useMemo(() => {
        const taskById = new Map(tasks.map((task) => [String(task._id), task]));
        const dated = [];
        const undated = [];
        for (const task of tasks) {
            const start = dayValue(task.start_date);
            const due = dayValue(task.due_date);
            if (start === null && due === null) undated.push(task);
            else dated.push({ task, start, due, first: Math.min(start ?? due, due ?? start), last: Math.max(start ?? due, due ?? start) });
        }
        dated.sort((a, b) => a.first - b.first || String(a.task.title).localeCompare(String(b.task.title)));
        const minDay = dated.length ? Math.min(...dated.map((item) => item.first)) : 0;
        const maxDay = dated.length ? Math.max(...dated.map((item) => item.last)) : minDay;
        const totalDays = Math.max(1, (maxDay - minDay) / DAY + 1);
        const tickCount = Math.min(5, totalDays);
        const ticks = Array.from({ length: tickCount }, (_, index) => ({
            position: tickCount === 1 ? 0 : (index / (tickCount - 1)) * 100,
            day: minDay + Math.round(((totalDays - 1) * index) / Math.max(1, tickCount - 1)) * DAY,
        }));
        const scheduledById = new Map(dated.map((item, index) => [String(item.task._id), { ...item, index }]));
        const links = [];
        let externalCount = 0;
        for (const item of dated) {
            for (const id of item.task.blocked_by_ids || []) {
                const predecessor = scheduledById.get(String(id));
                if (!taskById.has(String(id))) externalCount += 1;
                if (!predecessor || predecessor.due === null || item.start === null) continue;
                links.push({
                    key: `${id}-${item.task._id}`,
                    predecessorTitle: predecessor.task.title,
                    taskTitle: item.task.title,
                    taskId: item.task._id,
                    fromX: Math.min(998, ((predecessor.due - minDay) / DAY + 1) / totalDays * 1000),
                    fromY: predecessor.index * ROW_HEIGHT + ROW_HEIGHT / 2,
                    toX: (item.start - minDay) / DAY / totalDays * 1000,
                    toY: scheduledById.get(String(item.task._id)).index * ROW_HEIGHT + ROW_HEIGHT / 2,
                    conflict: predecessor.due >= item.start,
                });
            }
        }
        return { scheduled: dated, unscheduled: undated, minDay, totalDays, ticks, taskById, links, externalCount };
    }, [tasks]);

    if (tasks.length === 0) return <p className="py-4 text-sm text-cell-secondary">{t("No tasks yet")}</p>;

    const dependencyText = (task) => (task.blocked_by_ids || []).map((id) => taskById.get(String(id))?.title || t("Other task")).join("، ");
    const isBlocked = (task) => (task.blocked_by_ids || []).some((id) => !isFinished(taskById.get(String(id))?.status));
    const conflicts = links.filter((link) => link.conflict);

    return <div className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-primary-50 px-3 py-1 text-primary-700 dark:bg-primary-950 dark:text-primary-300">{t("Visible dependency links")}: {links.length}</span>
            {conflicts.length > 0 && <span role="alert" className="rounded-full bg-amber-50 px-3 py-1 text-amber-800 dark:bg-amber-950 dark:text-amber-200">{t("Schedule conflicts")}: {conflicts.length}</span>}
        </div>
        {conflicts.length > 0 && <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
            <p className="font-semibold">{t("Review these task dates")}</p>
            <ul className="mt-1 list-disc space-y-1 ps-5">{conflicts.map((link) => <li key={link.key}>
                <Link href={`/tasks/${link.taskId}/${canEditDates ? "edit" : "details"}`} className="font-medium underline">{link.taskTitle}</Link>
                {` ${t("starts before predecessor due", { task: link.predecessorTitle })}`}
            </li>)}</ul>
        </div>}
        {scheduled.length > 0 && <div className="overflow-x-auto pb-2">
            <div className="min-w-[760px]" dir="ltr">
                <div className="flex items-end gap-4 text-xs text-cell-secondary">
                    <div className="w-48 shrink-0" />
                    <div className="relative h-8 flex-1 border-b border-status-border">
                        {ticks.map(({ position, day }) => <span key={`${position}-${day}`} className="absolute bottom-1 -translate-x-1/2 whitespace-nowrap first:translate-x-0 last:-translate-x-full" style={{ left: `${position}%` }}>{formatDate(day)}</span>)}
                    </div>
                </div>
                <div className="relative" style={{ height: scheduled.length * ROW_HEIGHT }}>
                    {scheduled.map(({ task, start, due, first, last }, index) => {
                        const dependency = dependencyText(task);
                        const left = ((first - minDay) / DAY / totalDays) * 100;
                        const width = Math.max(1, (((last - first) / DAY + 1) / totalDays) * 100);
                        return <div key={task._id} className="absolute inset-x-0 flex h-16 items-center gap-4 border-b border-status-border/60" style={{ top: index * ROW_HEIGHT }}>
                            <div className="w-48 min-w-0 shrink-0" dir="auto">
                                <Link href={`/tasks/${task._id}/details`} className="block truncate text-sm font-medium text-cell-primary hover:text-primary-500 hover:underline" title={task.title}>{task.title}</Link>
                                <p className="truncate text-xs text-cell-secondary" title={dependency || t(task.status)}>{dependency ? `${t("Blocked by")}: ${dependency}` : t(task.status)}</p>
                            </div>
                            <div className="relative h-9 flex-1 rounded-md bg-status-bg/60" title={`${start !== null ? formatDate(start) : t("No start date")} – ${due !== null ? formatDate(due) : t("No due date")}`}>
                                <div className={`absolute top-2 z-20 h-5 rounded-md ${isFinished(task.status) ? "bg-emerald-500" : isBlocked(task) ? "bg-amber-500" : "bg-primary-500"}`} style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }} />
                            </div>
                        </div>;
                    })}
                    {links.length > 0 && <svg aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 h-full w-[calc(100%-13rem)] overflow-visible" viewBox={`0 0 1000 ${scheduled.length * ROW_HEIGHT}`} preserveAspectRatio="none">
                        {links.map((link) => <path key={link.key} d={`M ${link.fromX} ${link.fromY} C ${link.fromX + 28} ${link.fromY}, ${link.toX - 28} ${link.toY}, ${link.toX} ${link.toY}`} fill="none" stroke={link.conflict ? "#d97706" : "#6366f1"} strokeWidth="2" strokeDasharray={link.conflict ? "6 4" : undefined} opacity="0.85" />)}
                    </svg>}
                </div>
            </div>
        </div>}
        {externalCount > 0 && <p className="text-xs text-cell-secondary">{t("Some dependencies are outside this project")}</p>}
        {unscheduled.length > 0 && <div className="rounded-xl border border-status-border p-3">
            <h3 className="mb-2 text-sm font-semibold text-table-title">{t("Tasks without dates")} ({unscheduled.length})</h3>
            <div className="flex flex-wrap gap-2">{unscheduled.map((task) => <Link key={task._id} href={`/tasks/${task._id}/details`} className="rounded-lg bg-status-bg px-3 py-1 text-sm text-cell-primary hover:underline" title={dependencyText(task) ? `${t("Blocked by")}: ${dependencyText(task)}` : t(task.status)}>{task.title}</Link>)}</div>
        </div>}
    </div>;
}

export default ProjectTimeline;
