"use client";

import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { RiTableLine, RiLayoutColumnLine } from "react-icons/ri";

function ViewToggle({ activeView, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
      <button
        onClick={() => onChange("table")}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
          activeView === "table"
            ? "bg-white dark:bg-gray-700 text-primary-500 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        title={t("Table View")}
      >
        <RiTableLine size={14} />
        <span className="hidden sm:inline">{t("Table")}</span>
      </button>
      <button
        onClick={() => onChange("kanban")}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
          activeView === "kanban"
            ? "bg-white dark:bg-gray-700 text-primary-500 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        title={t("Kanban View")}
      >
        <RiLayoutColumnLine size={14} />
        <span className="hidden sm:inline">{t("Kanban")}</span>
      </button>
    </div>
  );
}

ViewToggle.propTypes = {
  activeView: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ViewToggle;
