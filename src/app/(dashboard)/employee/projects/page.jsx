"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { GoCheckCircleFill, GoClockFill, GoAlertFill } from "react-icons/go";
import { User, Calendar } from "iconsax-react";
import { useGetMyProjectsQuery } from "@/redux/projects/employeeProjectsApi";
import Link from "next/link";

// Dynamic imports
const Table = dynamic(() => import("@/components/Tables/Table"), { ssr: false });
const Page = dynamic(() => import("@/components/Page"), { ssr: false });
const ProcessingOverlay = dynamic(() => import("@/components/Feedback/ProcessingOverlay"), { ssr: false });

/* ─── Status Badge ─────────────────────────────────────────────── */
const ProjectStatusBadge = ({ status }) => {
  const { t } = useTranslation();
  let Icon;
  let colors = "";

  switch (status?.toLowerCase()) {
    case "completed":
      Icon = <GoCheckCircleFill size={14} className="text-green-600" />;
      colors = "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      break;
    case "in-progress":
      Icon = <GoClockFill size={14} className="text-blue-600" />;
      colors = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      break;
    case "pending":
      Icon = <GoClockFill size={14} className="text-yellow-600" />;
      colors = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      break;
    case "on-hold":
      Icon = <GoAlertFill size={14} className="text-gray-600" />;
      colors = "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
      break;
    default:
      Icon = <GoClockFill size={14} className="text-gray-600" />;
      colors = "bg-status-bg text-cell-secondary border-status-border";
  }

  return (
    <div className={`flex items-center gap-1.5 border rounded-full px-2.5 py-1 w-fit ${colors}`}>
      {Icon}
      <span className="text-[11px] font-medium">{t(status || "Unknown")}</span>
    </div>
  );
};

ProjectStatusBadge.propTypes = {
  status: PropTypes.string,
};

/* ─── Progress Visualization ────────────────────────────────────────── */
const ProgressIndicator = ({ progress }) => {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-8 h-8 transform -rotate-90">
          <circle
            className="text-gray-100 dark:text-gray-800"
            strokeWidth="3"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="16"
            cy="16"
          />
          <circle
            className="text-primary-base transition-all duration-500 ease-out"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="16"
            cy="16"
          />
        </svg>
        <span className="absolute text-[9px] font-bold text-cell-primary">
          {progress}%
        </span>
      </div>
    </div>
  );
};

ProgressIndicator.propTypes = {
  progress: PropTypes.number.isRequired,
};

/* ─── Main Page Component ────────────────────────────────────────── */
const EmployeeProjectsPage = () => {
  const { t } = useTranslation();
  const { data: projects, isLoading } = useGetMyProjectsQuery();

  const headers = [
    { label: t("Project Name"), width: "250px" },
    { label: t("Manager"), width: "180px" },
    { label: t("Status"), width: "130px" },
    { label: t("Progress"), width: "100px" },
    { label: t("Start Date"), width: "130px" },
    { label: t("Due Date"), width: "130px" },
    { label: t("Assignees"), width: "150px" },
  ];

  const rows = useMemo(() => {
    if (!projects) return [];
    return projects.map((project) => [
      <Link href={`/employee/projects/${project._id}/details`} key={`name-${project._id}`} className="flex flex-col">
        <span className="text-sm font-bold text-cell-primary leading-tight">
          {project.name}
        </span>
        <span className="text-xs text-cell-secondary mt-0.5 line-clamp-1 max-w-[200px]">
          {project.description}
        </span>
      </Link>,
      <div key={`manager-${project._id}`} className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-status-bg flex items-center justify-center shadow-sm">
          <User size={14} className="text-cell-secondary" variant="Bold" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-cell-primary">
            {project.manager?.name || t("No Manager")}
          </span>
          <span className="text-[10px] text-cell-secondary">
            {project.department?.name}
          </span>
        </div>
      </div>,
      <ProjectStatusBadge key={`status-${project._id}`} status={project.status} />,
      <ProgressIndicator key={`progress-${project._id}`} progress={project.progress || 0} />,
      <div key={`start-${project._id}`} className="flex items-center gap-1.5 text-sm text-cell-secondary">
        <Calendar size={14} className="opacity-60" />
        {project.start_date ? format(new Date(project.start_date), "dd MMM, yyyy") : "—"}
      </div>,
      <div key={`due-${project._id}`} className="flex items-center gap-1.5 text-sm text-primary-base font-semibold">
        <Calendar size={14} className="opacity-80" />
        {project.due_date ? format(new Date(project.due_date), "dd MMM, yyyy") : "—"}
      </div>,
      <div key={`assignees-${project._id}`} className="flex -space-x-2">
        {project.assignees?.slice(0, 3).map((assignee, idx) => (
          <div
            key={idx}
            className="w-7 h-7 rounded-full border-2 border-surface bg-status-bg flex items-center justify-center text-[9px] font-bold text-cell-secondary overflow-hidden shadow-sm uppercase"
            title={assignee.name}
          >
            {assignee.name?.substring(0, 2) || "U"}
          </div>
        ))}
        {project.assignees?.length > 3 && (
          <div className="w-7 h-7 rounded-full border-2 border-surface bg-main flex items-center justify-center text-[9px] font-bold text-cell-secondary shadow-sm">
            +{project.assignees.length - 3}
          </div>
        )}
      </div>,
    ]);
  }, [projects, t]);

  return (
    <Page title={t("My Projects")}>
      {isLoading && <ProcessingOverlay message={t("Loading your projects...")} />}

      <div className="flex flex-col gap-6">
        <Table
          title={t("Projects List")}
          headers={headers}
          rows={rows}
          isCheckInput={false}
          isTitle={true}
          showControlBar={false}
          classContainer="w-full"
        />
      </div>
    </Page>
  );
};

export default EmployeeProjectsPage;
