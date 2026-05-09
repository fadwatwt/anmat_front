"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { convertToSlug } from "@/functions/AnotherFunctions";
import { translateDate } from "@/functions/Days";
import { RiEyeLine, RiEditLine } from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { useGetEmployeeTasksQuery, useUpdateTaskStatusMutation } from "@/redux/tasks/employeeTasksApi";
import Modal from "@/components/Modal/Modal.jsx";
import EvaluationModal from "@/components/Modal/EvaluationModal";
import StarRating from "@/components/StarRating";
import { useProcessing } from "@/app/providers";

const NameAndDescription = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription"), { ssr: false });
const Priority = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/Priority"), { ssr: false });
const Status = dynamic(() => import("@/app/(dashboard)/projects/_components/TableInfo/Status"), { ssr: false });
const ApiResponseAlert = dynamic(() => import("@/components/Alerts/ApiResponseAlert"), { ssr: false });

function MyTasksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { showProcessing, hideProcessing } = useProcessing();

  const { data: tasks = [], isLoading, isError } = useGetEmployeeTasksQuery();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const [isOpenStatusModal, setIsOpenStatusModal] = useState(false);
  const [taskToUpdateStatus, setTaskToUpdateStatus] = useState(null);
  const [isOpenEvaluationModal, setIsOpenEvaluationModal] = useState(false);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const allowedStatuses = ['open', 'pending', 'in-progress', 'completed', 'done', 'rejected', 'cancelled'];

  const headers = [
    { label: t("Tasks"), width: "250px" },
    { label: t("Priority"), width: "100px" },
    { label: t("Status"), width: "100px" },
    { label: t("Progress"), width: "120px" },
    { label: t("Rating"), width: "120px" },
    { label: t("Due Date"), width: "120px" },
    { label: "", width: "50px" },
  ];

  const handleOpenStatusModal = (task) => {
    setTaskToUpdateStatus(task);
    setIsOpenStatusModal(true);
  };

  const handleStatusUpdate = async (status, evaluationPayload = null) => {
    if (status === 'done' && !evaluationPayload) {
      setIsOpenStatusModal(false);
      setIsOpenEvaluationModal(true);
      return;
    }

    if (taskToUpdateStatus) {
      showProcessing(t("Updating status..."));
      try {
        const payload = { id: taskToUpdateStatus._id, status };
        if (evaluationPayload) Object.assign(payload, evaluationPayload);
        const res = await updateTaskStatus(payload).unwrap();
        setApiResponse({ isOpen: true, status: "success", message: res?.message || t("Status updated successfully") });
        setIsOpenStatusModal(false);
        setIsOpenEvaluationModal(false);
        setTaskToUpdateStatus(null);
      } catch (err) {
        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || t("Failed to update status") });
      } finally {
        hideProcessing();
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
        onClick: () => router.push(`/tasks/${task._id}-${convertToSlug(task.title)}/details`),
      },
      {
        text: t("Change Status"),
        icon: <RiEditLine size={16} className="text-primary-500" />,
        onClick: () => handleOpenStatusModal(task),
      },
    ];

    return <StatusActions states={actions} />;
  };

  const taskRowTable = useMemo(() => {
    return tasks.map((task) => [
      <NameAndDescription
        key={`name-${task._id}`}
        name={task.title}
        description={task.description}
      />,
      <Priority key={`priority-${task._id}`} type={task.priority} />,
      <Status key={`status-${task._id}`} type={task.status} />,
      <div key={`progress-${task._id}`} className="flex items-center gap-2">
        <div className="flex-1 bg-status-bg border border-status-border rounded-full h-1.5 min-w-[60px]">
          <div
            className="bg-primary-500 h-1.5 rounded-full"
            style={{ width: `${task.progress || 0}%` }}
          />
        </div>
        <span className="text-xs font-medium text-cell-secondary">{task.progress || 0}%</span>
      </div>,
      <div key={`rating-${task._id}`} className="flex items-center">
        {task.ratings?.length > 0 ? (
          <StarRating rating={task.ratings.reduce((acc, r) => acc + (r.score || 0), 0) / task.ratings.length} />
        ) : (
          <span className="text-xs text-cell-secondary italic opacity-60">{t("No rating yet")}</span>
        )}
      </div>,
      <p key={`due-date-${task._id}`} className="text-sm text-cell-secondary text-nowrap">
        {task.due_date ? translateDate(task.due_date) : "-"}
      </p>,
    ]);
  }, [tasks, t]);

  if (isError) {
    return (
      <Page title={t("My Tasks")}>
        <div className="text-center text-red-500 mt-8">
          {t("Failed to load tasks. Please try again later.")}
        </div>
      </Page>
    );
  }

  return (
    <>
      <Page title={t("My Tasks")}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 h-full">
            {isLoading ? (
              <div className="text-center py-6">{t("Loading tasks...")}</div>
            ) : (
              <Table
                title={t("My Tasks")}
                headers={headers}
                rows={taskRowTable}
                isCheckInput={false}
                customActions={customActions}
                showStatusFilter={true}
                isActions={false}
              />
            )}
          </div>
        </div>
      </Page>

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
          {allowedStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusUpdate(status)}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
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
        onSubmit={(payload) => handleStatusUpdate('done', payload)}
        type="task"
        hasStages={taskToUpdateStatus?.stages && taskToUpdateStatus.stages.length > 0}
        isSubmitting={false}
      />
    </>
  );
}

export default MyTasksPage;
