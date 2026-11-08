import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ProjectScheduleSummary({ project }) {
    const { t } = useTranslation();
    const schedule = project?.schedule;
    if (!schedule) return null;
    const tasks = new Map((project.tasks || []).map((task) => [String(task._id), task]));
    const critical = schedule.critical_path;
    return <section className="rounded-[24px] border border-status-border bg-surface p-4 shadow-sm sm:p-5" aria-label={t("Project schedule indicators")}>
        <h2 className="mb-3 text-lg font-bold text-table-title">{t("Project schedule indicators")}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
            <div className={`rounded-xl p-3 ${schedule.project_overdue ? "bg-red-50 text-red-800" : "bg-status-bg text-cell-primary"}`}>
                <p className="text-xs">{t("Project deadline")}</p>
                <p className="mt-1 font-semibold">{t(schedule.project_overdue ? "Overdue" : "On schedule")}</p>
            </div>
            <div className="rounded-xl bg-status-bg p-3 text-cell-primary"><p className="text-xs">{t("Overdue tasks")}</p><p className="mt-1 font-semibold">{schedule.overdue_task_count}</p></div>
            <div className="rounded-xl bg-status-bg p-3 text-cell-primary"><p className="text-xs">{t("Tasks without estimates")}</p><p className="mt-1 font-semibold">{schedule.missing_estimate_count}</p></div>
        </div>
        {schedule.overdue_task_ids?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{schedule.overdue_task_ids.map((id) => <Link key={id} href={`/tasks/${id}/details`} className="rounded-lg border border-red-200 px-2 py-1 text-sm text-red-700 hover:underline">{tasks.get(id)?.title || id}</Link>)}</div>}
        {critical ? <div className="mt-4">
            <p className="text-sm font-semibold text-table-title">{t("Critical path")} · {critical.estimated_hours} {t("hours")}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">{critical.task_ids.map((id, index) => <span key={id} className="flex items-center gap-2 text-sm">{index > 0 && <span aria-hidden="true">←</span>}<Link href={`/tasks/${id}/details`} className="rounded-lg bg-primary-50 px-2 py-1 text-primary-700 hover:underline">{tasks.get(id)?.title || id}</Link></span>)}</div>
        </div> : <p className="mt-4 text-sm text-cell-secondary">{t(schedule.dependency_cycle ? "Critical path unavailable due to dependency cycle" : "Add task estimates to show critical path")}</p>}
    </section>;
}
