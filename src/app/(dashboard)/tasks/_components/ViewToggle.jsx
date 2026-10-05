"use client";

import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { RiTableLine, RiLayoutColumnLine } from "react-icons/ri";

function ViewToggle({ activeView, onChange }) {
  const { t } = useTranslation();

  const btnBase = "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base";

  return (
    <div className="flex items-center bg-status-bg border border-status-border rounded-xl p-1 gap-1">
      <button
        onClick={() => onChange("table")}
        className={`${btnBase} ${
          activeView === "table"
            ? "bg-surface text-primary-600 dark:text-primary-200 shadow-sm border border-status-border"
            : "text-cell-secondary hover:text-cell-primary border border-transparent"
        }`}
        title={t("Table View")}
        aria-pressed={activeView === "table"}
      >
        <RiTableLine size={14} />
        <span>{t("Table")}</span>
      </button>
      <button
        onClick={() => onChange("kanban")}
        className={`${btnBase} ${
          activeView === "kanban"
            ? "bg-surface text-primary-600 dark:text-primary-200 shadow-sm border border-status-border"
            : "text-cell-secondary hover:text-cell-primary border border-transparent"
        }`}
        title={t("Kanban View")}
        aria-pressed={activeView === "kanban"}
      >
        <RiLayoutColumnLine size={14} />
        <span>{t("Kanban")}</span>
      </button>
    </div>
  );
}

ViewToggle.propTypes = {
  activeView: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ViewToggle;
