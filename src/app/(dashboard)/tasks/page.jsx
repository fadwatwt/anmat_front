"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";
import { usePermission, useHasAnyPermission } from "@/Hooks/usePermission";
import { taskDetailsPath } from "@/functions/AnotherFunctions";
import { translateDate } from "@/functions/Days";
import {
  RiEyeLine,
  RiDeleteBinLine,
  RiEditLine,
  RiCalendarCheckLine,
} from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { availableTaskStatuses } from "@/functions/taskStatusTransitions";
import {
  useGetSubscriberTasksQuery,
  useGetSavedTaskFiltersQuery,
  useSaveTaskFilterMutation,
  useDeleteSavedTaskFilterMutation,
  useDeleteSubscriberTaskMutation,
  useUpdateSubscriberTaskMutation,
  useUploadSubscriberTaskAttachmentMutation,
} from "@/redux/tasks/subscriberTasksApi";
import {
  useGetEmployeeTasksQuery,
  useUpdateTaskStatusMutation,
  useUploadEmployeeTaskAttachmentMutation,
} from "@/redux/tasks/employeeTasksApi";
import Modal from "@/components/Modal/Modal.jsx";
import EvaluationModal from "@/components/Modal/EvaluationModal";
import StarRating from "@/components/StarRating";
import { useProcessing } from "@/app/providers";
import CreateAppointmentFromTaskModal from "@/components/Appointments/CreateAppointmentFromTaskModal";
import ViewToggle from "./_components/ViewToggle";
import KanbanBoard from "./_components/KanbanBoard";
import WorkloadPanel from "./_components/WorkloadPanel";

// ✅ Lazy-loaded components
const NameAndDescription = dynamic(
  () =>
    import("@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription"),
  { ssr: false },
);
const Priority = dynamic(
  () => import("@/app/(dashboard)/projects/_components/TableInfo/Priority"),
  { ssr: false },
);
const Status = dynamic(
  () => import("@/app/(dashboard)/projects/_components/TableInfo/Status"),
  { ssr: false },
);
const Alert = dynamic(() => import("@/components/Alerts/Alert"), {
  ssr: false,
});
const ApiResponseAlert = dynamic(
  () => import("@/components/Alerts/ApiResponseAlert"),
  { ssr: false },
);

function TasksPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const authUserType = useSelector(selectUserType);
  const [taskFilters, setTaskFilters] = useState({ search: "", status: "", priority: "" });
  const [activeView, setActiveView] = useState(() => typeof window !== "undefined" ? localStorage.getItem("tasks-view-mode") || "table" : "table");
  const [serverFilters, setServerFilters] = useState(taskFilters);
  const [fetchPage, setFetchPage] = useState(1);
  const [loadedTasks, setLoadedTasks] = useState([]);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  useEffect(() => {
    if (taskFilters.search === serverFilters.search && taskFilters.status === serverFilters.status && taskFilters.priority === serverFilters.priority) return;
    const timer = setTimeout(() => { setServerFilters(taskFilters); setFetchPage(1); setLoadedTasks([]); setHasMoreTasks(true); }, 350);
    return () => clearTimeout(timer);
  }, [taskFilters, serverFilters]);
  const { data: savedTaskFilters = [] } = useGetSavedTaskFiltersQuery(undefined, { skip: !authUserType });
  const [saveTaskFilterMutation] = useSaveTaskFilterMutation();
  const [deleteSavedTaskFilter] = useDeleteSavedTaskFilterMutation();
  const [filterName, setFilterName] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("task_search") || params.has("task_status") || params.has("task_priority")) {
      setTaskFilters({ search: (params.get("task_search") || "").slice(0, 100), status: params.get("task_status") || "", priority: params.get("task_priority") || "" });
    }
  }, []);
  const isEmployee = authUserType === "Employee";
  const isSubscriber = authUserType === "Subscriber";
  const canCreateTask = usePermission("tasks.create");
  const canEditTask = usePermission("tasks.update");
  const canEvaluateTask = usePermission("tasks.evaluate");
  const canDeleteTask = usePermission("tasks.delete");
  const canViewWorkload = useHasAnyPermission(["tasks.track_all", "tasks.track_department"]);

  const {
    currentData: subscriberTasksPage,
    isLoading: isSubscriberLoading,
    isFetching: isSubscriberFetching,
    isError: isSubscriberError,
  } = useGetSubscriberTasksQuery({ page: fetchPage, page_size: 100, ...serverFilters }, { skip: !isSubscriber });
  const {
    currentData: employeeTasksPage,
    isLoading: isEmployeeLoading,
    isFetching: isEmployeeFetching,
    isError: isEmployeeError,
  } = useGetEmployeeTasksQuery({ page: fetchPage, page_size: 100, ...serverFilters }, { skip: !isEmployee });
  const taskPage = isEmployee ? employeeTasksPage : subscriberTasksPage;
  const isFetchingTasks = isEmployee ? isEmployeeFetching : isSubscriberFetching;
  useEffect(() => {
    if (!taskPage) return;
    setHasMoreTasks(taskPage.length === 100);
    setLoadedTasks((previous) => {
      if (fetchPage === 1) return taskPage;
      const merged = new Map(previous.map((task) => [task._id, task]));
      taskPage.forEach((task) => merged.set(task._id, task));
      return [...merged.values()];
    });
  }, [taskPage, fetchPage]);

  // The employee API already applies the authorization scope and intentionally
  // includes tasks from projects the employee manages or belongs to.
  const tasks = loadedTasks;
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const search = taskFilters.search.trim().toLocaleLowerCase();
    return (!search || [task.title, task.description].some((value) => String(value || "").toLocaleLowerCase().includes(search))) &&
      (!taskFilters.status || task.status === taskFilters.status) &&
      (!taskFilters.priority || task.priority === taskFilters.priority);
  }), [tasks, taskFilters]);
  const saveTaskFilter = async () => {
    const name = filterName.trim().slice(0, 50);
    if (!name) return;
    try { await saveTaskFilterMutation({ name, ...taskFilters }).unwrap(); setFilterName(""); }
    catch { setApiResponse({ isOpen: true, status: "error", message: t("Could not save filter") }); }
  };
  const shareTaskFilter = async () => {
    const url = new URL(window.location.href);
    for (const key of ["task_search", "task_status", "task_priority"]) url.searchParams.delete(key);
    if (taskFilters.search) url.searchParams.set("task_search", taskFilters.search);
    if (taskFilters.status) url.searchParams.set("task_status", taskFilters.status);
    if (taskFilters.priority) url.searchParams.set("task_priority", taskFilters.priority);
    try { await navigator.clipboard.writeText(url.toString()); setApiResponse({ isOpen: true, status: "success", message: t("Filter link copied") }); }
    catch { setApiResponse({ isOpen: true, status: "error", message: t("Could not copy filter link") }); }
  };
  const isLoading = authUserType
    ? isEmployee
      ? isEmployeeLoading
      : isSubscriberLoading
    : true;
  const isError = isEmployee ? isEmployeeError : isSubscriberError;

  const [deleteSubscriberTask] = useDeleteSubscriberTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateSubscriberTask] = useUpdateSubscriberTaskMutation();
  const [uploadSubscriberAttachment] =
    useUploadSubscriberTaskAttachmentMutation();
  const [uploadEmployeeAttachment] = useUploadEmployeeTaskAttachmentMutation();
  const { showProcessing, hideProcessing } = useProcessing();

  const handleViewChange = (view) => {
    setActiveView(view);
    localStorage.setItem("tasks-view-mode", view);
  };

  const handleKanbanStatusChange = async (taskId, newStatus) => {
    if (!isEmployee && !canEditTask) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: t("You don't have permission to perform this action."),
      });
      throw new Error('Task update permission denied');
    }

    const task = tasks.find((item) => String(item._id) === String(taskId));
    if (!task || !availableTaskStatuses(task.status, canEditTask).includes(newStatus)) {
      setApiResponse({ isOpen: true, status: "error", message: t("Task status transition is not allowed") });
      throw new Error('Task status transition is not allowed');
    }

    try {
      if (isEmployee) {
        await updateTaskStatus({ id: taskId, status: newStatus }).unwrap();
      } else {
        await updateSubscriberTask({ id: taskId, status: newStatus }).unwrap();
      }
      setLoadedTasks((previous) => previous.map((item) => item._id === taskId ? { ...item, status: newStatus } : item));
      setFetchPage(1);
    } catch (err) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || t("Failed to update status"),
      });
      throw err;
    }
  };

  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isOpenStatusModal, setIsOpenStatusModal] = useState(false);
  const [taskToUpdateStatus, setTaskToUpdateStatus] = useState(null);
  const [isOpenEvaluationModal, setIsOpenEvaluationModal] = useState(false);
  const [apiResponse, setApiResponse] = useState({
    isOpen: false,
    status: "",
    message: "",
  });
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [taskForAppointment, setTaskForAppointment] = useState(null);

  const allStatuses = [
    "open",
    "pending",
    "in-progress",
    "completed",
    "done",
    "rejected",
    "cancelled",
  ];
  const restrictedStatuses = ["done", "rejected", "cancelled"];
  const allowedStatuses = canEditTask
    ? allStatuses
    : allStatuses.filter((s) => !restrictedStatuses.includes(s));
  const kanbanColumns = canEditTask ? undefined : allowedStatuses;

  // Options for the table's status filter (value matches the raw task status).
  const taskStatusOptions = useMemo(
    () => [
      { value: "all", name: "Status" },
      { value: "open", name: "Open" },
      { value: "pending", name: "Pending" },
      { value: "in-progress", name: "In-Progress" },
      { value: "completed", name: "Completed" },
      { value: "done", name: "Done" },
      { value: "rejected", name: "Rejected" },
      { value: "cancelled", name: "Cancelled" },
    ],
    [],
  );

  // Headers matching the design and important info
  const headers = useMemo(
    () => [
      { label: t("Tasks"), width: "220px" },
      ...(!isEmployee
        ? [
            { label: t("Project"), width: "110px" },
            { label: t("Department"), width: "130px" },
            { label: t("Assignee"), width: "130px" },
            { label: t("Creator"), width: "130px" },
          ]
        : []),
      { label: t("Priority"), width: "90px" },
      { label: t("Status"), width: "110px" },
      { label: t("Progress"), width: "110px" },
      { label: t("Rating"), width: "100px" },
      { label: t("Due Date"), width: "100px" },
      { label: "", width: "40px" },
    ],
    [isEmployee, t],
  );

  const handleCreateTask = () => {
    if (canCreateTask) router.push("/tasks/create");
  };

  const handleDeleteConfirmation = (task) => {
    if (!canDeleteTask) return;
    setTaskToDelete(task);
    setIsOpenDeleteAlert(true);
  };

  const handleDeleteTask = async (confirmed) => {
    if (!confirmed) {
      setIsOpenDeleteAlert(false);
      setTaskToDelete(null);
      return;
    }
    if (!canDeleteTask) {
      setIsOpenDeleteAlert(false);
      setTaskToDelete(null);
      setApiResponse({
        isOpen: true,
        status: "error",
        message: t("You don't have permission to perform this action."),
      });
      return;
    }
    if (taskToDelete) {
      setIsOpenDeleteAlert(false);
      showProcessing(t("Deleting Task..."));
      try {
        const res = await deleteSubscriberTask(taskToDelete._id).unwrap();
        setLoadedTasks((previous) => previous.filter((item) => item._id !== taskToDelete._id));
        setFetchPage(1);
        setApiResponse({
          isOpen: true,
          status: "success",
          message: res?.message || t("Task deleted successfully"),
        });
        setTaskToDelete(null);
      } catch (err) {
        setApiResponse({
          isOpen: true,
          status: "error",
          message: err?.data?.message || t("Failed to delete task"),
        });
      } finally {
        hideProcessing();
      }
    }
  };

  const handleOpenStatusModal = (task) => {
    setTaskToUpdateStatus(task);
    setIsOpenStatusModal(true);
  };

  const handleStatusUpdate = async (status, evaluationPayload = null) => {
    if (status === "done" && !evaluationPayload) {
      setIsOpenStatusModal(false);
      setIsOpenEvaluationModal(true);
      return;
    }

    if (taskToUpdateStatus) {
      try {
        const payload = { id: taskToUpdateStatus._id, status };
        if (evaluationPayload) {
          Object.assign(payload, evaluationPayload);
        }
        const res = await updateTaskStatus(payload).unwrap();
        setLoadedTasks((previous) => previous.map((item) => item._id === payload.id ? { ...item, status } : item));
        setFetchPage(1);
        setApiResponse({
          isOpen: true,
          status: "success",
          message: res?.message || t("Status updated successfully"),
        });
        setIsOpenStatusModal(false);
        setIsOpenEvaluationModal(false);
        setTaskToUpdateStatus(null);
      } catch (err) {
        setApiResponse({
          isOpen: true,
          status: "error",
          message: err?.data?.message || t("Failed to update status"),
        });
      }
    }
  };

  const handleUploadFile = async (file) => {
    if (!taskToUpdateStatus?._id) return null;
    const formData = new FormData();
    formData.append("file", file);
    const res = isEmployee
      ? await uploadEmployeeAttachment({
          taskId: taskToUpdateStatus._id,
          formData,
        }).unwrap()
      : await uploadSubscriberAttachment({
          taskId: taskToUpdateStatus._id,
          formData,
        }).unwrap();
    return res?.attachment || res?.data || null;
  };

  const customActions = (index) => {
    const task = filteredTasks[index];
    if (!task) return null;

    const actions = [];

    actions.push({
      text: t("View"),
      icon: <RiEyeLine size={16} className="text-blue-500" />,
      onClick: () => {
        const path = taskDetailsPath(task);
        if (path) router.push(path);
      },
    });

    if (canEditTask) {
      actions.push(
        {
          text: t("Edit"),
          icon: <RiEditLine size={16} className="text-primary-500" />,
          onClick: () => router.push(`/tasks/${task._id}/edit`),
        },
        {
          text: t("Change Status"),
          icon: <RiEditLine size={16} className="text-primary-500" />,
          onClick: () => handleOpenStatusModal(task),
        },
      );
    } else if (isEmployee) {
      actions.push({
        text: t("Change Status"),
        icon: <RiEditLine size={16} className="text-primary-500" />,
        onClick: () => handleOpenStatusModal(task),
      });
    }

    if (canDeleteTask) {
      actions.push({
        text: t("Delete"),
        icon: <RiDeleteBinLine size={16} className="text-red-500" />,
        onClick: () => handleDeleteConfirmation(task),
      });
    }

    actions.push({
      text: t("Add to Agenda"),
      icon: <RiCalendarCheckLine size={16} className="text-purple-500" />,
      onClick: () => {
        setTaskForAppointment(task);
        setIsAppointmentModalOpen(true);
      },
    });

    return <StatusActions states={actions} />;
  };

  const taskRowTable = useMemo(() => {
    if (activeView !== "table") return [];
    return filteredTasks.map((task) => [
      <NameAndDescription
        key={`name-${task._id}`}
        path={taskDetailsPath(task)}
        name={task.title}
        description={task.description}
      />,
      ...(!isEmployee
        ? [
            <p
              title={task.project?.name}
              key={`project-${task._id}`}
              className="text-sm text-cell-secondary truncate max-w-[100px]"
            >
              {task.project?.name || t("No Project")}
            </p>,
            <p
              title={task.department?.name}
              key={`dept-${task._id}`}
              className="text-sm text-cell-secondary truncate max-w-[120px]"
            >
              {task.department?.name || t("No Department")}
            </p>,
            <div
              key={`assignee-${task._id}`}
              className="flex items-center gap-1.5 max-w-[120px]"
              title={task.assignee?.name || t("Unassigned")}
            >
              <img
                className="w-7 h-7 rounded-full shrink-0 object-cover"
                src={
                  task.assignee?.imageProfile ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee?.name || "U")}&size=28`
                }
                alt=""
              />
              <span className="text-xs text-cell-primary truncate">
                {task.assignee?.name || t("Unassigned")}
              </span>
            </div>,
            <div
              key={`creator-${task._id}`}
              className="flex items-center gap-1.5 max-w-[120px]"
              title={task.creator?.name || t("Unknown")}
            >
              <img
                className="w-7 h-7 rounded-full shrink-0 object-cover"
                src={
                  task.creator?.imageProfile ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(task.creator?.name || "C")}&size=28`
                }
                alt=""
              />
              <span className="text-xs text-cell-primary truncate">
                {task.creator?.name || t("Unknown")}
              </span>
            </div>,
          ]
        : []),
      <Priority key={`priority-${task._id}`} type={task.priority} />,
      <Status key={`status-${task._id}`} type={task.status} />,
      <div key={`progress-${task._id}`} className="flex items-center gap-2">
        <div className="flex-1 bg-status-bg border border-status-border rounded-full h-1.5 min-w-[60px]">
          <div
            className="bg-primary-500 h-1.5 rounded-full"
            style={{ width: `${task.progress || 0}%` }}
          ></div>
        </div>
        <span className="text-xs font-medium text-cell-secondary">
          {task.progress || 0}%
        </span>
      </div>,
      <div key={`rating-${task._id}`} className="flex items-center">
        {task.rate > 0 ? (
          <StarRating rating={Math.round(task.rate * 10) / 10} />
        ) : (
          <span className="text-xs text-cell-secondary italic opacity-60">
            {t("No rating yet")}
          </span>
        )}
      </div>,
      <p
        key={`due-date-${task._id}`}
        className="text-sm text-cell-secondary text-nowrap"
      >
        {task.due_date ? translateDate(task.due_date) : "-"}
      </p>,
    ]);
  }, [filteredTasks, t, isEmployee, activeView]);

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
        {...(canCreateTask
          ? {
              isBtn: true,
              btnOnClick: handleCreateTask,
              btnTitle: t("Create a Task"),
            }
          : {})}
        otherHeaderActions={
          <ViewToggle activeView={activeView} onChange={handleViewChange} />
        }
      >
        <div className="flex flex-col gap-6">
          {canViewWorkload && <WorkloadPanel />}
          <div className="rounded-xl border border-status-border bg-surface p-4">
            <h2 className="mb-3 font-semibold text-cell-primary">{t("Search and saved filters")}</h2>
            <div className="flex flex-wrap gap-2">
              <input aria-label={t("Search tasks")} value={taskFilters.search} onChange={(event) => setTaskFilters((current) => ({ ...current, search: event.target.value.slice(0, 100) }))} placeholder={t("Search tasks")} className="min-w-44 flex-1 rounded-lg border border-status-border bg-surface px-3 py-2 text-sm" />
              <select aria-label={t("Task status")} value={taskFilters.status} onChange={(event) => setTaskFilters((current) => ({ ...current, status: event.target.value }))} className="rounded-lg border border-status-border bg-surface px-3 py-2 text-sm"><option value="">{t("All statuses")}</option>{allStatuses.map((status) => <option key={status} value={status}>{t(status)}</option>)}</select>
              <select aria-label={t("Task priority")} value={taskFilters.priority} onChange={(event) => setTaskFilters((current) => ({ ...current, priority: event.target.value }))} className="rounded-lg border border-status-border bg-surface px-3 py-2 text-sm"><option value="">{t("All priorities")}</option>{["low", "medium", "high", "urgent"].map((priority) => <option key={priority} value={priority}>{t(priority)}</option>)}</select>
              <button type="button" onClick={shareTaskFilter} className="rounded-lg border border-primary-500 px-3 py-2 text-sm text-primary-600">{t("Share filter")}</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <input aria-label={t("Filter name")} value={filterName} onChange={(event) => setFilterName(event.target.value)} placeholder={t("Filter name")} className="min-w-40 rounded-lg border border-status-border bg-surface px-3 py-2 text-sm" />
              <button type="button" disabled={!filterName.trim()} onClick={saveTaskFilter} className="rounded-lg bg-primary-500 px-3 py-2 text-sm text-white disabled:opacity-50">{t("Save filter")}</button>
              {savedTaskFilters.map((saved) => <span key={saved._id} className="inline-flex items-center rounded-lg border border-status-border"><button type="button" onClick={() => setTaskFilters({ search: saved.search || "", status: saved.status || "", priority: saved.priority || "" })} className="px-2 py-1 text-sm text-cell-primary">{saved.name}</button><button type="button" aria-label={`${t("Delete filter")}: ${saved.name}`} onClick={() => deleteSavedTaskFilter(saved._id)} className="px-2 text-red-600">×</button></span>)}
            </div>
          </div>
          <div className="flex flex-col gap-2 h-full">
            {activeView === "kanban" && hasMoreTasks && <p role="status" className="text-sm text-cell-secondary">{i18n.language?.startsWith("ar") ? "تعرض اللوحة المهام المحملة فقط. حمّل المزيد لاستكمال النتائج وأعداد الأعمدة." : "The board shows loaded tasks only. Load more to complete results and column counts."}</p>}
            {isLoading ? (
              <div className="text-center py-6">{t("Loading tasks...")}</div>
            ) : activeView === "kanban" ? (
              <KanbanBoard
                tasks={filteredTasks}
                onStatusChange={handleKanbanStatusChange}
                allowedColumns={kanbanColumns}
              />
            ) : (
              <Table
                className="custom-class"
                title={t("All Tasks")}
                headers={headers}
                rows={taskRowTable}
                hideSearchInput={true}
                showExport={!hasMoreTasks && !isFetchingTasks}
                isCheckInput={true}
                customActions={customActions}
                showStatusFilter={false}
                statusOptions={taskStatusOptions}
                exportFileName="tasks-table"
                isActions={false}
                onRowClick={(index) => {
                  const path = taskDetailsPath(filteredTasks[index]);
                  if (path) router.push(path);
                }}
              />
            )}
            {hasMoreTasks && <button type="button" disabled={isFetchingTasks} onClick={() => setFetchPage((page) => page + 1)} className="mt-3 rounded-lg border border-primary-500 px-4 py-2 text-primary-600 disabled:opacity-50">{isFetchingTasks ? t("Loading tasks...") : (i18n.language?.startsWith("ar") ? "تحميل المزيد من المهام" : "Load more tasks")}</button>}
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

      <Modal
        isOpen={isOpenStatusModal}
        onClose={() => setIsOpenStatusModal(false)}
        title={t("Update Task Status")}
        className="w-11/12 md:w-1/3 p-4"
      >
        <div className="flex flex-col gap-2 p-4">
          {availableTaskStatuses(taskToUpdateStatus?.status, canEditTask).filter((status) => allowedStatuses.includes(status) && (status !== "done" || !isEmployee || canEvaluateTask)).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusUpdate(status)}
              className="flex items-center justify-between p-3 rounded-xl border border-status-border bg-surface hover:bg-status-bg transition-all"
            >
              <Status type={status} />
            </button>
          ))}
        </div>
      </Modal>

      <EvaluationModal
        isOpen={isOpenEvaluationModal}
        onClose={() => {
          setIsOpenEvaluationModal(false);
          setTaskToUpdateStatus(null);
        }}
        onSubmit={(payload) => handleStatusUpdate("done", payload)}
        type="task"
        hasStages={
          taskToUpdateStatus?.stages && taskToUpdateStatus.stages.length > 0
        }
        isSubmitting={false}
        uploadFile={handleUploadFile}
      />

      <CreateAppointmentFromTaskModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setTaskForAppointment(null);
        }}
        task={taskForAppointment}
        onCreated={() => {
          setApiResponse({
            isOpen: true,
            status: "success",
            message: t("Appointment created successfully"),
          });
        }}
      />
    </>
  );
}

export default TasksPage;
