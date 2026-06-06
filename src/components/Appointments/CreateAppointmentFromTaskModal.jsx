"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCreateAppointmentMutation } from "@/redux/appointments/appointmentsApi";
import { RiCloseLine } from "react-icons/ri";
import { format, addDays } from "date-fns";

function CreateAppointmentFromTaskModal({ isOpen, onClose, task, onCreated }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    start_time: "09:00",
    end_time: "",
    category: "task",
    color: "#8B5CF6",
    reminder_types: ["1_day"],
    enable_reminders: true,
  });

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  useEffect(() => {
    if (task && isOpen) {
      const dueDate = task.due_date
        ? format(new Date(task.due_date), "yyyy-MM-dd")
        : format(addDays(new Date(), 1), "yyyy-MM-dd");

      setFormData({
        title: task.title,
        description: task.description || "",
        location: "",
        date: dueDate,
        start_time: "09:00",
        end_time: "",
        category: "task",
        color: "#8B5CF6",
        reminder_types: ["1_day"],
        enable_reminders: true,
      });
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReminderChange = (reminder) => {
    setFormData((prev) => {
      const reminders = prev.reminder_types.includes(reminder)
        ? prev.reminder_types.filter((r) => r !== reminder)
        : [...prev.reminder_types, reminder];
      return { ...prev, reminder_types: reminders };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAppointment({
        ...formData,
        task_id: task._id,
      }).unwrap();

      onCreated?.();
      onClose();
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {t("Create Appointment from Task")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              📋 {t("Linked Task")}: <strong>{task.title}</strong>
            </p>
            {task.priority && (
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                {t("Priority")}: {task.priority}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("Title")} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("Description")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("Location")}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={t("Enter location")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("Date")} *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("Start Time")} *
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("End Time")}
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("Color")}
              </label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("Reminders")}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "5_min", label: t("5 minutes before") },
                { value: "15_min", label: t("15 minutes before") },
                { value: "1_hour", label: t("1 hour before") },
                { value: "1_day", label: t("1 day before") },
                { value: "1_week", label: t("1 week before") },
              ].map((reminder) => (
                <label
                  key={reminder.value}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.reminder_types.includes(reminder.value)}
                    onChange={() => handleReminderChange(reminder.value)}
                    className="rounded text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {reminder.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? t("Creating...") : t("Create Appointment")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAppointmentFromTaskModal;
