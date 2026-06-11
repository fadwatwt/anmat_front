"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetTodayAppointmentsQuery,
} from "@/redux/appointments/appointmentsApi";
import {
  RiMapPinLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import {
  useCompleteAppointmentMutation,
  useCancelAppointmentMutation,
} from "@/redux/appointments/appointmentsApi";

const HOUR_HEIGHT = 64; // px per hour
const START_HOUR = 7;   // 7am
const END_HOUR = 20;    // 8pm

function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function minutesFromStart(minutes) {
  return minutes - START_HOUR * 60;
}

function AppointmentBlock({ apt, hourHeight, onComplete, onCancel }) {
  const { t } = useTranslation();
  const startMin = timeToMinutes(apt.start_time);
  const endMin = timeToMinutes(apt.end_time) || (startMin ? startMin + 60 : null);

  if (!startMin) return null;

  const top = (minutesFromStart(startMin) / 60) * hourHeight;
  const duration = endMin ? endMin - startMin : 60;
  const height = Math.max((duration / 60) * hourHeight, 28);

  const color = apt.color || "#3B82F6";
  const isCompleted = apt.status === "completed";
  const isCancelled = apt.status === "cancelled";

  return (
    <div
      className="absolute left-1 right-1 rounded-md px-2 py-1 overflow-hidden cursor-pointer group transition-all hover:z-10 hover:shadow-lg"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: `${color}20`,
        borderLeft: `3px solid ${color}`,
        opacity: isCompleted || isCancelled ? 0.5 : 1,
      }}
      title={apt.title}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium truncate"
            style={{ color }}
          >
            {apt.start_time?.substring(0, 5)} {apt.title}
          </p>
          {height >= 44 && apt.location && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-0.5 truncate">
              <RiMapPinLine size={10} />
              {apt.location}
            </p>
          )}
        </div>

        {apt.status === "upcoming" && (
          <div className="flex-shrink-0 hidden group-hover:flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete?.(apt._id);
              }}
              className="p-0.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
              title={t("Complete")}
            >
              <RiCheckLine size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel?.(apt._id);
              }}
              className="p-0.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
              title={t("Cancel")}
            >
              <RiCloseLine size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HourlyTimeline({ date }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const containerRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [completeAppointment] = useCompleteAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();

  const isToday = !date || date === new Date().toISOString().split("T")[0];

  const { data: appointments = [], isLoading } = useGetTodayAppointmentsQuery(
    undefined,
    { skip: !isToday }
  );

  useEffect(() => {
    if (!isToday) return;
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, [isToday]);

  // Scroll to current time on mount
  useEffect(() => {
    if (!isToday || !containerRef.current) return;
    const now = new Date();
    const minutesFromMidnight = now.getHours() * 60 + now.getMinutes();
    const minutesFromStartTime = minutesFromMidnight - START_HOUR * 60;
    if (minutesFromStartTime > 0) {
      const scrollTop = (minutesFromStartTime / 60) * HOUR_HEIGHT - 100;
      containerRef.current.scrollTop = Math.max(0, scrollTop);
    }
  }, [isToday]);

  const currentTimeTop = useMemo(() => {
    if (!isToday) return null;
    const h = currentTime.getHours();
    const m = currentTime.getMinutes();
    const totalMin = h * 60 + m;
    if (totalMin < START_HOUR * 60 || totalMin > END_HOUR * 60) return null;
    return ((totalMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  }, [currentTime, isToday]);

  const hours = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hours.push(h);
  }

  const formatHour = (h) => {
    if (isArabic) {
      const period = h >= 12 ? "م" : "ص";
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${display} ${period}`;
    }
    const period = h >= 12 ? "PM" : "AM";
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${display} ${period}`;
  };

  const handleComplete = async (id) => {
    try {
      await completeAppointment(id).unwrap();
    } catch {}
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id).unwrap();
    } catch {}
  };

  const totalHeight = (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {t("Schedule")}
        </h3>
      </div>

      <div
        ref={containerRef}
        className="overflow-y-auto"
        style={{ maxHeight: "520px" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400 text-sm">
            {t("Loading...")}
          </div>
        ) : (
          <div className="flex">
            {/* Hour labels */}
            <div className="flex-shrink-0 w-14 relative" style={{ height: `${totalHeight}px` }}>
              {hours.map((h) => (
                <div
                  key={h}
                  className="absolute w-full flex items-start justify-end pr-2"
                  style={{ top: `${(h - START_HOUR) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                >
                  <span className="text-xs text-gray-400 dark:text-gray-500 leading-none">
                    {formatHour(h)}
                  </span>
                </div>
              ))}
            </div>

            {/* Grid + blocks */}
            <div
              className="flex-1 relative border-l border-gray-100 dark:border-gray-700"
              style={{ height: `${totalHeight}px` }}
            >
              {/* Hour lines */}
              {hours.map((h) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 border-t border-gray-100 dark:border-gray-700"
                  style={{ top: `${(h - START_HOUR) * HOUR_HEIGHT}px` }}
                />
              ))}

              {/* Half-hour lines */}
              {hours.map((h) => (
                <div
                  key={`half-${h}`}
                  className="absolute left-0 right-0 border-t border-dashed border-gray-50 dark:border-gray-700/50"
                  style={{ top: `${(h - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }}
                />
              ))}

              {/* Appointment blocks */}
              {appointments.map((apt) => (
                <AppointmentBlock
                  key={apt._id}
                  apt={apt}
                  hourHeight={HOUR_HEIGHT}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              ))}

              {/* Current time red line */}
              {currentTimeTop !== null && (
                <div
                  className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                  style={{ top: `${currentTimeTop}px` }}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 -ml-1" />
                  <div className="flex-1 h-0.5 bg-red-500" />
                </div>
              )}

              {/* Empty state */}
              {appointments.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("No appointments today")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HourlyTimeline;
