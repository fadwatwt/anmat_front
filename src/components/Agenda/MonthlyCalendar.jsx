"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetMonthAppointmentsQuery,
  useGetMonthDailyTasksQuery,
} from "@/redux/appointments/appointmentsApi";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCalendarLine,
} from "react-icons/ri";

const DAYSOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYSOfWeekAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHSAr = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function MonthlyCalendar({ onDaySelect, selectedDate }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: appointments = [] } = useGetMonthAppointmentsQuery({ year, month });
  const { data: dailyTasks = [] } = useGetMonthDailyTasksQuery({ year, month });

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  const appointmentsByDate = useMemo(() => {
    const map = {};
    appointments.forEach((apt) => {
      if (!map[apt.date]) map[apt.date] = [];
      map[apt.date].push(apt);
    });
    return map;
  }, [appointments]);

  const tasksByDate = useMemo(() => {
    const map = {};
    dailyTasks.forEach((task) => {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    });
    return map;
  }, [dailyTasks]);

  const today = new Date().toISOString().split("T")[0];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleDayClick = (day) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onDaySelect?.(dateStr);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayAppointments = appointmentsByDate[dateStr] || [];
    const dayTasks = tasksByDate[dateStr] || [];
    const totalItems = dayAppointments.length + dayTasks.length;
    const isToday = dateStr === today;
    const isSelected = dateStr === selectedDate;
    const hasAppointments = dayAppointments.length > 0;

    days.push(
      <div
        key={day}
        onClick={() => handleDayClick(day)}
        className={`h-24 p-1.5 border border-gray-100 dark:border-gray-700 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
          isToday ? "ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20" : ""
        } ${isSelected ? "ring-2 ring-primary-600 bg-primary-100 dark:bg-primary-900/30" : ""}`}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-sm font-medium ${
              isToday
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {day}
          </span>
          {totalItems > 0 && (
            <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>
        <div className="space-y-0.5 overflow-hidden">
          {dayAppointments.slice(0, 2).map((apt) => (
            <div
              key={apt._id}
              className="text-xs truncate px-1 py-0.5 rounded"
              style={{ backgroundColor: `${apt.color || "#3B82F6"}20`, color: apt.color || "#3B82F6" }}
            >
              {apt.start_time?.substring(0, 5)} {apt.title}
            </div>
          ))}
          {dayTasks.slice(0, 1).map((task) => (
            <div
              key={task._id}
              className="text-xs truncate px-1 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            >
              {task.title}
            </div>
          ))}
          {totalItems > 3 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
              +{totalItems - 3} {t("more")}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RiCalendarLine size={20} className="text-primary-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {isArabic ? MONTHSAr[month - 1] : MONTHS[month - 1]} {year}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RiArrowLeftLine size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            {t("Today")}
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RiArrowRightLine size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {(isArabic ? DAYSOfWeekAr : DAYSOfWeek).map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}

export default MonthlyCalendar;
