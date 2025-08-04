"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";

// Dynamic imports
const Table = dynamic(() => import("@/components/Tables/Table"), { ssr: false });
const ActivityLogs = dynamic(() => import("@/components/ActivityLogs"), { ssr: false });
const ProjectRatingModal = dynamic(() => import("@/app/(dashboard)/projects/_modal/ProjectRatingModal"), { ssr: false });
const Alert = dynamic(() => import("@/components/Alert"), { ssr: false });
const Page = dynamic(() => import("@/components/Page"));
const DefaultSelect = dynamic(() => import("@/components/Form/DefaultSelect"));
import { StatusBadge } from "@/app/(dashboard)/hr/_Tabs/AttendanceTab";
import TasksSummaryChart from "../../analytics/_components/employee/TasksSummaryChart";
import TasksPerformanceChart from "../../analytics/_components/employee/TasksPerformanceChart";
import DepartmentsAnalytics from "../../analytics/_components/company_manager/DepartmentsAnalytics";
import EmployeeRequests from "./employee/EmployeeRequests";

const DonutChart = ({ data, total }) => {
  const createCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const paths = useMemo(() => {
    let cumulativePercent = 0;
    return data.map((segment) => {
      const percent = segment.value / total;
      const [startX, startY] = createCoordinatesForPercent(cumulativePercent);
      cumulativePercent += percent;
      const [endX, endY] = createCoordinatesForPercent(cumulativePercent);
      const largeArcFlag = percent > 0.5 ? 1 : 0;

      return (
        <path
          key={segment.color}
          d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`}
          stroke={segment.color}
          strokeWidth="0.2"
          fill="none"
        />
      );
    });
  }, [data, total]);

  return (
    <svg viewBox="-1.1 -1.1 2.2 2.2" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="0" cy="0" r="1" fill="none" stroke="#E5E7EB" strokeWidth="0.1" />
      {paths}
    </svg>
  );
};

DonutChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const AdminDashboard = () => {
  const [requestType] = useState("Leave Request");
  const { t } = useTranslation("common");
  // const [theme, setTheme] = useState("light");
  const [isRatingModal, setIsModalSetting] = useState(false);
  const [isConfirmApprovalAlert, setIsConfirmApprovalAlert] = useState(false);

  useEffect(() => {
    // const storedTheme = typeof window !== "undefined" && localStorage.getItem("theme");
    // if (storedTheme) setTheme(storedTheme);
  }, []);

  const handelRatingModal = useCallback(() => {
    setIsModalSetting((prev) => !prev);
  }, []);

  const handelConfirmApprovalAlert = useCallback(() => {
    setIsConfirmApprovalAlert((prev) => !prev);
  }, []);

  const viewModalList = [
    { id: "Leave", title: "Leave" },
    { id: "Financial", title: "Financial" },
  ];

  const [viewMode, setViewMode] = useState("week");
  const [currentDate] = useState(new Date());

  const activityLogs = [
    {
      type: "add",
      title: "New task added",
      description: "John Doe added a new task: Design website layout.",
      timeAgo: "2025-01-13T14:00:00.000Z",
    },
  ];

  const taskList = [
    {
      id: 1,
      name: "Project Omega",
      department: "Publishing",
      assignees: ["/api/placeholder/32/32", "/api/placeholder/32/32"],
      date: "15 Nov, 2024",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Task Echo",
      department: "Sales",
      assignees: ["/api/placeholder/32/32"],
      date: "15 Nov, 2024",
      rating: 0,
    },
  ];

  const leaveRequests = [
    {
      id: 1,
      employee: "John Doe",
      requestedDate: "2024-03-01",
      daysRequested: 3,
      daysLeft: 12,
      status: "Pending",
    },
  ];

  const financialRequests = [
    {
      id: 1,
      employee: "Jane Smith",
      requestedDate: "2024-03-05",
      daysRequested: 2,
      daysLeft: 7,
      status: "Pending",
    },
  ];

  const headers = [
    { label: "Project/Task Name", width: "200px" },
    { label: "Department", width: "120px" },
    { label: "Assigned Employee(s)", width: "180px" },
    { label: "Delivery Date", width: "120px" },
    { label: "Rating", width: "120px" },
  ];

  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  const rows = taskList.map((task, index) => [
    task.name,
    task.department,
    <div key={index} className="flex">
      {task.assignees.map((assignee, idx) => (
        <img
          key={idx}
          src={assignee}
          loading="lazy"
          alt="assignee"
          className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0"
        />
      ))}
    </div>,
    task.date,
    task.rating ? (
      <div className="flex items-center gap-1">
        {stars.map((star) => (
          <svg
            key={star}
            className={`w-6 h-6 cursor-pointer ${star <= task.rating ? 'text-yellow-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
            onClick={() => setRating(star)}
          >
            <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.417 8.273L12 18.856l-7.416 3.408 1.417-8.273-6.001-5.822 8.332-1.151z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{task.rating}</span>
      </div>
    ) : (
      <button
        onClick={handelRatingModal}
        className="border border-gray-200 bg-white hover:bg-gray-50 rounded-md px-4 py-1 flex items-center justify-center gap-2"
      >
        <svg
          className={`w-3 h-3 cursor-pointer text-white stroke-2 stroke-yellow-500`}
          fill="currentColor"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.417 8.273L12 18.856l-7.416 3.408 1.417-8.273-6.001-5.822 8.332-1.151z" />
        </svg>
        {t("Rate")}
      </button>
    ),
  ]);

  return (
    <Page isTitle={false}>
      <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
        <div className="w-full md:w-1/2">
          <TasksSummaryChart />
        </div>
        <div className="w-full md:w-1/2">
          <DepartmentsAnalytics />
        </div>
      </div>

      {/* Task/Project Evaluation & Activity Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Task/Project Evaluation Section (2/3 of the width) */}
        <div className="lg:col-span-2">
          <Table
            title="Task/Project Evaluation"
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

      <ProjectRatingModal
        isOpen={isRatingModal}
        onClose={handelRatingModal}
        project={1}
      />
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
