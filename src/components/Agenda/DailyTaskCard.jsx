"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  useCompleteDailyTaskMutation,
  useDeleteDailyTaskMutation,
  useUpdateDailyTaskMutation,
  useAddDailyTaskNotesMutation,
} from "@/redux/appointments/appointmentsApi";
import {
  RiCheckboxCircleLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiStickyNoteLine,
  RiEditLine,
  RiCalendarLine,
  RiCloseLine,
  RiSaveLine,
} from "react-icons/ri";

const PRIORITY_CONFIG = {
  low:    { bg: "bg-gray-100 dark:bg-gray-700",           text: "text-gray-600 dark:text-gray-400",    dot: "bg-gray-400" },
  medium: { bg: "bg-blue-100 dark:bg-blue-900/30",        text: "text-blue-600 dark:text-blue-400",    dot: "bg-blue-500" },
  high:   { bg: "bg-orange-100 dark:bg-orange-900/30",    text: "text-orange-600 dark:text-orange-400",dot: "bg-orange-500" },
  urgent: { bg: "bg-red-100 dark:bg-red-900/30",          text: "text-red-600 dark:text-red-400",      dot: "bg-red-500" },
};

const PRIORITY_LABELS_AR = { low: "منخفضة", medium: "متوسطة", high: "عالية", urgent: "عاجلة" };

const CATEGORY_LABELS = {
  follow_up: "متابعة", review: "مراجعة", analysis: "تحليل",
  design: "تصميم", coding: "برمجة", testing: "اختبار",
  documentation: "توثيق", communication: "تواصل", other: "أخرى",
};

const INPUT_CLS = "w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white";

function DailyTaskCard({ task, size = "md", onUpdate }) {
  const { t, i18n } = useTranslation();
  const isArabic  = i18n.language === "ar";
  const isSmall   = size === "sm";
  const isCompleted = task.status === "completed";

  const [showNotes, setShowNotes] = useState(false);
  const [noteText,  setNoteText]  = useState(task.notes || "");
  const [editing,   setEditing]   = useState(false);
  const [editData,  setEditData]  = useState({
    title:       task.title,
    priority:    task.priority || "medium",
    description: task.description || "",
    date:        task.date ? task.date.substring(0, 10) : "",
  });

  const [completeTask] = useCompleteDailyTaskMutation();
  const [deleteTask]   = useDeleteDailyTaskMutation();
  const [updateTask]   = useUpdateDailyTaskMutation();
  const [addNotes]     = useAddDailyTaskNotesMutation();

  const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const formatDate = (dateStr) => {
    try { return format(new Date(dateStr), "dd MMM", { locale: ar }); }
    catch { return dateStr; }
  };

  const handleComplete = async () => {
    try { await completeTask(task._id).unwrap(); onUpdate?.(); } catch {}
  };

  const handleDelete = async () => {
    try { await deleteTask(task._id).unwrap(); onUpdate?.(); } catch {}
  };

  const handleSaveNotes = async () => {
    try {
      await addNotes({ id: task._id, notes: noteText }).unwrap();
      setShowNotes(false); onUpdate?.();
    } catch {}
  };

  const handleSaveEdit = async () => {
    if (!editData.title.trim()) return;
    try {
      await updateTask({ id: task._id, ...editData }).unwrap();
      setEditing(false); onUpdate?.();
    } catch {}
  };

  const handleCancelEdit = () => {
    setEditData({
      title:       task.title,
      priority:    task.priority || "medium",
      description: task.description || "",
      date:        task.date ? task.date.substring(0, 10) : "",
    });
    setEditing(false);
  };

  /* ── Edit mode ── */
  if (editing) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-700 ${isSmall ? "p-3" : "p-4"} space-y-3`}
        style={{ borderRight: `4px solid ${task.color || "#22C55E"}` }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{t("Edit Task")}</span>
          <button onClick={handleCancelEdit} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <RiCloseLine size={16} />
          </button>
        </div>

        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))}
          className={INPUT_CLS}
          placeholder={t("Task title")}
          autoFocus
        />

        {!isSmall && (
          <textarea
            value={editData.description}
            onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))}
            rows={2}
            className={INPUT_CLS}
            placeholder={t("Description")}
          />
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t("Date")}</label>
            <input
              type="date"
              value={editData.date}
              onChange={(e) => setEditData((p) => ({ ...p, date: e.target.value }))}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t("Priority")}</label>
            <select
              value={editData.priority}
              onChange={(e) => setEditData((p) => ({ ...p, priority: e.target.value }))}
              className={INPUT_CLS}
            >
              <option value="low">{t("Low")}</option>
              <option value="medium">{t("Medium")}</option>
              <option value="high">{t("High")}</option>
              <option value="urgent">{t("Urgent")}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleSaveEdit}
            disabled={!editData.title.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-40 rounded-lg transition-colors"
          >
            <RiSaveLine size={14} />
            {t("Save")}
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
    );
  }

  /* ── Normal mode ── */
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md group ${
        isSmall ? "p-3" : "p-4"
      } ${isCompleted ? "opacity-60" : ""}`}
      style={{ borderRight: `4px solid ${task.color || "#22C55E"}` }}
    >
      <div className="flex items-start gap-3">
        {/* complete toggle */}
        <button
          onClick={handleComplete}
          className={`mt-0.5 flex-shrink-0 ${isCompleted ? "text-green-500" : "text-gray-400 hover:text-green-500 transition-colors"}`}
          title={t("Complete")}
        >
          {isCompleted ? <RiCheckLine size={20} /> : <RiCheckboxCircleLine size={20} />}
        </button>

        {/* body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium ${isCompleted ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"} ${isSmall ? "text-sm" : "text-base"}`}>
              {task.title}
            </h3>
            <span className={`text-xs px-1.5 py-0.5 rounded ${priorityConfig.bg} ${priorityConfig.text}`}>
              {isArabic ? PRIORITY_LABELS_AR[task.priority] ?? task.priority : task.priority}
            </span>
          </div>

          {task.description && !isSmall && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <RiCalendarLine size={12} />
              {formatDate(task.date)}
            </span>
            {!isSmall && (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isArabic ? CATEGORY_LABELS[task.category] || task.category : task.category}
                </span>
                {task.is_personal && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {t("Personal")}
                  </span>
                )}
              </>
            )}
          </div>

          {!isSmall && task.notes && !showNotes && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs text-gray-600 dark:text-gray-400">
              {task.notes}
            </div>
          )}
        </div>

        {/* ── Action buttons — always visible on hover, regardless of size ── */}
        {!isCompleted && (
          <div className={`flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`}>
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              title={t("Edit")}
            >
              <RiEditLine size={isSmall ? 14 : 16} />
            </button>
            <button
              onClick={() => { setShowNotes(!showNotes); setEditing(false); }}
              className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              title={t("Add Note")}
            >
              <RiStickyNoteLine size={isSmall ? 14 : 16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title={t("Delete")}
            >
              <RiDeleteBinLine size={isSmall ? 14 : 16} />
            </button>
          </div>
        )}
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder={t("Add a note...")}
          />
          <div className="flex items-center gap-2 mt-2">
            <button onClick={handleSaveNotes} className="px-3 py-1 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors">
              {t("Save")}
            </button>
            <button onClick={() => setShowNotes(false)} className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {t("Cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyTaskCard;
