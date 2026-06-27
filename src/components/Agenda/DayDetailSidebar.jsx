"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  useGetAppointmentsQuery,
  useGetDailyTasksQuery,
  useCompleteAppointmentMutation,
  useCancelAppointmentMutation,
  useCompleteDailyTaskMutation,
} from "@/redux/appointments/appointmentsApi";
import {
  RiCalendarLine,
  RiTimeLine,
  RiMapPinLine,
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
  RiCheckboxCircleLine,
  RiTaskLine,
  RiArrowDownSLine,
} from "react-icons/ri";

const TimeBadge = ({ time }) => {
  if (!time) return null;
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "م" : "ص";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      {displayHour}:{minutes} {period}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const { t } = useTranslation();
  const config = {
    low: { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-400", label: t("Low") },
    medium: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", label: t("Medium") },
    high: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", label: t("High") },
    urgent: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", label: t("Urgent") },
  };
  const c = config[priority] || config.medium;
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}>{c.label}</span>
  );
};

function DailyTaskRow({ task, onComplete, t }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = task.description || task.notes;
  return (
    <div
      className={`rounded-lg border border-gray-100 dark:border-gray-700 transition-colors ${
        task.status === "completed"
          ? "bg-green-50 dark:bg-green-900/10 opacity-60"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`font-medium text-sm ${
                task.status === "completed"
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {task.title}
            </p>
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {hasDetails && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
              title={expanded ? t("Hide details") : t("View details")}
            >
              <RiArrowDownSLine size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
          {task.status !== "completed" && (
            <button
              onClick={() => onComplete(task._id)}
              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
              title={t("Complete")}
            >
              <RiCheckboxCircleLine size={14} />
            </button>
          )}
        </div>
      </div>
      {expanded && hasDetails && (
        <div className="px-3 pb-3 pt-1 space-y-1 border-t border-gray-100 dark:border-gray-700">
          {task.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400">{task.description}</p>
          )}
          {task.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded px-2 py-1">
              {task.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DayDetailSidebar({ selectedDate, onAddAppointment, onAddTask }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isArabic = i18n.language === "ar";

  const { data: appointments = [], isLoading: loadingAppointments } = useGetAppointmentsQuery(
    { date: selectedDate },
    { skip: !selectedDate }
  );
  const { data: dailyTasks = [], isLoading: loadingTasks } = useGetDailyTasksQuery(
    { date: selectedDate },
    { skip: !selectedDate }
  );

  const [completeAppointment] = useCompleteAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const [completeDailyTask] = useCompleteDailyTaskMutation();

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd MMMM, yyyy", { locale: ar });
    } catch {
      return dateStr;
    }
  };

  const handleCompleteAppointment = async (id) => {
    try {
      await completeAppointment(id).unwrap();
    } catch (error) {
      console.error("Failed to complete appointment:", error);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await cancelAppointment(id).unwrap();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await completeDailyTask(id).unwrap();
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  if (!selectedDate) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <RiCalendarLine size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">{t("Select a day to view details")}</p>
        </div>
      </div>
    );
  }

  const isLoading = loadingAppointments || loadingTasks;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {formatDate(selectedDate)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {appointments.length + dailyTasks.length} {t("items")}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddAppointment?.(selectedDate)}
            className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title={t("Add Appointment")}
          >
            <RiAddLine size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                <RiCalendarLine size={14} />
                {t("Appointments")} ({appointments.length})
              </h4>
              <div className="space-y-2">
                {appointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    style={{ borderRight: `3px solid ${apt.color || "#3B82F6"}` }}
                    onClick={() => router.push(`/appointments/${apt._id}`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {apt.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <TimeBadge time={apt.start_time} />
                          {apt.location && (
                            <span className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                              <RiMapPinLine size={10} />
                              <span className="truncate max-w-[100px]">{apt.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {apt.status === "upcoming" && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteAppointment(apt._id);
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                            title={t("Complete")}
                          >
                            <RiCheckLine size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelAppointment(apt._id);
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title={t("Cancel")}
                          >
                            <RiCloseLine size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dailyTasks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                <RiTaskLine size={14} />
                {t("Daily Tasks")} ({dailyTasks.length})
              </h4>
              <div className="space-y-2">
                {dailyTasks.map((task) => (
                  <DailyTaskRow key={task._id} task={task} onComplete={handleCompleteTask} t={t} />
                ))}
              </div>
            </div>
          )}

          {appointments.length === 0 && dailyTasks.length === 0 && (
            <div className="text-center py-6">
              <RiCalendarLine size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">{t("No items for this day")}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  onClick={() => onAddAppointment?.(selectedDate)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  <RiAddLine size={14} />
                  {t("Add Appointment")}
                </button>
                <button
                  onClick={() => onAddTask?.(selectedDate)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                >
                  <RiAddLine size={14} />
                  {t("Add Task")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DayDetailSidebar;
