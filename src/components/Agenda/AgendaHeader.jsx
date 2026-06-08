"use client";

import { useTranslation } from "react-i18next";
import AgendaSearch from "./AgendaSearch";
import { RiAddLine, RiCalendarScheduleLine, RiTaskLine } from "react-icons/ri";

function AgendaHeader({ view, setView, onAdd }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === "calendar"
                ? "bg-white dark:bg-gray-600 text-primary-600 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <RiCalendarScheduleLine size={16} />
            {t("Calendar")}
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === "list"
                ? "bg-white dark:bg-gray-600 text-primary-600 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <RiTaskLine size={16} />
            {t("Tasks")}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex-1 sm:flex-initial sm:w-64">
          <AgendaSearch />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
        >
          <RiAddLine size={16} />
          <span className="hidden sm:inline">{t("Add")}</span>
        </button>
      </div>
    </div>
  );
}

export default AgendaHeader;
