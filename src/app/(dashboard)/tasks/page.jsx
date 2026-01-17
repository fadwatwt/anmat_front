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
import { convertToSlug } from "@/functions/AnotherFunctions";
import { translateDate } from "@/functions/Days";

import { RiEyeLine, RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";

// ✅ Lazy-loaded components
const NameAndDescription = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription"), { ssr: false });
const AccountDetails = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/AccountDetails"), { ssr: false });
const Priority = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/Priority"), { ssr: false });
const Status = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/Status"), { ssr: false });
const MembersListXLine = dynamic(() => import("@/app/(dashboard)/projects/[slug]/_components/MembersListXLine"), { ssr: false });
const TimeLine = dynamic(() => import("@/components/TimeLine/TimeLine"), { ssr: false });
const Alert = dynamic(() => import("@/components/Alerts/Alert"), { ssr: false });
const StatusCell = dynamic(() => import("@/components/StatusCell"), { ssr: false });

import { tasksRows } from "@/functions/FactoryData.jsx";

function TasksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxTasks = useSelector((state) => state.tasks);
  const tasks = (reduxTasks?.tasks && reduxTasks.tasks.length > 0)
    ? reduxTasks.tasks
    : tasksRows.map(t => ({ ...t, _id: t.id }));
  const loading = reduxTasks?.loading || false;
  const error = reduxTasks?.error || null;
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

  // Headers matching the design
  const headers = [
    { label: t("Tasks"), width: "250px" },
    { label: t("Assignee"), width: "200px" },
    { label: t("Assigned - Due Date"), width: "300px" },
    { label: t("Started - Ended at Date"), width: "300px" },
    { label: t("Priority"), width: "120px" },
    { label: t("Status"), width: "120px" },
    { label: "", width: "50px" },
  ];

  const handleCreateTask = () => router.push("/tasks/create");

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

  const customActions = (index) => {
    const task = tasks[index];
    const actions = [
      {
        text: t("View"),
        icon: <RiEyeLine size={16} className="text-blue-500" />,
        onClick: () => router.push(`/tasks/${task._id}-${convertToSlug(task.title)}/details`),
      },
      {
        text: t("Edit"),
        icon: <RiEditLine size={16} className="text-primary-500" />,
        onClick: () => router.push(`/tasks/${task._id}-${convertToSlug(task.title)}/edit`),
      },
      {
        text: t("Delete"),
        icon: <RiDeleteBinLine size={16} className="text-red-500" />,
        onClick: () => handleDeleteConfirmation(task),
      },
    ];

    return (
      <StatusActions states={actions} />
    );
  };

  const taskRowTable = useMemo(() => {
    return tasks.map((task) => [
      <NameAndDescription
        key={`name-${task._id}`}
        path={`/tasks/${task._id}-${convertToSlug(task.title)}/details`}
        name={task.title}
        description={task.description}
      />,
      <AccountDetails
        key={`assignee-${task._id}`}
        account={{
          name: task.assignedTo?.[0]?.name || "Unassigned",
          imageProfile: task.assignedTo?.[0]?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo?.[0]?.name || "Unassigned")}`,
        }}
      />,
      <p key={`dates-${task._id}`} className="text-sm dark:text-sub-300">
        {translateDate(task.assignedDate)} - {translateDate(task.dueDate)}
      </p>,
      <p key={`start-end-${task._id}`} className="text-sm dark:text-sub-300">
        {task.startDate ? `${translateDate(task.startDate)} - ${translateDate(task.endDate || task.dueDate)}` : "-"}
      </p>,
      <Priority key={`priority-${task._id}`} type={task.priority} title={task.priority} />,
      <Status key={`status-${task._id}`} type={task.status} title={task.status} />,
    ]);
  }, [tasks]);

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
        {...(authUserType === "Subscriber" ? { isBtn: true, btnOnClick: handleCreateTask, btnTitle: t("Create a Task") } : {})}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 h-full">
            {loading ? (
              <div className="text-center py-6">{t("Loading tasks...")}</div>
            ) : (
              <Table
                className="custom-class"
                title={t("All Tasks")}
                headers={headers}
                rows={taskRowTable}
                isCheckInput={true}
                customActions={customActions}
                showStatusFilter={true}
                isActions={false} // We use customActions
              />
            )}
          </div>
          {/* Timeline removed from design requirement */}
        </div>
      </Page>



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