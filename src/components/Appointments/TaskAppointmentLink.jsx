"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetSubscriberTasksQuery } from "@/redux/tasks/subscriberTasksApi";
import {
  useLinkTaskToAppointmentMutation,
  useUnlinkTaskFromAppointmentMutation,
} from "@/redux/appointments/appointmentsApi";
import { RiLink, RiUnlink, RiCloseLine, RiSearchLine } from "react-icons/ri";

function TaskAppointmentLink({ appointment, onLinked }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tasks = [] } = useGetSubscriberTasksQuery();
  const [linkTask] = useLinkTaskToAppointmentMutation();
  const [unlinkTask] = useUnlinkTaskFromAppointmentMutation();

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLink = async (taskId) => {
    try {
      await linkTask({
        appointmentId: appointment._id,
        taskId,
      }).unwrap();
      setIsOpen(false);
      onLinked?.();
    } catch (error) {
      console.error("Failed to link task:", error);
    }
  };

  const handleUnlink = async () => {
    try {
      await unlinkTask(appointment._id).unwrap();
      onLinked?.();
    } catch (error) {
      console.error("Failed to unlink task:", error);
    }
  };

  return (
    <>
      {appointment.task ? (
        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate">
              📋 {appointment.task.title}
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-400">
              {appointment.task.status} • {appointment.task.priority}
            </p>
          </div>
          <button
            onClick={handleUnlink}
            className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            title={t("Unlink Task")}
          >
            <RiUnlink size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <RiLink size={16} />
          {t("Link to Task")}
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t("Link to Task")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-3">
                <RiSearchLine
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("Search tasks...")}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>

              <div className="max-h-64 overflow-y-auto">
                {filteredTasks.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    {t("No tasks found")}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {filteredTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleLink(task._id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {task.status} • {task.priority}
                          </p>
                        </div>
                        <RiLink
                          size={16}
                          className="text-gray-400 flex-shrink-0"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskAppointmentLink;
