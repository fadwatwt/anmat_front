"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";

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

function EditAppointmentModal({ appointment, isOpen, onClose, onSave }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    start_time: "",
    end_time: "",
    category: "task",
    color: "#3B82F6",
    is_all_day: false,
    enable_reminders: true,
    reminder_types: [],
    recurrence_type: "none",
    priority: "medium",
  });

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (appointment && isOpen) {
      setFormData({
        title: appointment.title || "",
        description: appointment.description || "",
        location: appointment.location || "",
        date: appointment.date ? appointment.date.split("T")[0] : "",
        start_time: appointment.start_time || "",
        end_time: appointment.end_time || "",
        category: appointment.category || "task",
        color: appointment.color || "#3B82F6",
        is_all_day: appointment.is_all_day || false,
        enable_reminders: appointment.enable_reminders ?? true,
        reminder_types: appointment.reminder_types || [],
        recurrence_type: appointment.recurrence_type || "none",
        priority: appointment.priority || "medium",
      });
      setError("");
    }
  }, [appointment, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleReminderToggle = (val) => {
    setFormData((p) => {
      const list = p.reminder_types.includes(val)
        ? p.reminder_types.filter((r) => r !== val)
        : [...p.reminder_types, val];
      return { ...p, reminder_types: list };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError(t("Title is required"));
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
    } catch {
      setError(t("Failed to update. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => onClose();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("Edit Appointment")}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

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
                      onChange={() => handleReminderToggle(opt.value)}
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

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {t("Cancel")}
            </button>
            <button type="submit" disabled={!formData.title.trim() || isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors disabled:bg-gray-300 disabled:dark:bg-gray-600">
              {isSaving ? t("Saving...") : t("Save Changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAppointmentModal;
