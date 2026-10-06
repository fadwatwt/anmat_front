"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

function AssigneeAvatar({ assignee, idx }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initial = assignee.name?.charAt(0)?.toUpperCase() || "?";
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"];
  return (
    <div
      className={`w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-[10px] font-medium text-white ${colors[idx % 5]} flex-shrink-0`}
      title={assignee.name || ""}
    >
      {assignee.image && !imageFailed ? (
        <img
          src={assignee.image}
          loading="lazy"
          alt={assignee.name || "assignee"}
          onError={() => setImageFailed(true)}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        initial
      )}
    </div>
  );
}

AssigneeAvatar.propTypes = {
  assignee: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  idx: PropTypes.number.isRequired,
};

// Dynamic imports
const Table = dynamic(() => import("@/components/Tables/Table"), { ssr: false });
const ActivityLogs = dynamic(() => import("@/components/ActivityLogs"), { ssr: false });
import Page from "@/components/Page";
import AnalyticsCard from "../../analytics/_components/AnalyticsCard";
import DynamicDoughnut from "../../analytics/_components/charts/SummaryDoughnut.";
import ProcessingOverlay from "@/components/Feedback/ProcessingOverlay";
import DepartmentsPerformanceChat from "../../analytics/_components/employee/DepartmentsPerformanceChat";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import EmployeeRequests from "./employee/EmployeeRequests";
import { useGetSubscriberTaskStatisticsStatusQuery } from "@/redux/tasks/subscriberTasksApi";
import { useGetSubscriberProjectsQuery } from "@/redux/projects/subscriberProjectsApi";
import { useGetOrganizationLogsQuery } from "@/redux/activity-logs/activityLogsApi";
import { useGetSubscriberAnalyticsQuery } from "@/redux/analytics/analyticsApi";
import { format } from "date-fns";
import { getDateLocale } from "@/lib/dateLocale";
import {
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiFolderChartLine,
  RiPlayCircleLine,
} from "@remixicon/react";
import DashboardErrorBanner from "./DashboardErrorBanner";

function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-surface p-5 rounded-[24px] border border-status-border shadow-sm flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-cell-secondary">{title}</span>
        <span className="text-2xl font-bold text-table-title">{value}</span>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon size={24} className={color.replace("bg-", "text-")} />
      </div>
    </div>
  );
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

const CompanyManagerDashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: statsData, isLoading: isStatsLoading, isError: isStatsError, refetch: refetchStats } = useGetSubscriberTaskStatisticsStatusQuery();
  const { data: projects = [], isLoading: isProjectsLoading, isError: isProjectsError, refetch: refetchProjects } = useGetSubscriberProjectsQuery();
  const { data: departments = [], isLoading: isDepartmentsLoading, isError: isDepartmentsError, refetch: refetchDepartments } = useGetDepartmentsQuery();
  const { data: analyticsData, isLoading: isAnalyticsLoading, isError: isAnalyticsError, refetch: refetchAnalytics } = useGetSubscriberAnalyticsQuery({});

  const isPageLoading = isStatsLoading || isProjectsLoading || isDepartmentsLoading;
  const hasLoadError = isStatsError || isProjectsError || isDepartmentsError || isAnalyticsError;

  const statusColorMap = {
    active: "#375DFB", // Blue
    open: "#375DFB", // Blue
    in_progress: "#375DFB", // Blue
    completed: "#38C793", // Green
    completed_before_due_date: "#38C793", // Green
    late_completed: "#F17B2C", // Orange
    cancelled: "#DF1C41", // Red
    overdue: "#DF1C41", // Red
    on_hold: "#6B7280", // Gray
    pending: "#FACC15", // Yellow
  };

  const extraColors = ["#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#F59E0B"];

  const getStatusColor = (status, index) => {
    const key = status.toLowerCase().replace(/\s+/g, '_');
    return statusColorMap[key] || extraColors[index % extraColors.length];
  };

  const getStatusLabel = (status) => {
    const key = status.toLowerCase().replace(/\s+/g, '_');
    const labelMap = {
      open: t("Active"),
      in_progress: t("In Progress"),
      active: t("Active"),
      completed: t("Completed"),
      completed_before_due_date: t("Completed before due date"),
      late_completed: t("Late Completed"),
      cancelled: t("Cancelled"),
      overdue: t("Overdue"),
      on_hold: t("On Hold"),
      pending: t("Pending"),
      done: t("Done"),
      rejected: t("Rejected"),
    };
    return labelMap[key] || t(status.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
  };

  // المهام: مصدر أساسي stats/status، مع fallback إلى analytics tasksSummary لضمان الظهور حتى لو تأخر أحدهما
  const analyticsTasksSummary = analyticsData?.data?.tasksSummary || [];
  const chartData = (() => {
    if (statsData?.data?.status_counts) {
      return {
        total: statsData.data.total,
        records: Object.entries(statsData.data.status_counts).map(([status, count], index) => ({
          title: getStatusLabel(status),
          name: getStatusLabel(status),
          value: count,
          color: getStatusColor(status, index),
        })),
      };
    }
    if (analyticsTasksSummary.length) {
      return {
        total: analyticsTasksSummary.reduce((s, x) => s + (x.value || 0), 0),
        records: analyticsTasksSummary.map((item, index) => ({
          title: getStatusLabel(item.name),
          name: getStatusLabel(item.name),
          value: item.value,
          color: getStatusColor(item.name, index),
        })),
      };
    }
    return { total: 0, records: [] };
  })();

  const departmentsData = departments.map(dept => ({
    name: dept.name,
    rate: parseFloat(((dept.overall_rating ?? dept.rate ?? 0)).toFixed(2))
  }));
  const taskStatusCounts = statsData?.data?.status_counts || {};
  const completedTasks = ["completed", "done", "completed_before_due_date", "late_completed"]
    .reduce((total, status) => total + (Number(taskStatusCounts[status]) || 0), 0);
  const overdueTasks = Number(taskStatusCounts.overdue) || 0;
  const activeProjects = projects.filter(project => ["active", "in_progress", "in-progress", "open"].includes(project.status)).length;

  const retryDashboard = () => {
    if (isStatsError) refetchStats();
    if (isProjectsError) refetchProjects();
    if (isDepartmentsError) refetchDepartments();
    if (isAnalyticsError) refetchAnalytics();
  };

  const { data: orgLogsData, isLoading: isLogsLoading } = useGetOrganizationLogsQuery({ limit: 10 });
  const rawLogs = orgLogsData?.data || [];

  const headers = [
    { label: t("Project Name"), width: "180px" },
    { label: t("Department"), width: "120px" },
    { label: t("Status"), width: "100px" },
    { label: t("Progress"), width: "120px" },
    { label: t("Assigned Employee(s)"), width: "180px" },
    { label: t("Delivery Date"), width: "120px" },
  ];

  const rows = projects.slice(0, 25).map((project, index) => {
    return [
      project.name,
      project.department_id?.name || t("No Department"),
      <div key={`status-${index}`}>
        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-700' :
          project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
            project.status === 'on_hold' ? 'bg-orange-100 text-orange-700' :
              'bg-status-bg text-cell-secondary border border-status-border'
          }`}>
          {project.status ? t(project.status.split(/[-_\s]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")) : t("Pending")}
        </span>
      </div>,
      <div key={`progress-${index}`} className="flex items-center gap-2 w-full">
        <div className="flex-1 h-1.5 bg-status-bg border border-status-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-400"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
        <span className="text-[10px] text-cell-secondary whitespace-nowrap">{project.progress || 0}%</span>
      </div>,
      <div key={`assignees-${index}`} className="flex">
        {project.assignees?.map((assignee, idx) => (
          <AssigneeAvatar key={idx} assignee={assignee} idx={idx} />
        ))}
        {(!project.assignees || project.assignees.length === 0) && (
          <span className="text-cell-secondary text-xs italic">{t("No Assignees")}</span>
        )}
      </div>,
      project.due_date ? format(new Date(project.due_date), "dd MMM, yyyy", { locale: getDateLocale() }) : t("No Date"),
    ];
  });

  return (
    <Page isTitle={false}>
      <ProcessingOverlay isOpen={isPageLoading} message={t("Loading Dashboard...")} />
      {hasLoadError && <DashboardErrorBanner onRetry={retryDashboard} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        <SummaryCard title={t("Total Projects")} value={projects.length} icon={RiFolderChartLine} color="bg-blue-500" />
        <SummaryCard title={t("Active Projects")} value={activeProjects} icon={RiPlayCircleLine} color="bg-purple-500" />
        <SummaryCard title={t("Completed Tasks")} value={completedTasks} icon={RiCheckboxCircleLine} color="bg-green-500" />
        <SummaryCard title={t("Overdue Tasks")} value={overdueTasks} icon={RiAlarmWarningLine} color="bg-red-500" />
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
        {/* Tasks Summary Card */}
        <div data-tour="tasks-summary" className="w-full md:w-1/2">
          <AnalyticsCard title={t("Tasks Summary")}>
            {chartData.records.length === 0 ? (
              <div className="h-[220px] flex flex-col items-center justify-center text-cell-secondary gap-2">
                <span className="text-sm">{isStatsLoading || isAnalyticsLoading ? t("Loading...") : t("No tasks yet")}</span>
                <span className="text-xs opacity-60">{t("Create your first task to see statistics")}</span>
              </div>
            ) : (
              <DynamicDoughnut data={chartData.records} centerTitle={t("TASKS")} centerValue={chartData.total} />
            )}
          </AnalyticsCard>
        </div>

        <div data-tour="departments" className="w-full md:w-1/2">
          <AnalyticsCard title={t("Departments")} showDropdowns={true} dropdown1Label={t("Last 6 Months")}>
            <div className="w-full h-[300px]">
              {departmentsData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-cell-secondary text-sm">{t("No departments found")}</div>
              ) : departmentsData.every(d => d.rate === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-cell-secondary gap-2 py-8">
                  <DepartmentsPerformanceChat data={departmentsData} />
                  <span className="text-xs opacity-60 -mt-4">{t("Departments have not been rated yet")}</span>
                </div>
              ) : (
                <DepartmentsPerformanceChat data={departmentsData} />
              )}
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {/* Task/Project Evaluation & Activity Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Task/Project Evaluation Section (2/3 of the width) */}
        <div data-tour="projects-table" className="lg:col-span-2">
          <Table
            title={t("Projects Overview")}
            headers={headers}
            rows={rows}
            isCheckInput={false}
            isTitle={true}
            classContainer={"h-full"}
            hideSearchInput={true}
            showStatusFilter={true}
            isLoading={isProjectsLoading}
            onRowClick={(index) => {
              const projectId = projects[index]?._id;
              if (projectId) router.push(`/projects/${projectId}/details`);
            }}
            toolbarCustomContent={
              <button onClick={() => router.push("/projects")} className="bg-status-bg text-cell-secondary hover:bg-gray-50 px-4 py-2 dark:text-gray-400 text-sm flex items-center gap-2 rounded-lg border border-status-border dark:border-gray-600">
                {t("See All")}
              </button>
            }
          />
        </div>

        {/* Activity Logs Section (1/3 of the width) */}
        <div data-tour="activity-logs">
          <ActivityLogs
            className={"max-h-[30rem]"}
            activityLogs={rawLogs}
            isRawLogs={true}
            isLoading={isLogsLoading}
          />
        </div>
      </div>

      {/* Requests Section */}
      <div data-tour="requests" className="">
        <EmployeeRequests />
      </div>
    </Page>
  );
};

export default CompanyManagerDashboard;
