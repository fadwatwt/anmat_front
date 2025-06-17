import  { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Table from "../components/Tables/Table"; // Import the Table component
import { StatusBadge } from "./HR/Tabs/AttendanceTab";
import Page from "./Page.jsx";
import DefaultSelect from "../components/Form/DefaultSelect.jsx";
import ActivityLogs from "../components/ActivityLogs.jsx";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import ProjectRatingModal from "./Projects/modal/ProjectRatingModal.jsx";
import Alert from "../components/Alert.jsx";
import { Setting,Edit ,Share,Messages1,Category,Profile2User,TaskSquare,NoteText,Chart2,HambergerMenu,SearchNormal} from 'iconsax-react';

const DonutChart = ({ data, total }) => {
  let cumulativePercent = 0;

  const createCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const paths = data.map((segment) => {
    const percent = segment.value / total;
    const [startX, startY] = createCoordinatesForPercent(cumulativePercent);
    cumulativePercent += percent;
    const [endX, endY] = createCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;

    return (
        <path
            key={segment.color}
            d={`
          M ${startX} ${startY}
          A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}
        `}
            stroke={segment.color}
            strokeWidth="0.2"
            fill="none"
        />
    );
  });

  return (
      <svg viewBox="-1.1 -1.1 2.2 2.2" style={{ transform: "rotate(-90deg)" }}>
        <circle
            cx="0"
            cy="0"
            r="1"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="0.1"
        />
        {paths}
      </svg>
  );
};

DonutChart.propTypes = {
  data: PropTypes.array,
  total:PropTypes.string || PropTypes.number
}

const TaskManagementDashboard = ({ isPreview = false }) => {
  const [requestType] = useState("Leave Request"); // State for switch
  const {t,i18n} = useTranslation()
  const [isRatingModal,setIsModalSetting] = useState(false)
  const [isConfirmApprovalAlert,setIsConfirmApprovalAlert] = useState(false)

  const handelRatingModal = () => {
    setIsModalSetting(!isRatingModal);
  }

  const handelConfirmApprovalAlert = () => {
    setIsConfirmApprovalAlert(!isConfirmApprovalAlert)
  }

  const viewModalList = [
    { id: "Leave", title: "Leave" },
    { id: "Financial", title: "Financial" },
  ];
  const [viewMode, setViewMode] = useState("week");
  const [currentDate] = useState(new Date());

  const theme = localStorage.getItem("theme")

  // Mock data for the charts
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
    {
      type: "video",
      title: "Meeting scheduled",
      description: "Bob Brown added a comment to the task: Perform QA Testing.",
      timeAgo: "2025-01-13T11:00:00.000Z",
    },
    {
      type: "uploaded",
      title: "File uploaded",
      description: "Jane Smith uploaded 'UI_Design.png' to the project.",
      timeAgo: "2025-01-12T16:00:00.000Z",
    },
    {
      type: "check",
      title: "Task completed",
      description: "Alice Johnson marked the task 'Implement Backend APIs' as complete.",
      timeAgo: "2025-01-10T16:00:00.000Z",
    },
    {
      type: "add",
      title: "New task added",
      description: "Bob Brown added a comment to the task: Perform QA Testing.",
      timeAgo: "2025-01-13T11:00:00.000Z",
    },
  ];

  const taskSummaryData = {
    total: 200,
    active: 50,
    completed: 50,
    late: 50,
    overdue: 50,
  };

  const taskList = [
    {
      id: 1,
      name: "Project Omega",
      department: "Publishing",
      assignees: [
        "https://i.pravatar.cc/32?img=1",
        "https://i.pravatar.cc/32?img=2",
        "https://i.pravatar.cc/32?img=3",
      ],
      date: "15 Nov, 2024",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Task Echo",
      department: "Sales",
      assignees: ["https://i.pravatar.cc/32?img=4", "https://i.pravatar.cc/32?img=5"],
      date: "15 Nov, 2024",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Project Bravo",
      department: "HR",
      assignees: [
        "https://i.pravatar.cc/32?img=6",
        "https://i.pravatar.cc/32?img=7",
        "https://i.pravatar.cc/32?img=8",
      ],
      date: "15 Nov, 2024",
      rating: null,
    },
    {
      id: 4,
      name: "Task Charlie",
      department: "Marketing",
      assignees: ["https://i.pravatar.cc/32?img=9", "https://i.pravatar.cc/32?img=10"],
      date: "15 Nov, 2024",
      rating: 4.5,
    },
    {
      id: 5,
      name: "Project Delta",
      department: "Finance",
      assignees: [
        "https://i.pravatar.cc/32?img=11",
        "https://i.pravatar.cc/32?img=12",
      ],
      date: "20 Nov, 2024",
      rating: 3.0,
    },
    {
      id: 6,
      name: "Task Alpha",
      department: "Operations",
      assignees: ["https://i.pravatar.cc/32?img=13"],
      date: "10 Nov, 2024",
      rating: null,
    },
  ];

  const taskManagementTableColumns = [
    {
      header: t("Project/Task Name"),
      accessorKey: "name",
      cell: (info) => info.getValue(),
    },
    {
      header: t("Department"),
      accessorKey: "department",
      cell: (info) => info.getValue(),
    },
    {
      header: t("Assigned Employee(s)"),
      accessorKey: "assignees",
      cell: ({ row }) => (
        <div className="flex -space-x-1 overflow-hidden">
          {row.original.assignees.slice(0, 3).map((assignee, index) => (
            <img
              key={index}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
              src={assignee}
              alt=""
            />
          ))}
          {row.original.assignees.length > 3 && (
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs text-gray-600 ring-2 ring-white">
              +{row.original.assignees.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("Delivery Date"),
      accessorKey: "date",
      cell: (info) => info.getValue(),
    },
    {
      header: t("Rating"),
      accessorKey: "rating",
      cell: ({ row }) => {
        const rating = row.original.rating;
        if (isPreview) {
          // Simplified rating for preview
          return rating !== null ? (
            <span className="text-sm text-gray-600">{rating} ★</span>
          ) : (
            <span className="text-sm text-gray-400">N/A</span>
          );
        }
        return rating !== null ? (
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.floor(rating) }).map((_, i) => (
              <svg
                key={i}
                className="h-4 w-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
            {rating % 1 !== 0 && (
              <svg
                className="h-4 w-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2.927c-.3-.921-1.603-.921-1.902 0l-1.07 3.292a1 1 0 01-.95.69H3.462c-.969 0-1.371 1.24-.588 1.81l2.8 2.034a1 1 0 01.364 1.118l-1.07 3.292c-.3.921.755 1.683 1.54 1.118l2.8-2.034a1 1 0 011.175 0l2.8 2.034c.784.565 1.838-.197 1.539-1.118l-1.07-3.292a1 1 0 01.364-1.118l2.8-2.034c.783-.57.38-1.81-.588-1.81h-3.461a1 1 0 01-.95-.69l-1.07-3.292zM10 14.288l-.898.653c-.352.256-.81.084-.962-.358l-.481-1.479a1 1 0 00-.364-1.118l-1.479-1.07c-.443-.162-.576-.714-.23-1.066l.653-.898c.256-.352.084-.81-.358-.962l-1.479-.481a1 1 0 00-1.118-.364l-1.07-3.292c-.3-.921-.755-1.683-1.54-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0z" />
              </svg>
            )}
            <span className="text-sm text-gray-600">{rating}</span>
          </div>
        ) : (
          <button onClick={handelRatingModal} className="flex items-center gap-1 text-primary-base">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.683-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.565-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
              ></path>
            </svg>
            Rate
          </button>
        );
      },
    },
  ];

  const taskManagementTableData = taskList.map((task) => ({
    ...task,
    assignees: task.assignees.map((assignee) => assignee),
  }));

  const data = [
    { name: "Active", value: taskSummaryData.active, color: "#4285F4" },
    { name: "On-Time Completed", value: taskSummaryData.completed, color: "#34A853" },
    { name: "Late Completed", value: taskSummaryData.late, color: "#FBBC05" },
    { name: "Overdue", value: taskSummaryData.overdue, color: "#EA4335" },
  ];

  if (isPreview) {
    return (
      <div className="flex flex-col h-full p-4 overflow-hidden">
        {/* Top section: Employees Management and Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img
              className="w-6 h-6"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Hov7jcWb4cWae_alBRxB-N1tJiTFrpt1PA&s"
              alt="Logo"
            />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Employees Management</p>
          </div>
          <SearchNormal size={18} className="dark:text-gray-300"/>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="pr-4 border-r border-gray-200 dark:border-gray-700 w-1/4 flex-shrink-0">
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-blue-600 font-medium text-xs">
                <span className="w-1 h-4 bg-blue-600 rounded-tr-lg rounded-br-lg"></span>
                <Chart2 size={16} className="dark:text-white"/>
                Dashboard
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-xs">
                <span className="w-1 h-4"></span>
                <Category size={16} className="dark:text-gray-300"/>
                Projects
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-xs">
                <span className="w-1 h-4"></span>
                <TaskSquare size={16} className="dark:text-gray-300"/>
                Tasks
              </li>
            </ul>
          </div>

          {/* Content Area */}
          <div className="pl-4 w-3/4 flex-shrink-0">
            {/* Tasks Summary */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-3">
              <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Tasks Summary</p>
              <div className="flex justify-around items-center text-xs">
                <div className="text-center">
                  <p className="font-bold text-blue-500">{taskSummaryData.active}</p>
                  <p>Active</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-green-500">{taskSummaryData.completed}</p>
                  <p>Completed</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-red-500">{taskSummaryData.overdue}</p>
                  <p>Overdue</p>
                </div>
              </div>
            </div>

            {/* Departments Analytics */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
              <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Departments Analytics</p>
              <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 text-xs">
                [Bar Chart Placeholder]
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${isPreview ? 'p-4 overflow-hidden' : 'box-border mx-auto py-5 md:px-10 px-3'}`}>
      {/* Top section: Employees Management and Search */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <img
            className="w-8 h-8"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Hov7jcWb4cWae_alBRxB-N1tJiTFrpt1PA&s"
            alt="Logo"
          />
          <div className="text-gray-700 dark:text-gray-300">
            <p className="font-semibold">Employees Management</p>
            <p className="text-xs">Employees & HR Management</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <svg
            className="h-5 w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`pr-4 border-r border-gray-200 dark:border-gray-700 ${isPreview ? 'w-1/4' : 'w-1/4'}`}>
          <ul className="space-y-4">
            <li className="flex items-center gap-2 text-blue-600 font-medium">
              <span className="w-2 h-6 bg-blue-600 rounded-tr-lg rounded-br-lg"></span>
              <Chart2 size={20} className="dark:text-white"/>
              Dashboard
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-6"></span>
              <Category size={20} className="dark:text-gray-300"/>
              Projects
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-6"></span>
              <TaskSquare size={20} className="dark:text-gray-300"/>
              Tasks
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-6"></span>
              <Profile2User size={20} className="dark:text-gray-300"/>
              HR Management
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-6"></span>
              <Messages1 size={20} className="dark:text-gray-300"/>
              Conversations
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-6"></span>
              <Share size={20} className="dark:text-gray-300"/>
              Social Media
            </li>
            <li className="flex items-center gap-2 text-gray-500">
              <span className="w-2 h-6"></span>
              <Setting size={20} className="dark:text-gray-300"/>
              Settings
            </li>
          </ul>

          {!isPreview && (
            <div className="mt-8">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-4">Timeline</h3>
              <ActivityLogs activityLogs={activityLogs} />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className={`pl-4 ${isPreview ? 'w-3/4' : 'w-3/4'}`}>
          {/* Tasks Summary */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Tasks Summary</h3>
              <div className="flex gap-2">
                <DefaultSelect classNameContainer={"w-28"} options={[{id:"", value:"Tasks"}]} />
                <DefaultSelect classNameContainer={"w-28"} options={[{id:"", value:"Last Month"}]} />
              </div>
            </div>

            <div className="flex justify-around items-center">
              {/* Doughnut Chart */}
              <div className="w-32 h-32 relative">
                <DonutChart
                  data={data}
                  total={taskSummaryData.total}
                />
                <div className="absolute inset-0 flex items-center justify-center text-center text-gray-500 text-sm">
                  Tasks:
                  <br />
                  {taskSummaryData.total}
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Active {taskSummaryData.active}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>On-Time Completed {taskSummaryData.completed}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>Late Completed {taskSummaryData.late}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>Overdue {taskSummaryData.overdue}
                </span>
              </div>
            </div>
          </div>

          {/* Departments Analytics */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Departments analytics</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Legend />
                  <Bar dataKey="onTime" fill="#34A853" name="On-Time Tasks" />
                  <Bar dataKey="late" fill="#EA4335" name="Late Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task/Project Evaluation */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Task/Project Evaluation</h3>
            <Table columns={taskManagementTableColumns} data={taskManagementTableData} />
          </div>
        </div>
      </div>
      {isRatingModal && <ProjectRatingModal handelRatingModal={handelRatingModal} />}
    </div>
  );
};

export default TaskManagementDashboard;