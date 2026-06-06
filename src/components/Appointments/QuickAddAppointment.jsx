"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateAppointmentMutation } from "@/redux/appointments/appointmentsApi";
import { RiAddLine, RiCloseLine } from "react-icons/ri";
import { format } from "date-fns";

function QuickAddAppointment({ onSuccess }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return format(tomorrow, "yyyy-MM-dd");
  });
  const [time, setTime] = useState("09:00");
  const [category, setCategory] = useState("task");

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createAppointment({
        title: title.trim(),
        date,
        start_time: time,
        category,
        reminder_types: ["1_day"],
      }).unwrap();

      setTitle("");
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <RiAddLine size={20} />
        <span className="font-medium">{t("Quick Add")}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {t("Quick Add Appointment")}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <RiCloseLine size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-3 space-y-3">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("Appointment title...")}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="meeting">🤝 {t("Meeting")}</option>
            <option value="task">📋 {t("Task")}</option>
            <option value="project">📁 {t("Project")}</option>
            <option value="interview">🎤 {t("Interview")}</option>
            <option value="training">📚 {t("Training")}</option>
            <option value="deadline">⏰ {t("Deadline")}</option>
            <option value="other">📌 {t("Other")}</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          {isLoading ? t("Adding...") : t("Add Appointment")}
        </button>
      </form>
    </div>
  );
}

export default QuickAddAppointment;
