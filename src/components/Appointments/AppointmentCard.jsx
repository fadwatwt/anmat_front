"use client";

import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  RiCalendarLine,
  RiTimeLine,
  RiMapPinLine,
  RiUserLine,
  RiCheckLine,
  RiCloseLine,
  RiShareLine,
  RiTaskLine,
} from "react-icons/ri";
import AppointmentCategoryBadge from "./AppointmentCategoryBadge";

const CountdownBadge = ({ countdownDays }) => {
  const { t } = useTranslation();

  if (countdownDays < 0) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        {t("Overdue")}
      </span>
    );
  }

  if (countdownDays === 0) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
        {t("Today")}
      </span>
    );
  }

  if (countdownDays <= 3) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        {countdownDays} {t("days")}
      </span>
    );
  }

  if (countdownDays <= 7) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
        {countdownDays} {t("days")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
      {countdownDays} {t("days")}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();

  const statusConfig = {
    upcoming: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-800 dark:text-blue-400",
      label: t("Upcoming"),
    },
    completed: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-400",
      label: t("Completed"),
    },
    cancelled: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-400",
      label: t("Cancelled"),
    },
  };

  const config = statusConfig[status] || statusConfig.upcoming;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

function AppointmentCard({
  appointment,
  size = "md",
  showCountdown = true,
  onComplete,
  onCancel,
  onShare,
}) {
  const { t } = useTranslation();

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? t("PM") : t("AM");
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd MMMM, yyyy", { locale: ar });
    } catch {
      return dateStr;
    }
  };

  const isSmall = size === "sm";
  const isLarge = size === "lg";

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${
        isSmall ? "p-3" : "p-4"
      } hover:shadow-md transition-shadow`}
      style={{ borderRight: `4px solid ${appointment.color || "#3B82F6"}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <AppointmentCategoryBadge
              category={appointment.category}
              color={appointment.color}
              size={isSmall ? "sm" : "md"}
            />
            <StatusBadge status={appointment.status} />
          </div>

          <h3
            className={`font-semibold text-gray-900 dark:text-white truncate ${
              isSmall ? "text-sm" : "text-base"
            }`}
          >
            {appointment.title}
          </h3>

          {!isSmall && appointment.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {appointment.description}
            </p>
          )}

          <div className={`flex flex-wrap gap-3 ${isSmall ? "mt-2" : "mt-3"}`}>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <RiCalendarLine size={14} />
              <span>{formatDate(appointment.date)}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <RiTimeLine size={14} />
              <span>
                {formatTime(appointment.start_time)}
                {appointment.end_time && ` - ${formatTime(appointment.end_time)}`}
              </span>
            </div>

            {appointment.location && !isSmall && (
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <RiMapPinLine size={14} />
                <span className="truncate">{appointment.location}</span>
              </div>
            )}
          </div>

          {!isSmall && appointment.attendee_list?.length > 0 && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <RiUserLine size={14} />
              <span>
                {appointment.attendee_list.length} {t("attendees")}
              </span>
            </div>
          )}

          {!isSmall && appointment.task && (
            <div className="flex items-center gap-1 mt-2 text-sm text-blue-500 dark:text-blue-400">
              <RiTaskLine size={14} />
              <span className="truncate">{appointment.task.title}</span>
            </div>
          )}
        </div>

        {showCountdown && appointment.status === "upcoming" && (
          <CountdownBadge countdownDays={appointment.countdown_days} />
        )}
      </div>

      {!isSmall && appointment.status === "upcoming" && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          {onComplete && (
            <button
              onClick={() => onComplete(appointment._id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            >
              <RiCheckLine size={16} />
              {t("Complete")}
            </button>
          )}

          {onCancel && (
            <button
              onClick={() => onCancel(appointment._id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <RiCloseLine size={16} />
              {t("Cancel")}
            </button>
          )}

          {onShare && (
            <button
              onClick={() => onShare(appointment)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <RiShareLine size={16} />
              {t("Share")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AppointmentCard;
