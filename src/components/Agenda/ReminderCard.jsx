"use client";

import { useTranslation } from "react-i18next";
import {
  RiBellLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
  RiTimeLine,
} from "react-icons/ri";

const REMINDER_LABELS = {
  "5_min":  { ar: "قبل ٥ د",    en: "5m before" },
  "15_min": { ar: "قبل ١٥ د",   en: "15m before" },
  "1_hour": { ar: "قبل ساعة",   en: "1h before" },
  "1_day":  { ar: "قبل يوم",    en: "1d before" },
  "1_week": { ar: "قبل أسبوع",  en: "1w before" },
};

function ReminderCard({ reminder, onComplete, onDelete, onEdit }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const done = reminder.status === "completed";
  const firstType = reminder.reminder_types?.[0];
  const typeLabel = firstType
    ? (isArabic ? REMINDER_LABELS[firstType]?.ar : REMINDER_LABELS[firstType]?.en) || firstType
    : null;

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? (isArabic ? "م" : "PM") : (isArabic ? "ص" : "AM");
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${display}:${String(m).padStart(2, "0")} ${period}`;
  };

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border border-amber-100 dark:border-amber-900/40 group ${done ? "opacity-50" : "hover:bg-amber-50 dark:hover:bg-amber-900/10"}`}>
      <RiBellLine size={14} className={done ? "text-gray-400" : "text-amber-500 flex-shrink-0"} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${done ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
          {reminder.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {reminder.start_time && (
            <span className="flex items-center gap-0.5 text-xs text-amber-600 dark:text-amber-400">
              <RiTimeLine size={10} />
              {formatTime(reminder.start_time)}
            </span>
          )}
          {typeLabel && (
            <span className="text-xs text-gray-400 dark:text-gray-500">{typeLabel}</span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!done && onComplete && (
          <button onClick={() => onComplete(reminder._id)} className="p-0.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded" title={t("Complete")}>
            <RiCheckLine size={14} />
          </button>
        )}
        {onEdit && (
          <button onClick={() => onEdit(reminder)} className="p-0.5 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded" title={t("Edit")}>
            <RiEditLine size={14} />
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(reminder._id)} className="p-0.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title={t("Delete")}>
            <RiDeleteBinLine size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ReminderCard;
