"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateDailyTaskMutation } from "@/redux/appointments/appointmentsApi";
import { RiCloseLine, RiCalendarCheckLine } from "react-icons/ri";
import { format } from "date-fns";
import toast from "react-hot-toast";

function AddToAgendaModal({ isOpen, onClose, task }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);
  const [priority, setPriority] = useState(task?.priority || "medium");

  const [createDailyTask, { isLoading }] = useCreateDailyTaskMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) return;

    try {
      await createDailyTask({
        title: task.title || task.name,
        description: task.description || "",
        date: selectedDate,
        priority,
        category: "other",
        is_personal: true,
        notes: isArabic
          ? `مرتبطة بالمهمة: ${task.title || task.name}`
          : `Linked to task: ${task.title || task.name}`,
      }).unwrap();

      toast.success(
        isArabic ? "تمت الإضافة إلى الأجندة" : "Added to agenda"
      );
      onClose();
    } catch {
      toast.error(
        isArabic ? "حدث خطأ، حاول مجدداً" : "Failed to add, please try again"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <RiCalendarCheckLine size={20} className="text-primary-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {isArabic ? "إضافة إلى الأجندة" : "Add to Agenda"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Task name preview */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {task?.title || task?.name}
            </p>
            {task?.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("Date")}
            </label>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("Priority")}
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="low">{t("Low")}</option>
              <option value="medium">{t("Medium")}</option>
              <option value="high">{t("High")}</option>
              <option value="urgent">{t("Urgent")}</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              {isLoading
                ? t("Adding...")
                : isArabic
                ? "إضافة للأجندة"
                : "Add to Agenda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddToAgendaModal;
