"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";

const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm";

const LABEL_CLASS = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

function EditDailyTaskModal({ task, isOpen, onClose, onSave }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    priority: "medium",
  });

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        date: task.date ? task.date.split("T")[0] : "",
        priority: task.priority || "medium",
      });
      setError("");
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("Edit Task")}
          </h2>
          <button onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <RiCloseLine size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className={LABEL_CLASS}>{t("Title")} *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              required autoFocus className={INPUT_CLASS} />
          </div>

          <div>
            <label className={LABEL_CLASS}>{t("Description")}</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              rows={2} className={INPUT_CLASS} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>{t("Date")} *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange}
                required className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>{t("Priority")}</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className={INPUT_CLASS}>
                <option value="low">{t("Low")}</option>
                <option value="medium">{t("Medium")}</option>
                <option value="high">{t("High")}</option>
                <option value="urgent">{t("Urgent")}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose}
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

export default EditDailyTaskModal;
