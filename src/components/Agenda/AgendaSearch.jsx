"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSearchAppointmentsQuery } from "@/redux/appointments/appointmentsApi";
import { useSearchDailyTasksQuery } from "@/redux/appointments/appointmentsApi";
import { RiSearchLine, RiCloseLine, RiCalendarLine, RiTaskLine } from "react-icons/ri";

function AgendaSearch() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const { data: appointmentResults = [] } = useSearchAppointmentsQuery(
    { search: query },
    { skip: query.length < 2 }
  );
  const { data: taskResults = [] } = useSearchDailyTasksQuery(
    { search: query },
    { skip: query.length < 2 }
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type, id) => {
    setIsOpen(false);
    setQuery("");
    if (type === "appointment") {
      router.push(`/appointments/${id}`);
    }
  };

  const hasResults = appointmentResults.length > 0 || taskResults.length > 0;
  const showDropdown = isOpen && query.length >= 2;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <RiSearchLine
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t("Search agenda...")}
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RiCloseLine size={18} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
          {!hasResults ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {t("No results found")}
            </div>
          ) : (
            <div className="py-2">
              {appointmentResults.length > 0 && (
                <div>
                  <div className="px-4 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <RiCalendarLine size={12} />
                    {t("Appointments")}
                  </div>
                  {appointmentResults.map((apt) => (
                    <button
                      key={apt._id}
                      onClick={() => handleSelect("appointment", apt._id)}
                      className="w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3"
                    >
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: apt.color || "#3B82F6" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {apt.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {apt.date} • {apt.start_time?.substring(0, 5)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {taskResults.length > 0 && (
                <div>
                  <div className="px-4 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <RiTaskLine size={12} />
                    {t("Daily Tasks")}
                  </div>
                  {taskResults.map((task) => (
                    <button
                      key={task._id}
                      onClick={() => setIsOpen(false)}
                      className="w-full px-4 py-2 text-right hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3"
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0 bg-green-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {task.date} • {task.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AgendaSearch;
