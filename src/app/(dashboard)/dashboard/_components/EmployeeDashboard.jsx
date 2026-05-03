"use client";

import Page from "@/components/Page";
import TasksSummaryChart from "@/app/(dashboard)/analytics/_components/employee/TasksSummaryChart";
import ActivityLogs from "@/components/ActivityLogs";
import TasksPerformanceChart from "@/app/(dashboard)/analytics/_components/employee/TasksPerformanceChart";
import Table from "@/components/Tables/Table";
import EmployeeRequests from "@/app/(dashboard)/dashboard/_components/employee/EmployeeRequests";
import { useGetEmployeeTaskStatisticsStatusQuery, useGetEmployeeTasksQuery } from "@/redux/tasks/employeeTasksApi";
import { useGetEmployeeDashboardLogsQuery } from "@/redux/activity-logs/activityLogsApi";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

const EmployeeDashboard = () => {
    const { t } = useTranslation();
    const { data: statsData } = useGetEmployeeTaskStatisticsStatusQuery();
    const { data: tasks = [], isLoading: isTasksLoading } = useGetEmployeeTasksQuery();
    const { data: logsData, isLoading: isLogsLoading } = useGetEmployeeDashboardLogsQuery({ limit: 10 });

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
            title: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
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
        { label: t("Delivery Date"), width: "120px" },
    ];

    const activityLogs = logsData?.data || [];

    const rows = tasks.map((task, index) => [
        <span key={`title-${index}`} className="text-cell-primary">{task.title}</span>,
        <span key={`dept-${index}`} className="text-cell-secondary">{task.department?.name || t("No Department")}</span>,
        <div key={`assignee-${index}`} className="flex">
            <img
                src={task.assignee?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee?.name || "U")}`}
                loading="lazy"
                alt="assignee"
                className="w-6 h-6 rounded-full border-2 border-status-border"
            />
        </div>,
        <span key={`date-${index}`} className="text-cell-secondary">
            {task.due_date ? format(new Date(task.due_date), "dd MMM, yyyy") : "-"}
        </span>
    ]);

    return (
        <Page
            title="Dashboard"
            isBtn={false}
        >
            {/* Companies Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <TasksSummaryChart data={chartData} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TasksPerformanceChart />
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
                            <button className="bg-status-bg text-cell-secondary hover:bg-gray-50 px-4 py-2flex dark:text-gray-400 text-sm items-baseline p-2 gap-2 rounded-lg border border-status-border dark:border-gray-600">
                                See All
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
