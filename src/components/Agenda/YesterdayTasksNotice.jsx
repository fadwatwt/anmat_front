"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format, subDays } from "date-fns";
import {
  useGetDailyTasksQuery,
  useUpdateDailyTaskMutation,
} from "@/redux/appointments/appointmentsApi";
import { RiArrowRightLine, RiCloseLine, RiHistoryLine } from "react-icons/ri";

function YesterdayTasksNotice() {
  const { t } = useTranslation();

  const [dismissed, setDismissed] = useState(false);
  const [moved, setMoved] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: yesterdayTasks = [] } = useGetDailyTasksQuery({ date: yesterday });
  const [updateDailyTask] = useUpdateDailyTaskMutation();

  const incompleteTasks = yesterdayTasks.filter((t) => t.status !== "completed");

  // Don't render if no incomplete tasks or already dismissed/moved
  if (incompleteTasks.length === 0 || dismissed || moved) return null;

  const handleMoveToToday = async () => {
    setIsMoving(true);
    try {
      await Promise.all(
        incompleteTasks.map((task) =>
          updateDailyTask({ id: task._id, date: today }).unwrap()
        )
      );
      setMoved(true);
    } catch {
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 flex items-center gap-3">
      <RiHistoryLine
        size={18}
        className="text-amber-600 dark:text-amber-400 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
          {t("You have {{count}} incomplete tasks from yesterday", { count: incompleteTasks.length })}
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-400 truncate">
          {incompleteTasks
            .slice(0, 2)
            .map((t) => t.title)
            .join("، ")}
          {incompleteTasks.length > 2 && ` +${incompleteTasks.length - 2}`}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleMoveToToday}
          disabled={isMoving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-800/50 hover:bg-amber-200 dark:hover:bg-amber-700/50 rounded-lg transition-colors disabled:opacity-50"
        >
          <RiArrowRightLine size={14} />
          {isMoving ? t("Moving...") : t("Move to today")}
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 rounded transition-colors"
          title={t("Dismiss")}
        >
          <RiCloseLine size={16} />
        </button>
      </div>
    </div>
  );
}

export default YesterdayTasksNotice;
