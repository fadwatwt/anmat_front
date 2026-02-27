"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

// Dynamic imports
const Table = dynamic(() => import("@/components/Tables/Table"), { ssr: false });
const ActivityLogs = dynamic(() => import("@/components/ActivityLogs"), { ssr: false });
const Alert = dynamic(() => import("@/components/Alerts/Alert"), { ssr: false });
import Page from "@/components/Page";
import AnalyticsCard from "../../analytics/_components/AnalyticsCard";
import DynamicDoughnut from "../../analytics/_components/charts/SummaryDoughnut.";
import DefaultSelect from "@/components/Form/DefaultSelect";
import DepartmentsPerformanceChat from "../../analytics/_components/employee/DepartmentsPerformanceChat";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import EmployeeRequests from "./employee/EmployeeRequests";
import { useGetSubscriberTaskStatisticsStatusQuery } from "@/redux/tasks/subscriberTasksApi";
import { useGetSubscriberProjectsQuery } from "@/redux/projects/subscriberProjectsApi";

const AdminDashboard = () => {
  const { t } = useTranslation("common");
  const [isConfirmApprovalAlert, setIsConfirmApprovalAlert] = useState(false);

  const { data: statsData } = useGetSubscriberTaskStatisticsStatusQuery();
  const { data: projects = [] } = useGetSubscriberProjectsQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();

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
      open: "Active",
      in_progress: "Active",
      active: "Active",
      completed: "Completed before due date",
      completed_before_due_date: "Completed before due date",
      late_completed: "Late Completed",
      cancelled: "Cancelled",
      overdue: "Overdue",
      on_hold: "On Hold",
      pending: "Pending",
    };
    return labelMap[key] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  };

  const chartData = statsData?.data ? {
    total: statsData.data.total,
    records: Object.entries(statsData.data.status_counts).map(([status, count], index) => ({
      title: getStatusLabel(status),
      name: getStatusLabel(status),
      value: count,
      color: getStatusColor(status, index),
    })),
  } : {
    total: 0,
    records: []
  };

  const departmentsData = departments.map(dept => ({
    name: dept.name,
    rate: parseFloat(((dept.rate || 0) * 5).toFixed(2))
  }));

  useEffect(() => {
    // const storedTheme = typeof window !== "undefined" && localStorage.getItem("theme");
    // if (storedTheme) setTheme(storedTheme);
  }, []);

  const handelConfirmApprovalAlert = useCallback(() => {
    setIsConfirmApprovalAlert((prev) => !prev);
  }, []);

  const activityLogs = [
    {
      type: "add",
      title: "New task added",
      description: "John Doe added a new task: Design website layout.",
      timeAgo: "2025-01-13T14:00:00.000Z",
    },
  ];

  const headers = [
    { label: "Project Name", width: "180px" },
    { label: "Department", width: "120px" },
    { label: "Status", width: "100px" },
    { label: "Progress", width: "120px" },
    { label: "Assigned Employee(s)", width: "180px" },
    { label: "Delivery Date", width: "120px" },
  ];

  const rows = projects.map((project, index) => {
    return [
      project.name,
      project.department_id?.name || t("No Department"),
      <div key={`status-${index}`}>
        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-700' :
          project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
            project.status === 'on_hold' ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-700'
          }`}>
          {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1).replace(/_/g, " ") : t("Pending")}
        </span>
      </div>,
      <div key={`progress-${index}`} className="flex items-center gap-2 w-full">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-400"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-500 whitespace-nowrap">{project.progress || 0}%</span>
      </div>,
      <div key={`assignees-${index}`} className="flex">
        {project.assignees?.map((assignee, idx) => (
          <img
            key={idx}
            src={assignee.image || "/api/placeholder/32/32"}
            loading="lazy"
            alt="assignee"
            className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0"
          />
        ))}
        {(!project.assignees || project.assignees.length === 0) && (
          <span className="text-gray-400 text-xs italic">{t("No Assignees")}</span>
        )}
      </div>,
      project.due_date ? new Date(project.due_date).toLocaleDateString() : t("No Date"),
    ];
  });

  return (
    <Page isTitle={false}>
      <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
        {/* Tasks Summary Card */}
        <div className="w-full md:w-1/2">
          <AnalyticsCard title="Tasks Summary">
            <DynamicDoughnut data={chartData.records} centerTitle="TASKS" centerValue={chartData.total} />
          </AnalyticsCard>
        </div>

        <div className="w-full md:w-1/2">
          <AnalyticsCard title="Departments" showDropdowns={true} dropdown1Label="Last 6 months">
            <div className="w-full h-[300px]">
              <DepartmentsPerformanceChat data={departmentsData} />
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {/* Task/Project Evaluation & Activity Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Task/Project Evaluation Section (2/3 of the width) */}
        <div className="lg:col-span-2">
          <Table
            title="Projects Overview"
            headers={headers}
            rows={rows}
            isCheckInput={false}
            isTitle={true}
            classContainer={"h-full"}
            hideSearchInput={true}
            showStatusFilter={true}
            toolbarCustomContent={
              <button className="bg-white text-gray-700 hover:bg-gray-50 px-4 py-2flex dark:text-gray-400 text-sm items-baseline p-2 gap-2 rounded-lg border border-gray-200 dark:border-gray-600">
                See All
              </button>
            }
          />
        </div>

        {/* Activity Logs Section (1/3 of the width) */}
        <ActivityLogs className={"max-h-[30rem]"} activityLogs={activityLogs} />
      </div>

      {/* Requests Section */}
      <div className="">
        <EmployeeRequests />
      </div>

      <Alert
        title={"Confirm Approval"}
        message={
          "Are you sure you want to approve this leave request for [Employee Name]?  This action cannot be undone."
        }
        isOpen={isConfirmApprovalAlert}
        onClose={handelConfirmApprovalAlert}
        type={"warning"}
        isBtns={"true"}
        onSubmit={() => { }}
        titleSubmitBtn={"Approve"}
        titleCancelBtn={"Cancel"}
      />
    </Page>
  );
};

export default AdminDashboard;
