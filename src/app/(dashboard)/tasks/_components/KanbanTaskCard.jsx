"use client";

import { useDraggable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { PRIORITY_COLORS } from "./kanbanConstants";
import { convertToSlug } from "@/functions/AnotherFunctions";
import { translateDate } from "@/functions/Days";
import { RiCalendarLine } from "react-icons/ri";

function KanbanTaskCard({ task }) {
  const { t } = useTranslation();
  const router = useRouter();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: { task },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const priorityConfig = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  const priorityLabel = task.priority ? t(task.priority.charAt(0).toUpperCase() + task.priority.slice(1)) : "";

  const handleClick = (e) => {
    if (isDragging) return;
    e.stopPropagation();
    router.push(`/tasks/${task._id}-${convertToSlug(task.title)}/details`);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={handleClick}
      className={`group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 ${
        isDragging ? "opacity-50 shadow-lg scale-105 z-50" : ""
      }`}
    >
      {/* Title */}
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-2 leading-snug">
        {task.title}
      </p>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mb-2">
          {task.description}
        </p>
      )}

      {/* Priority + Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}>
          {priorityLabel}
        </span>
        {task.progress > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-12 bg-gray-100 dark:bg-gray-700 rounded-full h-1">
              <div
                className="bg-primary-500 h-1 rounded-full transition-all"
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{task.progress}%</span>
          </div>
        )}
      </div>

      {/* Footer: Assignee + Due Date */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50">
        {/* Assignee */}
        <div className="flex items-center gap-1 min-w-0">
          {task.assignee ? (
            <>
              <img
                className="w-5 h-5 rounded-full shrink-0 object-cover"
                src={task.assignee.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name || "U")}&size=20`}
                alt=""
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[60px]">
                {task.assignee.name || t("Unassigned")}
              </span>
            </>
          ) : (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">{t("Unassigned")}</span>
          )}
        </div>

        {/* Due Date */}
        {task.due_date && (
          <div className="flex items-center gap-1">
            <RiCalendarLine size={10} className="text-gray-400 dark:text-gray-500 shrink-0" />
            <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {translateDate(task.due_date)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

KanbanTaskCard.propTypes = {
  task: PropTypes.object.isRequired,
};

export default KanbanTaskCard;
