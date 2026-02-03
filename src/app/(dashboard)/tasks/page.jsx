"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import useAuthStore from '@/store/authStore.js';
import { convertToSlug } from "@/functions/AnotherFunctions";
import { translateDate } from "@/functions/Days";
import { RiEyeLine, RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";
import {
  useGetSubscriberTasksQuery,
  useDeleteSubscriberTaskMutation
} from "@/redux/tasks/subscriberTasksApi";

// ✅ Lazy-loaded components
const NameAndDescription = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription"), { ssr: false });
const AccountDetails = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/AccountDetails"), { ssr: false });
const Priority = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/Priority"), { ssr: false });
const Status = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/Status"), { ssr: false });
const Alert = dynamic(() => import("@/components/Alerts/Alert"), { ssr: false });
const ApiResponseAlert = dynamic(() => import("@/components/Alerts/ApiResponseAlert"), { ssr: false });

function TasksPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: tasks = [], isLoading, isError } = useGetSubscriberTasksQuery();
  const [deleteSubscriberTask] = useDeleteSubscriberTaskMutation();

  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  // Define authUserType (e.g., from context or state management)
  const { authUserType } = useAuthStore();

  // Headers matching the design and important info
  const headers = [
    { label: t("Tasks"), width: "250px" },
    { label: t("Project"), width: "150px" },
    { label: t("Department"), width: "150px" },
    { label: t("Assignee"), width: "150px" },
    { label: t("Creator"), width: "150px" },
    { label: t("Priority"), width: "100px" },
    { label: t("Status"), width: "100px" },
    { label: t("Progress"), width: "120px" },
    { label: t("Due Date"), width: "120px" },
    { label: "", width: "50px" },
  ];

  const handleCreateTask = () => router.push("/tasks/create");

  const handleDeleteConfirmation = (task) => {
    setTaskToDelete(task);
    setIsOpenDeleteAlert(true);
  };

  const handleDeleteTask = async (confirmed) => {
    if (!confirmed) {
      setIsOpenDeleteAlert(false);
      setTaskToDelete(null);
      return;
    }
    if (taskToDelete) {
      try {
        const res = await deleteSubscriberTask(taskToDelete._id).unwrap();
        setApiResponse({
          isOpen: true,
          status: "success",
          message: res?.message || t("Task deleted successfully"),
        });
        setIsOpenDeleteAlert(false);
        setTaskToDelete(null);
      } catch (err) {
        setApiResponse({
          isOpen: true,
          status: "error",
          message: err?.data?.message || t("Failed to delete task"),
        });
        setIsOpenDeleteAlert(false);
      }
    }
  };

  const customActions = (index) => {
    const task = tasks[index];
    if (!task) return null;

    const actions = [
      {
        text: t("View"),
        icon: <RiEyeLine size={16} className="text-blue-500" />,
        onClick: () => router.push(`/tasks/${task._id}/details`),
      },
      {
        text: t("Edit"),
        icon: <RiEditLine size={16} className="text-primary-500" />,
        onClick: () => router.push(`/tasks/${task._id}/edit`),
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
      <p title={task.project?.name} key={`project-${task._id}`} className="text-sm dark:text-sub-300 truncate max-w-[140px]">
        {task.project?.name || t("No Project")}
      </p>,
      <p title={task.department?.name} key={`dept-${task._id}`} className="text-sm dark:text-sub-300 truncate max-w-[140px]">
        {task.department?.name || t("No Department")}
      </p>,
      <AccountDetails
        key={`assignee-${task._id}`}
        account={{
          name: task.assignee?.name || t("Unassigned"),
          imageProfile: task.assignee?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee?.name || "U")}`,
        }}
      />,
      <AccountDetails
        key={`creator-${task._id}`}
        account={{
          name: task.creator?.name || t("Unknown"),
          imageProfile: task.creator?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.creator?.name || "C")}`,
        }}
      />,
      <Priority key={`priority-${task._id}`} type={task.priority} />,
      <Status key={`status-${task._id}`} type={task.status} />,
      <div key={`progress-${task._id}`} className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 min-w-[60px]">
          <div
            className="bg-primary-500 h-1.5 rounded-full"
            style={{ width: `${task.progress || 0}%` }}
          ></div>
        </div>
        <span className="text-xs font-medium text-sub-500 dark:text-sub-300">{task.progress || 0}%</span>
      </div>,
      <p key={`due-date-${task._id}`} className="text-sm dark:text-sub-300 text-nowrap">
        {task.due_date ? translateDate(task.due_date) : "-"}
      </p>,
    ]);
  }, [tasks, t]);

  if (isError) {
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
            {isLoading ? (
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
                isActions={false}
              />
            )}
          </div>
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

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
      />
    </>
  );
}

export default TasksPage;
