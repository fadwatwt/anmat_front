"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";

// Dynamic imports
const Table = dynamic(() => import("@/components/Tables/Table"), { ssr: false });
const ActivityLogs = dynamic(() => import("@/components/ActivityLogs"), { ssr: false });
const ProjectRatingModal = dynamic(() => import("../dashboard/projects/_modal/ProjectRatingModal"), { ssr: false });
const Alert = dynamic(() => import("@/components/Alert"), { ssr: false });
const Page = dynamic(() => import("@/components/Page"));
const DefaultSelect = dynamic(() => import("@/components/Form/DefaultSelect"));
import { StatusBadge } from "@/app/dashboard/hr/_Tabs/AttendanceTab";

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

const TaskManagementDashboard = () => {
  const [requestType] = useState("Leave Request");
  const { t } = useTranslation("common");
  const [theme, setTheme] = useState("light");
  const [isRatingModal, setIsModalSetting] = useState(false);
  const [isConfirmApprovalAlert, setIsConfirmApprovalAlert] = useState(false);

  useEffect(() => {
    const storedTheme = typeof window !== "undefined" && localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
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

  const monthlyData = [
    { name: "Jan", onTime: 45, late: 35 },
    { name: "Feb", onTime: 65, late: 55 },
    { name: "Mar", onTime: 35, late: 30 },
    { name: "Apr", onTime: 60, late: 85 },
    { name: "May", onTime: 55, late: 30 },
    { name: "Jun", onTime: 50, late: 45 },
  ];

  const activityLogs = [
    {
      type: "add",
      title: "New task added",
      description: "John Doe added a new task: Design website layout.",
      timeAgo: "2025-01-13T14:00:00.000Z",
    },
  ];

  const taskSummaryData = { total: 200, active: 50, completed: 50, late: 50, overdue: 50 };

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
      rating: 4.5,
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
        <span className="text-yellow-500">{task.rating} ★</span>
    ) : (
        <button
            onClick={handelRatingModal}
            className="w-full border border-gray-700 rounded-md py-1"
        >
          {t("Rating")} <span className="text-yellow-500">★</span>
        </button>
    ),
  ]);

  const requestHeaders = [
    { label: "Employee", width: "200px" },
    { label: "Requested Date", width: "120px" },
    { label: "Days Requested", width: "120px" },
    { label: "Days Left", width: "120px" },
    { label: "Status", width: "120px" },
    { label: "Actions", width: "200px" },
  ];

  const requestRows = (
      requestType === "Leave Request" ? leaveRequests : financialRequests
  ).map((request, index) => [
    request.employee,
    new Date(request.requestedDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    request.daysRequested,
    request.daysLeft,
    <StatusBadge key={index} status={request.status} />,
    <div key={index} className="flex gap-2">
      <button className="bg-red-100 text-red-600 px-3 py-1 rounded-md w-fit">Reject</button>
      <button
          onClick={handelConfirmApprovalAlert}
          className="bg-green-100 text-green-600 px-3 py-1 rounded-md w-fit"
      >
        Accept
      </button>
    </div>,
  ]);

  return (
      <Page isTitle={false}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Summary Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                {t("Tasks Summary")}
              </h2>
              <div className="flex gap-2">
                <DefaultSelect
                    classNameContainer={"w-28"}
                    options={[{ id: "", value: "option" }]}
                />
                <DefaultSelect
                    classNameContainer={"w-28"}
                    options={[{ id: "", value: "Last Month" }]}
                />
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <DonutChart
                    data={[
                      { value: taskSummaryData.active, color: "#375DFB" },
                      { value: taskSummaryData.completed, color: "#38C793" },
                      { value: taskSummaryData.late, color: "#F17B2C" },
                      { value: taskSummaryData.overdue, color: "#DF1C41" },
                    ]}
                    total={taskSummaryData.total}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-200">
                      {t("TASKS")}
                    </div>
                    <div className="text-3xl font-bold dark:text-white">
                      {taskSummaryData.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-indigo-600 font-semibold">
                  {taskSummaryData.active}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-200">
                  {t("Active")}
                </div>
              </div>
              <div>
                <div className="text-green-600 text-sm ">
                  {taskSummaryData.completed}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-200">
                  {t("On - Time Completed")}
                </div>
              </div>
              <div>
                <div className="text-yellow-600 font-semibold">
                  {taskSummaryData.late}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-200">
                  {t("Late Completed")}
                </div>
              </div>
              <div>
                <div className="text-red-600 font-semibold">
                  {taskSummaryData.overdue}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-200">
                  {t("Overdue")}
                </div>
              </div>
            </div>
          </div>

          {/* Department Analytics Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                {t("Departments analytics")}
              </h2>
              <div className="flex gap-2">
                <DefaultSelect
                    classNameContainer={"w-28"}
                    options={[{ id: "", value: "Department" }]}
                />
                <DefaultSelect
                    classNameContainer={"w-32"}
                    options={[{ id: "", value: "Last 6 months" }]}
                />
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4}>
                  {" "}
                  {/* Reduce barGap */}
                  <CartesianGrid
                      className={"bg-gary-800 text-gray-800"}
                      stroke={
                        theme === "dark" ? "rgb(78,90,110)" : "rgb(166,167,169)"
                      }
                      strokeDasharray="3 3"
                      vertical={false}
                  />
                  <XAxis
                      dataKey="name"
                      className={"text-gray-700 dark:text-gray-400"}
                      axisLine={false}
                      tickLine={false}
                      tick={
                        theme === "dark"
                            ? { fill: "#d1d2d3", fontSize: 12 }
                            : { fill: "#6B7280", fontSize: 12 }
                      }
                  />
                  <YAxis
                      domain={[0, 125]}
                      ticks={[0, 25, 50, 75, 100, 125]}
                      axisLine={false}
                      tickLine={false}
                      tick={
                        theme === "dark"
                            ? { fill: "#d1d2d3", fontSize: 12 }
                            : { fill: "#6B7280", fontSize: 12 }
                      }
                  />
                  <Bar
                      dataKey="onTime"
                      fill="#38C793"
                      name={t("On-Time Completed")}
                      radius={[15, 15, 0, 0]}
                      barSize={15} // Reduce bar size
                  />
                  <Bar
                      dataKey="late"
                      fill="#F17B2C"
                      name={t("Late Completed")}
                      radius={[15, 15, 0, 0]}
                      barSize={15} // Reduce bar size
                  />
                  <Legend
                      iconType="circle"
                      wrapperStyle={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: `1px solid ${
                            theme === "dark" ? "rgb(78,90,110)" : "#E5E7EB"
                        }`,
                      }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Task/Project Evaluation & Activity Logs Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task/Project Evaluation Section (2/3 of the width) */}
          <div className="bg-white rounded-xl shadow-sm lg:col-span-2">
            <Table
                title="Task/Project Evaluation"
                headers={headers}
                rows={rows}
                isCheckInput={false}
                isTitle={true}
                classContainer={"h-full"}
            />
          </div>

          {/* Activity Logs Section (1/3 of the width) */}
          <ActivityLogs className={"max-h-[30rem]"} activityLogs={activityLogs} />
        </div>

        {/* Requests Section */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6"></div>

          <Table
              headers={requestHeaders}
              viewModalList={viewModalList}
              rows={requestRows}
              isCheckInput={false}
              isTitle={true}
              classContainer="w-full"
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showControlBar={true}
              currentDate={currentDate}
          />
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
            onSubmit={() => {}}
            titleSubmitBtn={"Approve"}
            titleCancelBtn={"Cancel"}
        />
      </Page>
  );
};

export default TaskManagementDashboard;
