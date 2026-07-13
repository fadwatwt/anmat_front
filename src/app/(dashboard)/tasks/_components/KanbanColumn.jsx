"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
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
  const { t } = useTranslation();

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
          backgroundColor: column.bgColor,
          borderBottomColor: column.color,
        }}
      >
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: column.color }} />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {t(column.label)}
          </span>
        </div>
        <span
          className="flex items-center justify-center min-w-[22px] h-[22px] rounded-full text-[11px] font-bold"
          style={{
            backgroundColor: column.color,
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
            : "bg-gray-50 dark:bg-gray-900/50"
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[80px]">
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              {t("No tasks")}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanTaskCard key={task._id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}

KanbanColumn.propTypes = {
  column: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
};

export default KanbanColumn;
