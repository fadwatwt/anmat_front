import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useGetProjectScheduleOverviewQuery } from "@/redux/projects/subscriberProjectsApi";

export default function ProjectScheduleOverview() {
    const { t } = useTranslation();
    const { data: projects = [], isLoading, isError } = useGetProjectScheduleOverviewQuery();
    if (isLoading || isError || !projects.length) return null;
    const atRisk = projects.filter((project) => project.schedule?.project_overdue || project.schedule?.overdue_task_count);
    const missing = projects.reduce((total, project) => total + (project.schedule?.missing_estimate_count || 0), 0);
    return <section className="mb-5 rounded-2xl border border-status-border bg-surface p-4 shadow-sm" aria-label={t("Project schedule overview")}>
        <h2 className="text-lg font-bold text-table-title">{t("Project schedule overview")}</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-lg bg-status-bg px-3 py-2 text-cell-primary">{t("Projects shown")}: {projects.length}{projects.length === 200 ? ` (${t("First 200 projects")})` : ""}</span>
            <span className="rounded-lg bg-red-50 px-3 py-2 text-red-800">{t("Projects needing attention")}: {atRisk.length}</span>
            <span className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">{t("Tasks without estimates")}: {missing}</span>
        </div>
        {atRisk.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{atRisk.slice(0, 10).map((project) => <Link key={project._id} href={`/projects/${project._id}/details`} className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700 hover:underline">{project.name} · {project.schedule.overdue_task_count} {t("Overdue tasks")}</Link>)}</div>}
    </section>;
}
