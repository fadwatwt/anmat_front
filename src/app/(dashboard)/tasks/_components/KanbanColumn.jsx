"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@/app/providers";
import KanbanTaskCard from "./KanbanTaskCard";
import { RiCheckLine, RiTimerLine, RiPlayCircleLine, RiCloseCircleLine, RiQuestionLine, RiStopCircleLine, RiCheckboxCircleLine } from "react-icons/ri";

const COLUMN_ICONS = {
  "open": RiPlayCircleLine,
  "pending": RiTimerLine,
  "in-progress": RiTimerLine,
  "completed": RiCheckboxCircleLine,
  "done": RiCheckLine,
  "rejected": RiCloseCircleLine,
  "cancelled": RiStopCircleLine,
};

function KanbanColumn({ column, tasks }) {
  const { t, i18n } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(30);
  const [theme] = useTheme();
  const isDark = theme === "dark";

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const Icon = COLUMN_ICONS[column.id] || RiQuestionLine;

  return (
    <div
      className={`flex flex-col min-w-[270px] max-w-[300px] w-full rounded-2xl transition-all ${
        isOver ? "ring-2 ring-primary-400 ring-opacity-50" : ""
      }`}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-2xl border-b-2"
        style={{
          backgroundColor: isDark ? column.darkBgColor : column.bgColor,
          borderBottomColor: isDark ? column.darkBorderColor : column.color,
        }}
      >
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: isDark ? column.darkBorderColor : column.color }} />
          <span className="text-sm font-semibold text-cell-secondary">
            {t(column.label)}
          </span>
        </div>
        <span
          className="flex items-center justify-center min-w-[22px] h-[22px] rounded-full text-[11px] font-bold"
          style={{
            backgroundColor: isDark ? column.darkBorderColor : column.color,
            color: "#fff",
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-2 p-2 rounded-b-2xl min-h-[120px] transition-colors ${
          isOver
            ? "bg-primary-50/50 dark:bg-primary-900/10"
            : "bg-status-bg"
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[80px]">
            <p className="text-xs text-cell-secondary italic">
              {t("No tasks")}
            </p>
          </div>
        ) : (
          tasks.slice(0, visibleCount).map((task) => (
            <KanbanTaskCard key={task._id} task={task} />
          ))
        )}
        {tasks.length > visibleCount && <button type="button" onClick={() => setVisibleCount((count) => count + 30)} className="rounded-lg border border-status-border p-2 text-sm text-cell-secondary">{i18n.language?.startsWith("ar") ? "عرض المزيد من البطاقات" : "Show more cards"}</button>}
      </div>
    </div>
  );
}

KanbanColumn.propTypes = {
  column: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
};

export default KanbanColumn;
