"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateAppointmentMutation,
  useCreateDailyTaskMutation,
} from "@/redux/appointments/appointmentsApi";
import { format } from "date-fns";
import { RiCloseLine, RiBellLine, RiCalendarScheduleLine, RiTaskLine } from "react-icons/ri";

const REMINDER_OPTIONS = [
  { value: "5_min",  labelAr: "قبل ٥ دقائق",  labelEn: "5 minutes before" },
  { value: "15_min", labelAr: "قبل ١٥ دقيقة", labelEn: "15 minutes before" },
  { value: "1_hour", labelAr: "قبل ساعة",     labelEn: "1 hour before" },
  { value: "1_day",  labelAr: "قبل يوم",       labelEn: "1 day before" },
  { value: "1_week", labelAr: "قبل أسبوع",     labelEn: "1 week before" },
];

const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm";

const LABEL_CLASS = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

function CreateAgendaModal({ isOpen, onClose, initialDate, initialTab }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const [activeTab, setActiveTab] = useState(initialTab || "appointment");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: initialDate || todayStr,
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
    date: initialDate || todayStr,
    priority: "medium",
    category: "other",
    is_personal: true,
    color: "#22C55E",
    notes: "",
  });

  const [reminderData, setReminderData] = useState({
    title: "",
    date: initialDate || todayStr,
    start_time: "09:00",
    reminder_types: ["15_min"],
    notes: "",
  });

  const [error, setError] = useState("");

  const [createAppointment, { isLoading: isCreatingAppointment }] = useCreateAppointmentMutation();
  const [createDailyTask,   { isLoading: isCreatingDailyTask }]   = useCreateDailyTaskMutation();

  const isLoading = isCreatingAppointment || isCreatingDailyTask;

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || "appointment");
      const d = initialDate || todayStr;
      setFormData((p)    => ({ ...p, date: d }));
      setTaskData((p)    => ({ ...p, date: d }));
      setReminderData((p) => ({ ...p, date: d }));
      setError("");
    }
  }, [isOpen, initialDate, initialTab]);

  /* ─── change handlers ─── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const handleTaskChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const handleReminderDataChange = (e) => {
    const { name, value } = e.target;
    setReminderData((p) => ({ ...p, [name]: value }));
  };
  const handleAppointmentReminderToggle = (val) => {
    setFormData((p) => {
      const list = p.reminder_types.includes(val)
        ? p.reminder_types.filter((r) => r !== val)
        : [...p.reminder_types, val];
      return { ...p, reminder_types: list };
    });
  };
  const handleReminderTypeToggle = (val) => {
    setReminderData((p) => {
      const list = p.reminder_types.includes(val)
        ? p.reminder_types.filter((r) => r !== val)
        : [...p.reminder_types, val];
      return { ...p, reminder_types: list };
    });
  };

  /* ─── submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (activeTab === "task") {
        if (!taskData.title.trim()) { setError(t("Title is required")); return; }
        await createDailyTask(taskData).unwrap();

      } else if (activeTab === "reminder") {
        if (!reminderData.title.trim()) { setError(t("Title is required")); return; }
        if (!reminderData.start_time)   { setError(t("Time is required")); return; }
        await createAppointment({
          title:           reminderData.title,
          description:     reminderData.notes || "",
          date:            reminderData.date,
          start_time:      reminderData.start_time,
          category:        "reminder",
          color:           "#F59E0B",
          enable_reminders: true,
          reminder_types:  reminderData.reminder_types,
          is_personal:     true,
          priority:        "medium",
        }).unwrap();

      } else {
        if (!formData.title.trim()) { setError(t("Title is required")); return; }
        await createAppointment(formData).unwrap();
      }

      onClose(true);
    } catch {
      setError(t("Failed to create. Please try again."));
    }
  };

  const handleClose = () => onClose(false);
  if (!isOpen) return null;

  const TASK_CATEGORIES = [
    { value: "follow_up",      label: t("Follow Up") },
    { value: "review",         label: t("Review") },
    { value: "analysis",       label: t("Analysis") },
    { value: "design",         label: t("Design") },
    { value: "coding",         label: t("Coding") },
    { value: "testing",        label: t("Testing") },
    { value: "documentation",  label: t("Documentation") },
    { value: "communication",  label: t("Communication") },
    { value: "other",          label: t("Other") },
  ];

  const tabs = [
    { id: "appointment", icon: <RiCalendarScheduleLine size={14} />, label: t("Appointments") },
    { id: "task",        icon: <RiTaskLine size={14} />,             label: t("Daily Tasks") },
    { id: "reminder",    icon: <RiBellLine size={14} />,             label: t("Reminder") },
  ];

  const submitLabel = () => {
    if (isLoading) return t("Creating...");
    if (activeTab === "task")     return t("Create Daily Task");
    if (activeTab === "reminder") return t("Create Reminder");
    return t("Create Appointment");
  };

  const isSubmitDisabled = () => {
    if (activeTab === "task")     return !taskData.title.trim() || isLoading;
    if (activeTab === "reminder") return !reminderData.title.trim() || !reminderData.start_time || isLoading;
    return !formData.title.trim() || isLoading;
  };

  /* ─── title map ─── */
  const modalTitle = {
    appointment: t("Create Appointment"),
    task:        t("Create Daily Task"),
    reminder:    t("Create Reminder"),
  }[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{modalTitle}</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(""); }}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* ── DAILY TASK ── */}
          {activeTab === "task" && (
            <div className="space-y-4">
              <div>
                <label className={LABEL_CLASS}>{t("Title")} *</label>
                <input type="text" name="title" value={taskData.title} onChange={handleTaskChange}
                  required autoFocus placeholder={t("Enter task title")} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>{t("Description")}</label>
                <textarea name="description" value={taskData.description} onChange={handleTaskChange}
                  rows={2} placeholder={t("Enter description")} className={INPUT_CLASS} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>{t("Date")} *</label>
                  <input type="date" name="date" value={taskData.date} onChange={handleTaskChange}
                    required className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>{t("Priority")}</label>
                  <select name="priority" value={taskData.priority} onChange={handleTaskChange} className={INPUT_CLASS}>
                    <option value="low">{t("Low")}</option>
                    <option value="medium">{t("Medium")}</option>
                    <option value="high">{t("High")}</option>
                    <option value="urgent">{t("Urgent")}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>{t("Category")}</label>
                  <select name="category" value={taskData.category} onChange={handleTaskChange} className={INPUT_CLASS}>
                    {TASK_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>{t("Color")}</label>
                  <input type="color" name="color" value={taskData.color} onChange={handleTaskChange}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer" />
                </div>
              </div>
              <div>
                <label className={LABEL_CLASS}>{t("Notes")}</label>
                <textarea name="notes" value={taskData.notes} onChange={handleTaskChange}
                  rows={2} placeholder={t("Add any notes...")} className={INPUT_CLASS} />
              </div>
            </div>
          )}

          {/* ── REMINDER ── */}
          {activeTab === "reminder" && (
            <div className="space-y-4">
              {/* hint */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <RiBellLine size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  {isArabic
                    ? "سيتم إرسال إشعار قبل الوقت المحدد بناءً على خيارات التنبيه التي تختارها."
                    : "A notification will be sent before the reminder time based on your selected advance notice."}
                </p>
              </div>

              <div>
                <label className={LABEL_CLASS}>{t("Title")} *</label>
                <input type="text" name="title" value={reminderData.title}
                  onChange={handleReminderDataChange} required autoFocus
                  placeholder={isArabic ? "مثال: مراجعة التقرير الأسبوعي" : "e.g. Review weekly report"}
                  className={INPUT_CLASS} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>{t("Date")} *</label>
                  <input type="date" name="date" value={reminderData.date}
                    onChange={handleReminderDataChange} required className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>{t("Time")} *</label>
                  <input type="time" name="start_time" value={reminderData.start_time}
                    onChange={handleReminderDataChange} required className={INPUT_CLASS} />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>
                  {isArabic ? "التنبيه قبل" : "Notify me"}
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {REMINDER_OPTIONS.map((opt) => {
                    const active = reminderData.reminder_types.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleReminderTypeToggle(opt.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          active
                            ? "bg-amber-100 dark:bg-amber-900/40 border-amber-400 text-amber-700 dark:text-amber-300"
                            : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {isArabic ? opt.labelAr : opt.labelEn}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>{t("Notes")}</label>
                <textarea name="notes" value={reminderData.notes}
                  onChange={handleReminderDataChange} rows={2}
                  placeholder={isArabic ? "ملاحظة اختيارية..." : "Optional note..."}
                  className={INPUT_CLASS} />
              </div>
            </div>
          )}

          {/* ── APPOINTMENT ── */}
          {activeTab === "appointment" && (
            <div className="space-y-4">
              <div>
                <label className={LABEL_CLASS}>{t("Title")} *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange}
                  required autoFocus placeholder={t("Enter appointment title")} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>{t("Description")}</label>
                <textarea name="description" value={formData.description} onChange={handleChange}
                  rows={2} placeholder={t("Enter description")} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>{t("Location")}</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange}
                  placeholder={t("Enter location")} className={INPUT_CLASS} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>{t("Date")} *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange}
                    required className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>{t("Start Time")} *</label>
                  <input type="time" name="start_time" value={formData.start_time} onChange={handleChange}
                    required className={INPUT_CLASS} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>{t("End Time")}</label>
                  <input type="time" name="end_time" value={formData.end_time} onChange={handleChange}
                    className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>{t("Category")}</label>
                  <select name="category" value={formData.category} onChange={handleChange} className={INPUT_CLASS}>
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
                  <label className={LABEL_CLASS}>{t("Priority")}</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className={INPUT_CLASS}>
                    <option value="low">{t("Low")}</option>
                    <option value="medium">{t("Medium")}</option>
                    <option value="high">{t("High")}</option>
                    <option value="urgent">{t("Urgent")}</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>{t("Color")}</label>
                  <input type="color" name="color" value={formData.color} onChange={handleChange}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer" />
                </div>
              </div>
              <div>
                <label className={LABEL_CLASS + " mb-2"}>{t("Reminders")}</label>
                <div className="flex flex-wrap gap-2">
                  {REMINDER_OPTIONS.map((opt) => (
                    <label key={opt.value}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
                      <input type="checkbox"
                        checked={formData.reminder_types.includes(opt.value)}
                        onChange={() => handleAppointmentReminderToggle(opt.value)}
                        className="rounded text-primary-500 focus:ring-primary-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {isArabic ? opt.labelAr : opt.labelEn}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="enable_reminders" checked={formData.enable_reminders}
                  onChange={handleChange} className="rounded text-primary-500 focus:ring-primary-500" />
                <label className="text-sm text-gray-700 dark:text-gray-300">{t("Enable reminders")}</label>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {t("Cancel")}
            </button>
            <button type="submit" disabled={isSubmitDisabled()}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:dark:bg-gray-600 ${
                activeTab === "reminder"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-primary-500 hover:bg-primary-600"
              }`}>
              {submitLabel()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAgendaModal;
