"use client";

import Page from "@/components/Page";
import TasksSummaryChart from "@/app/(dashboard)/analytics/_components/employee/TasksSummaryChart";
import ActivityLogs from "@/components/ActivityLogs";
import TasksPerformanceChart from "@/app/(dashboard)/analytics/_components/employee/TasksPerformanceChart";
import Table from "@/components/Tables/Table";
import EmployeeRequests from "@/app/(dashboard)/dashboard/_components/employee/EmployeeRequests";
import { useGetEmployeeTaskStatisticsStatusQuery, useGetEmployeeTasksQuery } from "@/redux/tasks/employeeTasksApi";
import { useGetEmployeeDashboardLogsQuery } from "@/redux/activity-logs/activityLogsApi";
import { useGetEmployeeAnalyticsQuery } from "@/redux/analytics/analyticsApi";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getDateLocale } from "@/lib/dateLocale";
import { statusCell } from "@/components/StatusCell";
import PropTypes from "prop-types";
import {
    RiAlarmWarningLine,
    RiCheckboxCircleLine,
    RiLoader4Line,
    RiTaskLine,
} from "@remixicon/react";
import DashboardErrorBanner from "./DashboardErrorBanner";

const SummaryCard = ({ title, value, icon: Icon, color }) => (
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

SummaryCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
};

const EmployeeDashboard = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { data: statsData, isError: isStatsError, refetch: refetchStats } = useGetEmployeeTaskStatisticsStatusQuery();
    const { data: tasks = [], isLoading: isTasksLoading, isError: isTasksError, refetch: refetchTasks } = useGetEmployeeTasksQuery();
    const { data: logsData, isLoading: isLogsLoading, isError: isLogsError, refetch: refetchLogs } = useGetEmployeeDashboardLogsQuery({ limit: 10 });
    const { data: analyticsResponse, isError: isAnalyticsError, refetch: refetchAnalytics } = useGetEmployeeAnalyticsQuery({ section: "tasks" });
    const analyticsData = analyticsResponse?.data || analyticsResponse || {};
    const statusCounts = statsData?.data?.status_counts || {};
    const getCount = (...statuses) => statuses.reduce((sum, status) => sum + (Number(statusCounts[status]) || 0), 0);
    const totalTasks = Number(statsData?.data?.total) || tasks.length;
    const inProgressTasks = getCount("in_progress", "in-progress", "pending", "open");
    const completedTasks = getCount("completed", "done", "completed_before_due_date", "late_completed");
    const overdueTasks = getCount("overdue");
    const hasLoadError = isStatsError || isTasksError || isLogsError || isAnalyticsError;
    const retryDashboard = () => {
        if (isStatsError) refetchStats();
        if (isTasksError) refetchTasks();
        if (isLogsError) refetchLogs();
        if (isAnalyticsError) refetchAnalytics();
    };

    const statusColorMap = {
        open: "#375DFB", // Blue
        in_progress: "#F17B2C", // Orange
        completed: "#38C793", // Green
        cancelled: "#DF1C41", // Red
        overdue: "#9E1C1C", // Dark Red
        on_hold: "#6B7280", // Gray
        pending: "#FACC15", // Yellow
    };

    const extraColors = ["#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#F59E0B"];

    const getStatusColor = (status, index) => {
        const key = status.toLowerCase().replace(/\s+/g, '_');
        return statusColorMap[key] || extraColors[index % extraColors.length];
    };

    const chartData = statsData?.data ? {
        total: statsData.data.total,
        records: Object.entries(statsData.data.status_counts).map(([status, count], index) => ({
            title: t(status.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())),
            value: count,
            color: getStatusColor(status, index),
        })),
    } : {
        total: 0,
        records: []
    };

    const headers = [
        { label: t("Project/Task Name"), width: "200px" },
        { label: t("Department"), width: "120px" },
        { label: t("Assigned Employee(s)"), width: "180px" },
        { label: t("Status"), width: "110px" },
        { label: t("Delivery Date"), width: "120px" },
    ];

    const activityLogs = logsData?.data || [];

    const rows = tasks.slice(0, 25).map((task, index) => [
        <span key={`title-${index}`} className="text-cell-primary">{task.title}</span>,
        <span key={`dept-${index}`} className="text-cell-secondary">{task.department?.name || t("No Department")}</span>,
        <div key={`assignee-${index}`} className="flex">
            <img
                src={task.assignee?.imageProfile || "/images/userProfile.png"}
                loading="lazy"
                alt="assignee"
                onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/images/userProfile.png";
                }}
                className="w-6 h-6 rounded-full border-2 border-status-border"
            />
        </div>,
        <div key={`status-${index}`}>{statusCell(task.status, task._id)}</div>,
        <span key={`date-${index}`} className="text-cell-secondary">
            {task.due_date ? format(new Date(task.due_date), "dd MMM, yyyy", { locale: getDateLocale() }) : "-"}
        </span>
    ]);

    return (
        <Page
            title={t("Dashboard")}
            isBtn={false}
        >
            {/* Companies Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                {hasLoadError && <DashboardErrorBanner onRetry={retryDashboard} />}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                    <SummaryCard title={t("Total Tasks")} value={totalTasks} icon={RiTaskLine} color="bg-blue-500" />
                    <SummaryCard title={t("In Progress")} value={inProgressTasks} icon={RiLoader4Line} color="bg-orange-500" />
                    <SummaryCard title={t("Completed")} value={completedTasks} icon={RiCheckboxCircleLine} color="bg-green-500" />
                    <SummaryCard title={t("Overdue")} value={overdueTasks} icon={RiAlarmWarningLine} color="bg-red-500" />
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <TasksSummaryChart data={chartData} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TasksPerformanceChart monthlyData={analyticsData.tasksPerformanceMonthly || []} />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <Table
                        title={t("My Tasks")}
                        headers={headers}
                        rows={rows}
                        isCheckInput={false}
                        isTitle={true}
                        classContainer={"w-full md:w-2/3"}
                        isLoading={isTasksLoading}
                        toolbarCustomContent={
                            <button
                                onClick={() => router.push("/employee/tasks")}
                                className="bg-surface text-cell-secondary hover:bg-status-bg px-4 py-2 text-sm font-medium flex items-center gap-2 rounded-xl border border-status-border transition-colors"
                            >
                                {t("See All")}
                            </button>
                        }
                    />
                    <div className="w-full md:w-1/3">
                        <ActivityLogs
                            activityLogs={activityLogs}
                            className={"max-h-[30rem]"}
                            isLoading={isLogsLoading}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <EmployeeRequests />
                </div>
            </div>

        </Page>
    );
}

export default EmployeeDashboard;
