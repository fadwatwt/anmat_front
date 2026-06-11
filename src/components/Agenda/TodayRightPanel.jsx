"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetDailyTasksQuery,
  useGetTodayAppointmentsQuery,
  useCompleteDailyTaskMutation,
  useDeleteDailyTaskMutation,
  useCreateDailyTaskMutation,
  useCompleteAppointmentMutation,
  useDeleteAppointmentMutation,
} from "@/redux/appointments/appointmentsApi";
import {
  RiStarFill,
  RiCheckboxCircleLine,
  RiCheckLine,
  RiAddLine,
  RiDeleteBinLine,
  RiStickyNoteLine,
  RiAlertLine,
  RiBellLine,
  RiTimeLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import { format } from "date-fns";

const PRIORITY_COLORS = {
  urgent: { dot: "bg-red-500",    text: "text-red-600 dark:text-red-400",       badge: "bg-red-100 dark:bg-red-900/30" },
  high:   { dot: "bg-orange-500", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-100 dark:bg-orange-900/30" },
  medium: { dot: "bg-blue-500",   text: "text-blue-600 dark:text-blue-400",     badge: "bg-blue-100 dark:bg-blue-900/30" },
  low:    { dot: "bg-gray-400",   text: "text-gray-500 dark:text-gray-400",     badge: "bg-gray-100 dark:bg-gray-700" },
};

const REMINDER_LABELS = {
  "5_min":  { ar: "قبل ٥ د",    en: "5m before" },
  "15_min": { ar: "قبل ١٥ د",   en: "15m before" },
  "1_hour": { ar: "قبل ساعة",   en: "1h before" },
  "1_day":  { ar: "قبل يوم",    en: "1d before" },
  "1_week": { ar: "قبل أسبوع",  en: "1w before" },
};

/* ── sub-components ── */

function PriorityItem({ task, onComplete, onDelete }) {
  const { t } = useTranslation();
  const cfg = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  const done = task.status === "completed";
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border border-gray-100 dark:border-gray-700 group ${done ? "opacity-50" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <span className={`flex-1 text-sm min-w-0 truncate ${done ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
        {task.title}
      </span>
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!done && (
          <button onClick={() => onComplete(task._id)} className="p-0.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded" title={t("Complete")}>
            <RiCheckLine size={14} />
          </button>
        )}
        <button onClick={() => onDelete(task._id)} className="p-0.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title={t("Delete")}>
          <RiDeleteBinLine size={14} />
        </button>
      </div>
    </div>
  );
}

function TaskItem({ task, onComplete, onDelete }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const done = task.status === "completed";
  const cfg  = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  const hasDetails = task.description || task.notes;

  return (
    <div className={`rounded-lg border border-gray-100 dark:border-gray-700 ${done ? "opacity-50" : ""}`}>
      <div className={`flex items-center gap-2 p-2 group ${done ? "" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"} rounded-lg`}>
        {/* complete */}
        <button
          onClick={() => !done && onComplete(task._id)}
          className={`flex-shrink-0 ${done ? "text-green-500" : "text-gray-300 dark:text-gray-600 hover:text-green-500 transition-colors"}`}
          title={t("Complete")}
        >
          <RiCheckboxCircleLine size={18} />
        </button>

        {/* title — click to expand if has details */}
        <span
          onClick={() => hasDetails && setExpanded((v) => !v)}
          className={`flex-1 text-sm min-w-0 truncate ${
            done ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"
          } ${hasDetails ? "cursor-pointer hover:text-primary-600 dark:hover:text-primary-400" : ""}`}
        >
          {task.title}
        </span>

        {/* priority badge */}
        {task.priority && (
          <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${cfg.badge} ${cfg.text}`}>
            {(task.priority === "urgent" || task.priority === "high") && (
              <RiAlertLine size={10} className="inline mr-0.5" />
            )}
            {task.priority}
          </span>
        )}

        {/* actions — visible on hover */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {hasDetails && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-0.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
              title={expanded ? t("Hide details") : t("View details")}
            >
              <RiArrowDownSLine size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
          {!done && (
            <button
              onClick={() => onDelete(task._id)}
              className="p-0.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
              title={t("Delete")}
            >
              <RiDeleteBinLine size={14} />
            </button>
          )}
        </div>
      </div>

      {/* expanded details */}
      {expanded && hasDetails && (
        <div className="px-3 pb-3 pt-1 space-y-1 border-t border-gray-100 dark:border-gray-700">
          {task.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400">{task.description}</p>
          )}
          {task.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded px-2 py-1">
              {task.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ReminderItem({ reminder, onComplete, onDelete, isArabic }) {
  const { t } = useTranslation();
  const done = reminder.status === "completed";
  const firstType = reminder.reminder_types?.[0];
  const typeLabel = firstType
    ? (isArabic ? REMINDER_LABELS[firstType]?.ar : REMINDER_LABELS[firstType]?.en) || firstType
    : null;

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? (isArabic ? "م" : "PM") : (isArabic ? "ص" : "AM");
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${display}:${String(m).padStart(2, "0")} ${period}`;
  };

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border border-amber-100 dark:border-amber-900/40 group ${done ? "opacity-50" : "hover:bg-amber-50 dark:hover:bg-amber-900/10"}`}>
      <RiBellLine size={14} className={done ? "text-gray-400" : "text-amber-500 flex-shrink-0"} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${done ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
          {reminder.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {reminder.start_time && (
            <span className="flex items-center gap-0.5 text-xs text-amber-600 dark:text-amber-400">
              <RiTimeLine size={10} />
              {formatTime(reminder.start_time)}
            </span>
          )}
          {typeLabel && (
            <span className="text-xs text-gray-400 dark:text-gray-500">{typeLabel}</span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!done && (
          <button onClick={() => onComplete(reminder._id)} className="p-0.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded" title={t("Complete")}>
            <RiCheckLine size={14} />
          </button>
        )}
        <button onClick={() => onDelete(reminder._id)} className="p-0.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title={t("Delete")}>
          <RiDeleteBinLine size={14} />
        </button>
      </div>
    </div>
  );
}

function QuickAddInput({ onAdd, placeholder }) {
  const [value, setValue] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) { onAdd(value.trim()); setValue(""); }
  };
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
      <button type="submit" disabled={!value.trim()}
        className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-40 rounded-lg transition-colors">
        <RiAddLine size={16} />
      </button>
    </form>
  );
}

/* ── main panel ── */

function TodayRightPanel({ onOpenCreateModal }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: todayTasks = [],        isLoading: loadingTasks }   = useGetDailyTasksQuery({ date: today });
  const { data: todayAppointments = [], isLoading: loadingAppts }   = useGetTodayAppointmentsQuery();

  const [completeTask]        = useCompleteDailyTaskMutation();
  const [deleteTask]          = useDeleteDailyTaskMutation();
  const [createTask]          = useCreateDailyTaskMutation();
  const [completeAppointment] = useCompleteAppointmentMutation();
  const [deleteAppointment]   = useDeleteAppointmentMutation();

  const [notesText,  setNotesText]  = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  /* derived */
  const priorityTasks  = todayTasks.filter((t) => t.priority === "urgent" || t.priority === "high").slice(0, 3);
  const regularTasks   = todayTasks.filter((t) => t.priority !== "urgent" && t.priority !== "high");
  const todayReminders = todayAppointments
    .filter((a) => a.category === "reminder")
    .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));

  /* handlers */
  const handleCompleteTask   = async (id) => { try { await completeTask(id).unwrap(); } catch {} };
  const handleDeleteTask     = async (id) => { try { await deleteTask(id).unwrap();   } catch {} };
  const handleCompleteReminder = async (id) => { try { await completeAppointment(id).unwrap(); } catch {} };
  const handleDeleteReminder   = async (id) => { try { await deleteAppointment(id).unwrap();   } catch {} };

  const handleQuickAddPriority = async (title) => {
    try { await createTask({ title, date: today, priority: "high",   category: "other", is_personal: true }).unwrap(); } catch {}
  };
  const handleQuickAddTask = async (title) => {
    try { await createTask({ title, date: today, priority: "medium", category: "other", is_personal: true }).unwrap(); } catch {}
  };
  const handleSaveNotes = async () => {
    if (!notesText.trim()) return;
    try {
      await createTask({ title: isArabic ? "ملاحظات اليوم" : "Today's Notes", notes: notesText, date: today, priority: "low", category: "other", is_personal: true }).unwrap();
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch {}
  };

  const isLoading = loadingTasks || loadingAppts;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {/* ── Priorities ── */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <RiStarFill size={16} className="text-amber-500" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t("My Priorities")}</h4>
          <span className="text-xs text-gray-400 dark:text-gray-500">{priorityTasks.length}/3</span>
        </div>
        {priorityTasks.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">{t("No priorities set for today")}</p>
        ) : (
          <div className="space-y-1">
            {priorityTasks.map((task) => (
              <PriorityItem key={task._id} task={task} onComplete={handleCompleteTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        )}
        {priorityTasks.length < 3 && (
          <QuickAddInput onAdd={handleQuickAddPriority} placeholder={t("Add priority...")} />
        )}
      </div>

      {/* ── Today's Tasks ── */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RiCheckboxCircleLine size={16} className="text-primary-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t("Today's Tasks")}</h4>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {regularTasks.filter((t) => t.status !== "completed").length}/{regularTasks.length}
            </span>
          </div>
          <button onClick={() => onOpenCreateModal?.("task")}
            className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors" title={t("Add task")}>
            <RiAddLine size={16} />
          </button>
        </div>
        {regularTasks.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">{t("No tasks for today")}</p>
        ) : (
          <div className="space-y-1">
            {regularTasks.filter((t) => t.status !== "completed").map((task) => (
              <TaskItem key={task._id} task={task} onComplete={handleCompleteTask} onDelete={handleDeleteTask} />
            ))}
            {regularTasks.filter((t) => t.status === "completed").length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                  {t("Completed")} ({regularTasks.filter((t) => t.status === "completed").length})
                </p>
                {regularTasks.filter((t) => t.status === "completed").map((task) => (
                  <TaskItem key={task._id} task={task} onComplete={handleCompleteTask} onDelete={handleDeleteTask} />
                ))}
              </div>
            )}
          </div>
        )}
        <QuickAddInput onAdd={handleQuickAddTask} placeholder={t("Add task...")} />
      </div>

      {/* ── Reminders ── */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RiBellLine size={16} className="text-amber-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t("Reminders")}</h4>
            {todayReminders.length > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">{todayReminders.length}</span>
            )}
          </div>
          <button onClick={() => onOpenCreateModal?.("reminder")}
            className="p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors"
            title={isArabic ? "إضافة تذكير" : "Add reminder"}>
            <RiAddLine size={16} />
          </button>
        </div>

        {todayReminders.length === 0 ? (
          <div className="text-center py-3">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
              {isArabic ? "لا توجد تذكيرات اليوم" : "No reminders today"}
            </p>
            <button
              onClick={() => onOpenCreateModal?.("reminder")}
              className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline"
            >
              <RiAddLine size={12} />
              {isArabic ? "إضافة تذكير" : "Add a reminder"}
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {todayReminders.map((reminder) => (
              <ReminderItem
                key={reminder._id}
                reminder={reminder}
                onComplete={handleCompleteReminder}
                onDelete={handleDeleteReminder}
                isArabic={isArabic}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Today's Notes ── */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <RiStickyNoteLine size={16} className="text-purple-500" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t("Today's Notes")}</h4>
        </div>
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          rows={4}
          placeholder={isArabic ? "اكتب ملاحظاتك لهذا اليوم..." : "Write your notes for today..."}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
        />
        <div className="flex items-center justify-end mt-2">
          <button onClick={handleSaveNotes} disabled={!notesText.trim()}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              notesSaved ? "bg-green-500 text-white" : "bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-40"
            }`}>
            {notesSaved ? t("Saved!") : t("Save Note")}
          </button>
        </div>
      </div>

    </div>
  );
}

export default TodayRightPanel;
