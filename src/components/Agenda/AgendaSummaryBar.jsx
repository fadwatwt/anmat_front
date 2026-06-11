"use client";

import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  useGetTodayAppointmentsQuery,
  useGetDailyTasksQuery,
} from "@/redux/appointments/appointmentsApi";
import {
  RiCalendarEventLine,
  RiTaskLine,
  RiBellLine,
  RiTimeLine,
} from "react-icons/ri";

function AgendaSummaryBar() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const today = new Date().toISOString().split("T")[0];

  const { data: todayAppointments = [] } = useGetTodayAppointmentsQuery();
  const { data: todayTasks = [] } = useGetDailyTasksQuery({ date: today });

  const remindersCount = todayAppointments.filter(
    (a) => a.category === "reminder" && a.status !== "completed"
  ).length;

  const pendingTasksCount = todayTasks.filter(
    (t) => t.status !== "completed"
  ).length;

  const todayFormatted = format(new Date(), "EEEE d MMMM", {
    locale: isArabic ? ar : undefined,
  });

  const stats = [
    {
      icon: <RiCalendarEventLine size={16} />,
      count: todayAppointments.length,
      label: t("Appointments"),
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <RiTaskLine size={16} />,
      count: pendingTasksCount,
      label: t("Tasks"),
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: <RiBellLine size={16} />,
      count: remindersCount,
      label: t("Reminders"),
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <RiTimeLine size={16} />
          <span className="text-sm font-medium">{todayFormatted}</span>
        </div>

        <div className="flex items-center gap-3">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${stat.bg}`}
            >
              <span className={stat.color}>{stat.icon}</span>
              <span className={`text-sm font-semibold ${stat.color}`}>
                {stat.count}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgendaSummaryBar;
