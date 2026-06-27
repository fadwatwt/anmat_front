"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";

const REMINDER_LABELS = {
  "5_min":  { ar: "قبل ٥ د",    en: "5m before" },
  "15_min": { ar: "قبل ١٥ د",   en: "15m before" },
  "1_hour": { ar: "قبل ساعة",   en: "1h before" },
  "1_day":  { ar: "قبل يوم",    en: "1d before" },
  "1_week": { ar: "قبل أسبوع",  en: "1w before" },
};

const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm";

const LABEL_CLASS = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

function EditReminderModal({ isOpen, reminder, onClose, onSave }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [data, setData] = useState({
    title: "",
    date: "",
    start_time: "",
    reminder_types: [],
    notes: "",
  });

  const [initialized, setInitialized] = useState(false);

  if (isOpen && reminder && !initialized) {
    setData({
      title: reminder.title || "",
      date: reminder.date || "",
      start_time: reminder.start_time || "",
      reminder_types: reminder.reminder_types || [],
      notes: reminder.notes || "",
    });
    setInitialized(true);
  }

  if (!isOpen) {
    if (initialized) setInitialized(false);
    return null;
  }

  const handleSave = () => {
    if (!data.title.trim()) return;
    onSave({
      _id: reminder._id,
      title: data.title,
      date: data.date,
      start_time: data.start_time,
      reminder_types: data.reminder_types,
      notes: data.notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("Edit Reminder")}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <RiCloseLine size={24} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className={LABEL_CLASS}>{t("Title")} *</label>
            <input type="text" value={data.title}
              onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
              className={INPUT_CLASS} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>{t("Date")} *</label>
              <input type="date" value={data.date}
                onChange={(e) => setData((p) => ({ ...p, date: e.target.value }))}
                className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>{t("Time")} *</label>
              <input type="time" value={data.start_time}
                onChange={(e) => setData((p) => ({ ...p, start_time: e.target.value }))}
                className={INPUT_CLASS} />
            </div>
          </div>
          <div>
            <label className={LABEL_CLASS}>{isArabic ? "التنبيه قبل" : "Notify me"}</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {Object.entries(REMINDER_LABELS).map(([value, labels]) => {
                const active = data.reminder_types.includes(value);
                return (
                  <button key={value} type="button"
                    onClick={() => setData((p) => ({
                      ...p,
                      reminder_types: active
                        ? p.reminder_types.filter((r) => r !== value)
                        : [...p.reminder_types, value],
                    }))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      active
                        ? "bg-amber-100 dark:bg-amber-900/40 border-amber-400 text-amber-700 dark:text-amber-300"
                        : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {isArabic ? labels.ar : labels.en}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className={LABEL_CLASS}>{t("Notes")}</label>
            <textarea value={data.notes}
              onChange={(e) => setData((p) => ({ ...p, notes: e.target.value }))}
              rows={2} className={INPUT_CLASS} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            {t("Cancel")}
          </button>
          <button onClick={handleSave}
            disabled={!data.title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors disabled:bg-gray-300 disabled:dark:bg-gray-600">
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditReminderModal;
