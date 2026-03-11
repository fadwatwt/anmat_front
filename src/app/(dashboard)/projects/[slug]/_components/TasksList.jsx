
import MembersListXLine from "./MembersListXLine.jsx";
import StateOfTask from "./StateOfTask.jsx";
import PropTypes from "prop-types";
import StarRating from "@/components/StarRating.jsx";
import ProjectRatingModal from "@/app/(dashboard)/projects/_modal/ProjectRatingModal.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { translateDate } from "@/functions/Days.js";


function TasksList({ tasks = [], isAssignedDate = false }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const { t } = useTranslation()

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-soft-400">
                <p className="text-sm">{t("No tasks found for this project")}</p>
            </div>
        );
    }

    return (
        <div className={"max-h-[500px] flex flex-col w-full overflow-hidden overflow-y-auto custom-scroll"}>
            {
                tasks.map((task, index) => (
                    <div key={task._id || index} className={"p-3 flex flex-col gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"}>
                        <div className={"header-task-project flex justify-between items-start"}>
                            <div className="flex flex-col gap-1">
                                <p className={"text-sm font-medium text-gray-900 dark:text-gray-100"}>{task.name || task.title}</p>
                                <div className={"delivery flex gap-1 items-center"}>
                                    <StateOfTask type={task.delivery || task.status} timeLate={task.timeLate} />
                                    {task.priority && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase ${
                                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {t(task.priority)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <StarRating onClickRate={() => setSelectedTask(task)} rating={task.rate} />
                        </div>
                        
                        <div className="flex flex-wrap justify-between items-center gap-2">
                            <div className={"members flex gap-2 items-center"}>
                                <p className={"text-soft-400 text-xs dark:text-gray-400"}>{t("Assigned to")}:</p>
                                <MembersListXLine members={task.members} maxVisible={3} />
                            </div>

                            {
                                isAssignedDate && (task.assignedDate || task.dueDate) &&
                                <div className={"flex gap-4 items-center"}>
                                    {task.assignedDate && (
                                        <div className="flex flex-col">
                                            <span className={"text-soft-400 text-[10px] uppercase tracking-wider dark:text-gray-500"}>{t("Assigned")}:</span>
                                            <span className="text-xs text-gray-700 dark:text-gray-300">{translateDate(task.assignedDate)}</span>
                                        </div>
                                    )}
                                    {task.dueDate && (
                                        <div className="flex flex-col">
                                            <span className={"text-soft-400 text-[10px] uppercase tracking-wider dark:text-gray-500"}>{t("Due")}:</span>
                                            <span className="text-xs text-gray-700 dark:text-gray-300">{translateDate(task.dueDate)}</span>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                ))

            }
            {selectedTask && (
                <ProjectRatingModal
                    project={selectedTask}
                    isOpen={true}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
}

TasksList.propTypes = {
    tasks: PropTypes.array.isRequired,
    isAssignedDate: PropTypes.bool
}

export default TasksList;