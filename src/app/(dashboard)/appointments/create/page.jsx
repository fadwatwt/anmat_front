"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateAppointmentMutation,
  useCreateDailyTaskMutation,
} from "@/redux/appointments/appointmentsApi";
import { useGetSubscriberTasksQuery } from "@/redux/tasks/subscriberTasksApi";
import Page from "@/components/Page.jsx";
import Alert from "@/components/Alerts/Alert";
import { format } from "date-fns";
import { RiArrowLeftLine } from "react-icons/ri";

function CreateAppointmentPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType = searchParams.get("type") || "appointment";
  const initialDate = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");

  const [itemType, setItemType] = useState(initialType);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: initialDate,
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
    is_personal: false,
  });

  const [dailyTaskData, setDailyTaskData] = useState({
    title: "",
    description: "",
    date: initialDate,
    priority: "medium",
    category: "other",
    is_personal: false,
    color: "#22C55E",
    notes: "",
  });

  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);

  const [createAppointment, { isLoading: isCreatingAppointment }] =
    useCreateAppointmentMutation();
  const [createDailyTask, { isLoading: isCreatingDailyTask }] =
    useCreateDailyTaskMutation();
  const { data: tasks = [] } = useGetSubscriberTasksQuery();

  const isLoading = isCreatingAppointment || isCreatingDailyTask;

  useEffect(() => {
    const type = searchParams.get("type");
    const date = searchParams.get("date");
    if (type) setItemType(type);
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
      setDailyTaskData((prev) => ({ ...prev, date }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDailyTaskChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDailyTaskData((prev) => ({
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

    if (itemType === "daily_task") {
      if (!dailyTaskData.title.trim()) return;
      try {
        await createDailyTask(dailyTaskData).unwrap();
        setIsSuccessAlertOpen(true);
        setTimeout(() => router.push("/appointments"), 1500);
      } catch (error) {
        console.error("Failed to create daily task:", error);
        setIsErrorAlertOpen(true);
      }
    } else {
      if (!formData.title.trim()) return;
      try {
        await createAppointment({
          ...formData,
          type: itemType,
        }).unwrap();
        setIsSuccessAlertOpen(true);
        setTimeout(() => router.push("/appointments"), 1500);
      } catch (error) {
        console.error("Failed to create appointment:", error);
        setIsErrorAlertOpen(true);
      }
    }
  };

  const DAILY_TASK_CATEGORIES = [
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

  return (
    <>
      <Page title={itemType === "daily_task" ? t("Create Daily Task") : t("Create Appointment")}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <RiArrowLeftLine size={20} />
            {t("Back")}
          </button>

          <div className="mb-6">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setItemType("appointment")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  itemType === "appointment"
                    ? "bg-white dark:bg-gray-600 text-primary-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {t("Appointment")}
              </button>
              <button
                onClick={() => setItemType("daily_task")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  itemType === "daily_task"
                    ? "bg-white dark:bg-gray-600 text-primary-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {t("Daily Task")}
              </button>
              <button
                onClick={() => setItemType("personal")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  itemType === "personal"
                    ? "bg-white dark:bg-gray-600 text-primary-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {t("Personal")}
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            {itemType === "daily_task" || itemType === "personal" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Title")} *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={dailyTaskData.title}
                    onChange={handleDailyTaskChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={t("Enter task title")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Description")}
                  </label>
                  <textarea
                    name="description"
                    value={dailyTaskData.description}
                    onChange={handleDailyTaskChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={t("Enter description")}
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
                      value={dailyTaskData.date}
                      onChange={handleDailyTaskChange}
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
                      value={dailyTaskData.priority}
                      onChange={handleDailyTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">{t("Low")}</option>
                      <option value="medium">{t("Medium")}</option>
                      <option value="high">{t("High")}</option>
                      <option value="urgent">{t("Urgent")}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t("Category")}
                    </label>
                    <select
                      name="category"
                      value={dailyTaskData.category}
                      onChange={handleDailyTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {DAILY_TASK_CATEGORIES.map((cat) => (
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
                      value={dailyTaskData.color}
                      onChange={handleDailyTaskChange}
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
                    value={dailyTaskData.notes}
                    onChange={handleDailyTaskChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={t("Add any notes...")}
                  />
                </div>

                {itemType === "personal" && (
                  <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <input
                      type="checkbox"
                      name="is_personal"
                      checked={true}
                      disabled
                      className="rounded text-purple-500 focus:ring-purple-500"
                    />
                    <label className="text-sm text-purple-700 dark:text-purple-300">
                      {t("This task will only be visible to you")}
                    </label>
                  </div>
                )}
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
                    rows={3}
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

                <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("Link to Task")} ({t("Optional")})
                  </label>
                  <select
                    name="task_id"
                    value={formData.task_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">{t("No task linked")}</option>
                    {tasks.map((task) => (
                      <option key={task._id} value={task._id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
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

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={
                  (itemType === "daily_task" || itemType === "personal"
                    ? !dailyTaskData.title.trim()
                    : !formData.title.trim()) || isLoading
                }
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading
                  ? t("Creating...")
                  : itemType === "daily_task"
                  ? t("Create Task")
                  : t("Create Appointment")}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {t("Cancel")}
              </button>
            </div>
          </form>
        </div>
      </Page>

      <Alert
        type="success"
        title={t("Success")}
        message={
          itemType === "daily_task"
            ? t("Daily task created successfully")
            : t("Appointment created successfully")
        }
        isOpen={isSuccessAlertOpen}
        onClose={() => setIsSuccessAlertOpen(false)}
        isBtns={0}
      />

      <Alert
        type="error"
        title={t("Error")}
        message={
          itemType === "daily_task"
            ? t("Failed to create daily task")
            : t("Failed to create appointment")
        }
        isOpen={isErrorAlertOpen}
        onClose={() => setIsErrorAlertOpen(false)}
        isBtns={0}
      />
    </>
  );
}

export default CreateAppointmentPage;
