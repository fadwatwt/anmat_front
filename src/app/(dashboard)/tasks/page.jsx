"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { fetchTasks, deleteTask } from "@/redux/tasks/tasksAPI";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import EmployeeProjectStates from "@/app/(dashboard)/_components/EmployeeStates";
import useAuthStore from '@/store/authStore.js';

// ✅ Lazy-loaded components
const NameAndDescription = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription"), { ssr: false });
const AccountDetails = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/AccountDetails"), { ssr: false });
const Priority = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/Priority"), { ssr: false });
const Status = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/Status"), { ssr: false });
const MembersListXLine = dynamic(() => import("@/app/(dashboard)/projects/[slug]/_components/MembersListXLine"), { ssr: false });
const TimeLine = dynamic(() => import("@/components/TimeLine/TimeLine"), { ssr: false });
const EditTaskModal = dynamic(() => import("@/app/(dashboard)/tasks/_modal/EditTaskModal"), { ssr: false });
const Alert = dynamic(() => import("@/components/Alert"), { ssr: false });

// Hardcoded sample tasks data
const sampleTasks = [
  {
    _id: "1",
    title: "Design Homepage",
    description: "Create a new homepage layout",
    manager: { name: "Jane Doe", imageProfile: "https://ui-avatars.com/api/?name=Jane+Doe" },
    assignedTo: [{ name: "John Smith", imageProfile: "https://ui-avatars.com/api/?name=John+Smith" }],
    assignedDate: "2025-07-10",
    dueDate: "2025-07-25",
    priority: "high",
    status: "in-progress",
  },
  {
    _id: "2",
    title: "Bug Fixing",
    description: "Fix critical bugs in the app",
    manager: { name: "Alice Brown", imageProfile: "https://ui-avatars.com/api/?name=Alice+Brown" },
    assignedTo: [{ name: "Mike Wilson", imageProfile: "https://ui-avatars.com/api/?name=Mike+Wilson" }],
    assignedDate: "2025-07-15",
    dueDate: "2025-07-30",
    priority: "medium",
    status: "pending",
  },
  {
    _id: "3",
    title: "API Integration",
    description: "Integrate new payment API",
    manager: { name: "Bob Johnson", imageProfile: "https://ui-avatars.com/api/?name=Bob+Johnson" },
    assignedTo: [
      { name: "Sarah Davis", imageProfile: "https://ui-avatars.com/api/?name=Sarah+Davis" },
      { name: "Tom Lee", imageProfile: "https://ui-avatars.com/api/?name=Tom+Lee" },
    ],
    assignedDate: "2025-07-20",
    dueDate: "2025-08-05",
    priority: "low",
    status: "completed",
  },
];

function TasksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks) || { tasks: sampleTasks, loading: false, error: null }; // Fallback to sample data
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [taskEdit, setTaskEdit] = useState(null);
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Define authUserType (e.g., from context or state management)
  const { authUserType } = useAuthStore();

  // ✅ Fetch tasks only if needed
  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasks]);

  // Define headers based on user type
  const headersConfig = {
    Employee: [
      { label: t("Tasks"), width: "200px" },
      { label: t("Manager"), width: "200px" },
      { label: t("Assignees"), width: "150px" },
      { label: t("Assigned - Due Date"), width: "300px" },
      { label: t("Priority"), width: "100px" },
      { label: t("Status"), width: "100px" },
      { label: "", width: "50px" },
    ],
    "Company-Manager": [
      { label: t("Tasks"), width: "200px" },
      { label: t("Assigned to"), width: "150px" },
      { label: t("Manager"), width: "200px" },
      { label: t("Assigned - Due Date"), width: "300px" },
      { label: t("Priority"), width: "100px" },
      { label: t("Status"), width: "100px" },
      { label: "", width: "50px" },
    ],
  };

  const handleCreateTask = () => router.push("/tasks/create");
  const handleEditModal = (task) => {
    setTaskEdit(task);
    setIsOpenEditModal(true);
  };
  const handleDeleteConfirmation = (task) => {
    setTaskToDelete(task);
    setIsOpenDeleteAlert(true);
  };
  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await dispatch(deleteTask(taskToDelete._id)).unwrap();
        setIsOpenDeleteAlert(false);
        setTaskToDelete(null);
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  const taskRowTable = useMemo(() => {
    return tasks.map((task) => [
      <NameAndDescription
        key={`name-${task._id}`}
        path={`/tasks/${task._id}-${convertToSlug(task.title)}`}
        name={task.title}
        description={task.description}
      />,
      ...(authUserType === "Employee" ? [
        <AccountDetails
          key={`manager-${task._id}`}
          account={{
            name: task.manager?.name || "N/A",
            imageProfile: task.manager?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.manager?.name || "John Doe")}`,
          }}
        />,
      ] : [
        <MembersListXLine
          key={`members-${task._id}`}
          members={task.assignedTo || []}
          maxVisible={3}
        />,
      ]),
      ...(authUserType === "Company-Manager" ? [
        <AccountDetails
          key={`manager-${task._id}`}
          account={{
            name: task.manager?.name || "N/A",
            imageProfile: task.manager?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.manager?.name || "John Doe")}`,
          }}
        />,
      ] : []),
      <p key={`dates-${task._id}`} className="text-sm dark:text-sub-300">
        {translateDate(task.assignedDate)} - {translateDate(task.dueDate)}
      </p>,
      <Priority key={`priority-${task._id}`} type={task.priority} title={task.priority} />,
      <Status key={`status-${task._id}`} type={task.status} title={task.status} />,
    ]);
  }, [tasks, authUserType]);

  if (error) {
    return (
      <Page title={t("Tasks")}>
        <div className="text-center text-red-500 mt-8">
          {t("Failed to load tasks. Please try again later.")}
        </div>
      </Page>
    );
  }

  return (
    <>
      <Page
        title={t("Tasks")}
        {...(authUserType === "Company-Manager" ? { isBtn: true, btnOnClick: handleCreateTask, btnTitle: t("Create a Task") } : {})}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 h-full">
            {loading ? (
              <div className="text-center py-6">{t("Loading tasks...")}</div>
            ) : (
              <Table
                className="custom-class"
                title={t("All Tasks")}
                headers={headersConfig[authUserType]}
                rows={taskRowTable}
                {...(authUserType === "Employee" ? { customActions: (actualRowIndex) => <EmployeeProjectStates actualRowIndex={actualRowIndex} /> } : {})}
                {...(authUserType === "Company-Manager" ? { isActions: true, isFilter: true, handelDelete: (index) => handleDeleteConfirmation(tasks[index]), handelEdit: (index) => handleEditModal(tasks[index]) } : {})}
              />
            )}
          </div>
          {authUserType === "Company-Manager" && (
            <div className="flex md:w-[37.5%] w-full">
              <TimeLine />
            </div>
          )}
        </div>
      </Page>

      <EditTaskModal
        task={taskEdit}
        isOpen={isOpenEditModal}
        onClose={() => setIsOpenEditModal(false)}
      />

      <Alert
        type="warning"
        title={t("Delete Task?")}
        message={t("Are you sure you want to delete this task?")}
        titleCancelBtn={t("Cancel")}
        titleSubmitBtn={t("Delete")}
        isOpen={isOpenDeleteAlert}
        onClose={() => setIsOpenDeleteAlert(false)}
        onSubmit={handleDeleteTask}
        isBtns={1}
      />
    </>
  );
}

export default TasksPage;