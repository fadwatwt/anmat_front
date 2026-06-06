"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useCreateAppointmentMutation } from "@/redux/appointments/appointmentsApi";
import { useGetSubscriberTasksQuery } from "@/redux/tasks/subscriberTasksApi";
import Page from "@/components/Page.jsx";
import Alert from "@/components/Alerts/Alert";
import { format } from "date-fns";
import { RiArrowLeftLine } from "react-icons/ri";

function CreateAppointmentPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
    start_time: "09:00",
    end_time: "",
    category: "task",
    color: "#3B82F6",
    is_all_day: false,
    enable_reminders: true,
    reminder_types: ["1_day"],
    recurrence_type: "none",
    task_id: "",
  });

  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const { data: tasks = [] } = useGetSubscriberTasksQuery();

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

    if (!formData.title.trim()) return;

    try {
      await createAppointment({
        ...formData,
        start_time: formData.end_time ? formData.start_time : formData.start_time,
      }).unwrap();

      setIsSuccessAlertOpen(true);
      setTimeout(() => {
        router.push("/appointments");
      }, 1500);
    } catch (error) {
      console.error("Failed to create appointment:", error);
      setIsErrorAlertOpen(true);
    }
  };

  return (
    <>
      <Page title={t("Create Appointment")}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <RiArrowLeftLine size={20} />
            {t("Back")}
          </button>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
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

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={!formData.title.trim() || isLoading}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? t("Creating...") : t("Create Appointment")}
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
        message={t("Appointment created successfully")}
        isOpen={isSuccessAlertOpen}
        onClose={() => setIsSuccessAlertOpen(false)}
        isBtns={0}
      />

      <Alert
        type="error"
        title={t("Error")}
        message={t("Failed to create appointment")}
        isOpen={isErrorAlertOpen}
        onClose={() => setIsErrorAlertOpen(false)}
        isBtns={0}
      />
    </>
  );
}

export default CreateAppointmentPage;
