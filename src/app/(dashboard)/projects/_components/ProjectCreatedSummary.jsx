"use client";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaPlus, FaRegClock } from "react-icons/fa";
import Status from "./TableInfo/Status";
import Priority from "./TableInfo/Priority";
import { translateDate } from "@/functions/Days";

export default function ProjectCreatedSummary({ project, tasks, onViewProject, onAddTask, showActions = true }) {
    const { t, i18n } = useTranslation();
    const ar = i18n.language?.startsWith("ar");
    const count = tasks.length;
    const countLabel = ar
        ? count === 0 ? "لم تُضف مهام بعد" : count === 1 ? "تمت إضافة مهمة واحدة" : count === 2 ? "تمت إضافة مهمتين" : count <= 10 ? `تمت إضافة ${count} مهام` : `تمت إضافة ${count} مهمة`
        : `${count} ${count === 1 ? "task added" : "tasks added"}`;
    return <section className="rounded-2xl border border-status-border bg-surface p-4 shadow-sm sm:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400" role="status">
            <FaCheckCircle className="shrink-0" aria-hidden="true" />
            <span>{t("Project Created Successfully")}</span>
        </div>
        <h2 className="mt-3 break-words text-xl font-bold leading-relaxed text-table-title sm:text-2xl"><bdi>{project.name}</bdi></h2>
        {project.description && <p className="mt-1 whitespace-pre-wrap break-words text-sm text-cell-secondary" dir="auto">{project.description}</p>}
        {(project.start_date || project.due_date) && <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {[["Start Date", project.start_date], ["Due Date", project.due_date]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <dt className="text-cell-secondary">{t(label)}:</dt><dd className="font-medium text-cell-primary">{translateDate(value)}</dd>
            </div>)}
        </dl>}
        <div className="mt-5 border-t border-status-border pt-4">
            <h3 className="text-sm font-semibold text-table-title">{countLabel}</h3>
            {count > 0 && <ul className="mt-3 grid gap-3 sm:grid-cols-2" aria-label={t("Tasks")}>
                {tasks.map((task, index) => <li key={task._id || task.id || index} className="min-w-0 rounded-xl border border-status-border bg-status-bg p-3">
                    <h4 className="break-words text-sm font-semibold text-cell-primary"><bdi>{task.title}</bdi></h4>
                    {task.description && <p className="mt-1 line-clamp-2 break-words text-xs text-cell-secondary" dir="auto">{task.description}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Status type={task.status || "open"} />
                        <Priority type={task.priority || "medium"} />
                    </div>
                    <dl className="mt-3 space-y-1 text-xs text-cell-secondary">
                        {task.assignee?.name && <div className="flex gap-1"><dt>{t("Assignee")}:</dt><dd><bdi>{task.assignee.name}</bdi></dd></div>}
                        {Number(task.estimated_hours) > 0 && <div className="flex items-center gap-1"><FaRegClock aria-hidden="true" /><dt>{ar ? "الوقت المقدر" : "Estimated time"}:</dt><dd>{Number(task.estimated_hours)} {ar ? "ساعة" : "h"}</dd></div>}
                        {task.due_date && <div className="flex gap-1"><dt>{t("Due Date")}:</dt><dd>{translateDate(task.due_date)}</dd></div>}
                    </dl>
                </li>)}
            </ul>}
        </div>
        {showActions && <div className="mt-5 border-t border-status-border pt-4">
            <p className="text-sm text-cell-secondary">{t("You can add tasks now or finish and add them later.")}</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={onViewProject} className="rounded-xl bg-primary-base px-5 py-3 text-sm font-semibold text-white dark:bg-primary-200 dark:text-black">{ar ? "عرض المشروع" : "View project"}</button>
                <button type="button" onClick={onAddTask} className="inline-flex items-center justify-center gap-2 rounded-xl border border-status-border px-5 py-3 text-sm font-semibold text-cell-primary hover:bg-status-bg"><FaPlus size={12} aria-hidden="true" />{count ? (ar ? "إضافة مهمة أخرى" : "Add another task") : t("Add Task")}</button>
            </div>
        </div>}
    </section>;
}
ProjectCreatedSummary.propTypes = {
    project: PropTypes.object.isRequired,
    tasks: PropTypes.array.isRequired,
    onViewProject: PropTypes.func.isRequired,
    onAddTask: PropTypes.func.isRequired,
    showActions: PropTypes.bool,
};
