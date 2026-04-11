
import MembersListXLine from "./MembersListXLine.jsx";
import StateOfTask from "./StateOfTask.jsx";
import PropTypes from "prop-types";
import StarRating from "@/components/StarRating.jsx";
import ProjectRatingModal from "@/app/(dashboard)/projects/_modal/ProjectRatingModal.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { translateDate } from "@/functions/Days.js";
import { RiArrowDownSLine } from "react-icons/ri";


function TasksList({ tasks = [], isAssignedDate = false, isEmployeeView = false, onStatusChange }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeStatusId, setActiveStatusId] = useState(null);
    const { t } = useTranslation()

    const statusOptions = [
        { id: "open", name: "Open" },
        { id: "pending", name: "Pending" },
        { id: "in-progress", name: "In Progress" },
        { id: "completed", name: "Completed" },
        { id: "rejected", name: "Rejected" },
        { id: "cancelled", name: "Cancelled" },
    ];

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            if (onStatusChange) {
                await onStatusChange(taskId, newStatus);
            }
            setActiveStatusId(null);
        } catch (err) {
            console.error("Failed to update task status:", err);
        }
    };

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
                    <div key={task._id || index} className={"p-3 flex flex-col gap-3 hover:bg-status-bg transition-colors border-b border-status-border last:border-0"}>
                        <div className={"header-task-project flex justify-between items-start"}>
                            <div className="flex flex-col gap-1">
                                <p className={"text-sm font-semibold text-cell-primary"}>{task.name || task.title}</p>
                                <div className={"delivery flex gap-1 items-center relative"}>
                                    {isEmployeeView ? (
                                        <div className="relative">
                                            <button 
                                                onClick={() => setActiveStatusId(activeStatusId === task._id ? null : task._id)}
                                                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                                            >
                                                <StateOfTask type={task.delivery || task.status} timeLate={task.timeLate} />
                                                <RiArrowDownSLine className="text-soft-400" size={14} />
                                            </button>
                                            
                                            {activeStatusId === task._id && (
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-10" 
                                                        onClick={() => setActiveStatusId(null)}
                                                    />
                                                    <div className="absolute top-full left-0 mt-1 w-32 bg-surface border border-status-border rounded-lg shadow-xl z-20 py-1">
                                                        {statusOptions.map((opt) => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => handleStatusChange(task._id, opt.id)}
                                                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-status-bg transition-colors ${
                                                                    (task.delivery || task.status) === opt.id ? 'text-primary-500 font-semibold' : 'text-cell-primary'
                                                                }`}
                                                            >
                                                                {t(opt.name)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <StateOfTask type={task.delivery || task.status} timeLate={task.timeLate} />
                                    )}
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
                                <p className={"text-cell-secondary text-xs"}>{t("Assigned to")}:</p>
                                <MembersListXLine members={task.members} maxVisible={3} />
                            </div>

                            {
                                isAssignedDate && (task.assignedDate || task.dueDate) &&
                                <div className={"flex gap-4 items-center"}>
                                    {task.assignedDate && (
                                        <div className="flex flex-col">
                                            <span className={"text-cell-secondary text-[10px] uppercase tracking-wider"}>{t("Assigned")}:</span>
                                            <span className="text-xs text-cell-primary">{translateDate(task.assignedDate)}</span>
                                        </div>
                                    )}
                                    {task.dueDate && (
                                        <div className="flex flex-col">
                                            <span className={"text-cell-secondary text-[10px] uppercase tracking-wider"}>{t("Due")}:</span>
                                            <span className="text-xs text-cell-primary">{translateDate(task.dueDate)}</span>
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
    isAssignedDate: PropTypes.bool,
    isEmployeeView: PropTypes.bool,
    onStatusChange: PropTypes.func
}

export default TasksList;