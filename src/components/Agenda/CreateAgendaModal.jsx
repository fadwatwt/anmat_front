"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateAppointmentMutation,
  useCreateDailyTaskMutation,
} from "@/redux/appointments/appointmentsApi";
import { format } from "date-fns";
import { RiCloseLine } from "react-icons/ri";

function CreateAgendaModal({ isOpen, onClose, initialDate, initialTab }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(initialTab || "appointment");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: initialDate || format(new Date(), "yyyy-MM-dd"),
    start_time: "09:00",
    end_time: "",
    category: "task",
    color: "#3B82F6",
    is_all_day: false,
    enable_reminders: true,
    reminder_types: ["1_day"],
    recurrence_type: "none",
    task_id: "",
    priority: "medium",
    is_personal: true,
  });

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    date: initialDate || format(new Date(), "yyyy-MM-dd"),
    priority: "medium",
    category: "other",
    is_personal: true,
    color: "#22C55E",
    notes: "",
  });

  const [error, setError] = useState("");

  const [createAppointment, { isLoading: isCreatingAppointment }] =
    useCreateAppointmentMutation();
  const [createDailyTask, { isLoading: isCreatingDailyTask }] =
    useCreateDailyTaskMutation();

  const isLoading = isCreatingAppointment || isCreatingDailyTask;

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || "appointment");
      setFormData((prev) => ({
        ...prev,
        date: initialDate || format(new Date(), "yyyy-MM-dd"),
      }));
      setTaskData((prev) => ({
        ...prev,
        date: initialDate || format(new Date(), "yyyy-MM-dd"),
      }));
      setError("");
    }
  }, [isOpen, initialDate, initialTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTaskChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskData((prev) => ({
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
    setError("");

    if (activeTab === "task") {
      if (!taskData.title.trim()) {
        setError(t("Title is required"));
        return;
      }
      try {
        await createDailyTask(taskData).unwrap();
        onClose(true);
      } catch (error) {
        console.error("Failed to create task:", error);
        setError(t("Failed to create. Please try again."));
      }
    } else {
      if (!formData.title.trim()) {
        setError(t("Title is required"));
        return;
      }
      try {
        await createAppointment(formData).unwrap();
        onClose(true);
      } catch (error) {
        console.error("Failed to create appointment:", error);
        setError(t("Failed to create. Please try again."));
      }
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  if (!isOpen) return null;

  const TASK_CATEGORIES = [
    { value: "follow_up", label: t("Follow Up") },
    { value: "review", label: t("Review") },
    { value: "analysis", label: t("Analysis") },
    { value: "design", label: t("Design") },
    { value: "coding", label: t("Coding") },
    { value: "testing", label: t("Testing") },
    { value: "documentation", label: t("Documentation") },
    { value: "communication", label: t("Communication") },
    { value: "other", label: t("Other") },
  ];

  const tabs = [
    { id: "appointment", label: t("Appointments") },
    { id: "task", label: t("Tasks") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeTab === "task" ? t("Create Task") : t("Create Appointment")}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setError("");
                }}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          {activeTab === "task" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("Title")} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={taskData.title}
                  onChange={handleTaskChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={t("Enter task title")}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("Description")}
                </label>
                <textarea
                  name="description"
                  value={taskData.description}
                  onChange={handleTaskChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={t("Enter description")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Date")} *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={taskData.date}
                    onChange={handleTaskChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Priority")}
                  </label>
                  <select
                    name="priority"
                    value={taskData.priority}
                    onChange={handleTaskChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">{t("Low")}</option>
                    <option value="medium">{t("Medium")}</option>
                    <option value="high">{t("High")}</option>
                    <option value="urgent">{t("Urgent")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Category")}
                  </label>
                  <select
                    name="category"
                    value={taskData.category}
                    onChange={handleTaskChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {TASK_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Color")}
                  </label>
                  <input
                    type="color"
                    name="color"
                    value={taskData.color}
                    onChange={handleTaskChange}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("Notes")}
                </label>
                <textarea
                  name="notes"
                  value={taskData.notes}
                  onChange={handleTaskChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={t("Add any notes...")}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
                  placeholder={t("Enter appointment title")}
                  autoFocus
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
                  placeholder={t("Enter description")}
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

              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
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
                    {t("Category")}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Priority")}
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">{t("Low")}</option>
                    <option value="medium">{t("Medium")}</option>
                    <option value="high">{t("High")}</option>
                    <option value="urgent">{t("Urgent")}</option>
                  </select>
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
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="enable_reminders"
                  checked={formData.enable_reminders}
                  onChange={handleChange}
                  className="rounded text-primary-500 focus:ring-primary-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  {t("Enable reminders")}
                </label>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              disabled={
                (activeTab === "task"
                  ? !taskData.title.trim()
                  : !formData.title.trim()) || isLoading
              }
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-600 rounded-lg transition-colors"
            >
              {isLoading
                ? t("Creating...")
                : activeTab === "task"
                ? t("Create Task")
                : t("Create Appointment")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAgendaModal;
