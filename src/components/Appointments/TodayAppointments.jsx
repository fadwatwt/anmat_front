"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useGetTodayAppointmentsQuery } from "@/redux/appointments/appointmentsApi";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { RiCalendarLine, RiArrowRightLine } from "react-icons/ri";

const TimeBadge = ({ time }) => {
  if (!time) return null;

  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "م" : "ص";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

  return (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      {displayHour}:{minutes} {period}
    </span>
  );
};

function TodayAppointments({ maxItems = 5 }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: appointments = [], isLoading } = useGetTodayAppointmentsQuery();

  const displayAppointments = appointments.slice(0, maxItems);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
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
            {t("Today's Appointments")} ({appointments.length})
          </h3>
        </div>
        {appointments.length > maxItems && (
          <button
            onClick={() => router.push("/appointments")}
            className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
          >
            {t("View All")}
            <RiArrowRightLine size={14} />
          </button>
        )}
      </div>

      {displayAppointments.length === 0 ? (
        <div className="text-center py-6">
          <RiCalendarLine size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">{t("No appointments today")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/appointments/${appointment._id}`)}
              style={{ borderRight: `3px solid ${appointment.color || "#3B82F6"}` }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                  {appointment.title}
                </p>
                {appointment.location && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    📍 {appointment.location}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <TimeBadge time={appointment.start_time} />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: appointment.color || "#3B82F6" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodayAppointments;
