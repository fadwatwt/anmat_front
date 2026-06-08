"use client";

import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  useCompleteDailyTaskMutation,
  useDeleteDailyTaskMutation,
  useAddDailyTaskNotesMutation,
} from "@/redux/appointments/appointmentsApi";
import {
  RiCheckboxCircleLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiStickyNoteLine,
  RiEditLine,
  RiCalendarLine,
} from "react-icons/ri";
import { useState } from "react";

const PRIORITY_CONFIG = {
  low: { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-400", dot: "bg-gray-400" },
  medium: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  high: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500" },
  urgent: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
};

const CATEGORY_LABELS = {
  follow_up: "متابعة",
  review: "مراجعة",
  analysis: "تحليل",
  design: "تصميم",
  coding: "برمجة",
  testing: "اختبار",
  documentation: "توثيق",
  communication: "تواصل",
  other: "أخرى",
};

function DailyTaskCard({ task, size = "md", onUpdate }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(task.notes || "");

  const [completeTask] = useCompleteDailyTaskMutation();
  const [deleteTask] = useDeleteDailyTaskMutation();
  const [addNotes] = useAddDailyTaskNotesMutation();

  const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isSmall = size === "sm";
  const isCompleted = task.status === "completed";

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd MMM", { locale: ar });
    } catch {
      return dateStr;
    }
  };

  const handleComplete = async () => {
    try {
      await completeTask(task._id).unwrap();
      onUpdate?.();
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id).unwrap();
      onUpdate?.();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await addNotes({ id: task._id, notes: noteText }).unwrap();
      setShowNotes(false);
      onUpdate?.();
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md ${
        isSmall ? "p-3" : "p-4"
      } ${isCompleted ? "opacity-60" : ""}`}
      style={{ borderRight: `4px solid ${task.color || "#22C55E"}` }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleComplete}
          className={`mt-0.5 flex-shrink-0 ${
            isCompleted
              ? "text-green-500"
              : "text-gray-400 hover:text-green-500 transition-colors"
          }`}
        >
          {isCompleted ? <RiCheckLine size={20} /> : <RiCheckboxCircleLine size={20} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-medium ${
                isCompleted ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"
              } ${isSmall ? "text-sm" : "text-base"}`}
            >
              {task.title}
            </h3>
            <span className={`text-xs px-1.5 py-0.5 rounded ${priorityConfig.bg} ${priorityConfig.text}`}>
              {isArabic ? (task.priority === "low" ? "منخفضة" : task.priority === "medium" ? "متوسطة" : task.priority === "high" ? "عالية" : "عاجلة") : task.priority}
            </span>
          </div>

          {task.description && !isSmall && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
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

          {!isSmall && task.notes && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs text-gray-600 dark:text-gray-400">
              {task.notes}
            </div>
          )}
        </div>

        {!isSmall && !isCompleted && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              title={t("Add Note")}
            >
              <RiStickyNoteLine size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title={t("Delete")}
            >
              <RiDeleteBinLine size={16} />
            </button>
          </div>
        )}
      </div>

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
            <button
              onClick={handleSaveNotes}
              className="px-3 py-1 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              {t("Save")}
            </button>
            <button
              onClick={() => setShowNotes(false)}
              className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyTaskCard;
