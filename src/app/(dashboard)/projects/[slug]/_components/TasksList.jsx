import MembersListXLine from "./MembersListXLine.jsx";
import StateOfTask from "./StateOfTask.jsx";
import PropTypes from "prop-types";
import StarRating from "@/components/StarRating.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert.jsx";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";
import { usePermission } from "@/Hooks/usePermission";
import { useTranslation } from "react-i18next";
import { useGetSubscriberOrganizationQuery } from "@/redux/organizations/organizationsApi";
import CreateTeamModal from "@/app/(dashboard)/projects/_modal/CreateTeamModal";
import { translateDate } from "@/functions/Days.js";
import { RiArrowDownSLine, RiFlag2Line, RiStackLine, RiGroupFill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import { useEvaluateSubscriberTaskStageMutation, useEvaluateSubscriberTaskMutation, useUploadSubscriberTaskAttachmentMutation, useDeleteSubscriberTaskAttachmentMutation } from "@/redux/tasks/subscriberTasksApi";
import { useUploadEmployeeTaskAttachmentMutation, useDeleteEmployeeTaskAttachmentMutation } from "@/redux/tasks/employeeTasksApi";
import AttachmentsList from "./AttachmentsList";
import TaskLogsViewer from "./TaskLogsViewer";

// Evaluation Modal components
import Modal from "@/components/Modal/Modal";
import StarRatingInput from "@/components/Form/StarRatingInput";
import FileUpload from "@/components/Form/FileUpload";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";

// Simple inline stage rating modal
const toKey = (str) => str.toLowerCase().replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_]/gu, '');

const DEFAULT_RATING_TYPES = ['Time Evaluation', 'Content Quality', 'Video Quality'];

function StageRatingModal({ stage, task, onClose, onSubmit }) {
    const { t } = useTranslation();
    const { data: orgData } = useGetSubscriberOrganizationQuery();

    const categories = useMemo(() => {
        const types = orgData?.rating_types;
        if (Array.isArray(types) && types.length > 0) {
            return types.map((item) => {
                if (typeof item === 'string') return { key: toKey(item), title: item };
                return { key: item._id || toKey(item.title), title: item.title };
            });
        }
        return DEFAULT_RATING_TYPES.map((title) => ({ key: toKey(title), title }));
    }, [orgData]);

    const backendKeyMap = useMemo(() => {
        const fixedKeys = ['rate_time', 'rate_content', 'rate_video'];
        const map = {};
        categories.forEach((cat, idx) => {
            map[cat.key] = fixedKeys[idx] || null;
        });
        return map;
    }, [categories]);

    const [ratings, setRatings] = useState({});
    const [comment, setComment] = useState("");
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        if (!stage || categories.length === 0) return;

        const init = {};
        categories.forEach((cat) => { init[cat.key] = 0; });

        const fixedKeys = ['rate_time', 'rate_content', 'rate_video'];
        categories.forEach((cat, idx) => {
            const fixedKey = fixedKeys[idx];
            if (fixedKey && stage[fixedKey]) {
                init[cat.key] = stage[fixedKey];
            }
        });

        if (stage.evaluation_criteria && typeof stage.evaluation_criteria === 'object') {
            Object.entries(stage.evaluation_criteria).forEach(([key, value]) => {
                if (key in init) {
                    init[key] = value;
                }
            });
        }

        setRatings(init);
        setComment(stage.comment || "");
        setAttachment(null);
    }, [stage, categories]);

    const handleRatingChange = (key, value) => {
        setRatings(prev => ({ ...prev, [key]: value }));
    };

    const avgScore = useMemo(() => {
        const values = Object.values(ratings);
        const sum = values.reduce((acc, curr) => acc + curr, 0);
        return sum / (values.length || 1);
    }, [ratings]);

    const handleSubmit = () => {
        const values = Object.values(ratings);
        const avgScore = values.length > 0 ? values.reduce((acc, curr) => acc + curr, 0) / values.length : 0;

        const backendRatings = {};
        Object.entries(ratings).forEach(([key, value]) => {
            const backendKey = backendKeyMap[key];
            if (backendKey) {
                backendRatings[backendKey] = value;
            }
        });

        onSubmit({
            score: avgScore,
            ratings: backendRatings,
            evaluation_criteria: ratings,
            comment,
            attachment
        });
    };

    if (!stage) return null;

    const allZero = Object.values(ratings).every(v => v === 0);

    return (
        <Modal
            isOpen={!!stage}
            onClose={onClose}
            title={`${task.stages?.length > 0 ? t("Evaluate Stage") : t("Evaluate Task")}: ${stage.name || stage.title}`}
            isBtns={true}
            btnApplyTitle={t("Submit Evaluation")}
            onClick={handleSubmit}
            disabled={allZero}
            className="lg:w-[500px] md:w-8/12 sm:w-10/12 w-11/12 p-6"
        >
            <div className="flex flex-col gap-6 py-2">
                <div className="space-y-6 bg-gray-50/50 dark:bg-gray-900 p-4 rounded-xl border border-status-border">
                    {categories.map((cat) => (
                        <StarRatingInput
                            key={cat.key}
                            title={t(cat.title)}
                            value={ratings[cat.key] || 0}
                            onChange={(val) => handleRatingChange(cat.key, val)}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <TextAreaWithLabel
                        label={`${t("Add a Comment")} (${t("Optional")})`}
                        placeholder={t("Write your comments here...")}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                    />

                    <div>
                        <label className="text-sm font-medium text-cell-secondary mb-2 block">{t("Attachments")} ({t("Optional")})</label>
                        <FileUpload
                            onFileChange={(file) => setAttachment(file)}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

StageRatingModal.propTypes = {
    stage: PropTypes.object,
    task: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
};


function TasksList({ tasks = [], isAssignedDate = false, isEmployeeView = false, onStatusChange, onEvaluateStage }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeStatusId, setActiveStatusId] = useState(null);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, status: "", message: "" });
    const [teamModalTaskId, setTeamModalTaskId] = useState(null);

    const { t } = useTranslation()
    const user = useSelector(selectUser);
    const canDeleteAttachments = usePermission("attachments.delete");
    const canEvaluate = usePermission("tasks.evaluate");
    const canManageTeam = usePermission("tasks.manage_participants");

    const [evaluateStage] = useEvaluateSubscriberTaskStageMutation();
    const [evaluateTask] = useEvaluateSubscriberTaskMutation();
    const [uploadSubscriberTaskAttachment, { isLoading: isSubUploading }] = useUploadSubscriberTaskAttachmentMutation();
    const [uploadEmployeeTaskAttachment, { isLoading: isEmpUploading }] = useUploadEmployeeTaskAttachmentMutation();
    const [deleteSubscriberTaskAttachment] = useDeleteSubscriberTaskAttachmentMutation();
    const [deleteEmployeeTaskAttachment] = useDeleteEmployeeTaskAttachmentMutation();

    const isUploading = isSubUploading || isEmpUploading;

    const handleTaskUploadAttachment = async (taskId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (!isEmployeeView) {
                await uploadSubscriberTaskAttachment({ taskId, formData }).unwrap();
            } else {
                await uploadEmployeeTaskAttachment({ taskId, formData }).unwrap();
            }
        } catch (error) {
            console.error("Failed to upload task attachment: ", error);
        }
    };

    const handleTaskDeleteAttachment = async (taskId, attachmentId) => {
        try {
            if (!isEmployeeView) {
                await deleteSubscriberTaskAttachment({ taskId, attachmentId }).unwrap();
            } else {
                await deleteEmployeeTaskAttachment({ taskId, attachmentId }).unwrap();
            }
        } catch (error) {
            console.error("Failed to delete task attachment: ", error);
        }
    };

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

    const handleStageRatingSubmit = async ({ score, ratings, evaluation_criteria, comment, attachment }) => {
        if (!selectedTask?.activeStage) return;
        const stageId = selectedTask.activeStage._id;
        const taskId = selectedTask.taskId || selectedTask._id;

        const evaluationData = {
            score,
            rate_time: ratings.rate_time || 0,
            rate_content: ratings.rate_content || 0,
            rate_video: ratings.rate_video || 0,
            evaluation_criteria: evaluation_criteria || {},
            comment: comment || "",
            attachment: attachment?.name || null,
        };

        try {
            if (onEvaluateStage) {
                await onEvaluateStage(stageId, evaluationData);
            } else if (selectedTask.stages?.length > 0) {
                await evaluateStage({
                    taskId: taskId,
                    stageId: stageId,
                    data: evaluationData
                }).unwrap();
            } else {
                await evaluateTask({
                    taskId: taskId,
                    data: evaluationData
                }).unwrap();
            }

            setAlertConfig({
                isOpen: true,
                status: "success",
                message: selectedTask.stages?.length > 0 ? t("Stage evaluated successfully") : t("Task evaluated successfully")
            });
            setSelectedTask(null);
        } catch (err) {
            console.error("Stage evaluation failed:", err);
            setAlertConfig({
                isOpen: true,
                status: "error",
                message: t("Failed to submit evaluation")
            });
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
        <div className={"max-h-[600px] flex flex-col w-full overflow-y-auto custom-scroll pb-32"}>
            {
                tasks.map((task, index) => (
                    <div key={task._id || index} className={"p-3 flex flex-col gap-3 hover:bg-status-bg transition-colors border-b border-status-border last:border-0"}>
                        <div className={"header-task-project flex justify-between items-start"}>
                            <div className="flex flex-col gap-1">
                                <p className={"text-sm font-semibold text-cell-primary"}>{task.name || task.title}</p>
                                <div className={"delivery flex gap-1 items-center relative"}>
                                    {(() => {
                                        const userId = user?._id?.toString();
                                        const assigneeId = (task.assignee_id?._id || task.assignee_id || task.assignee?._id)?.toString();

                                        const isAssignee = !!userId && !!assigneeId && userId === assigneeId;
                                        const isSubscriber = user?.type === "Subscriber";
                                        const hasPermission = Array.isArray(user?.permissions) && (
                                            user.permissions.includes('manage_tasks') ||
                                            user.permissions.includes('edit_tasks') ||
                                            user.permissions.includes('update_tasks')
                                        );

                                        const canChangeStatus = isEmployeeView && (isAssignee || isSubscriber || hasPermission);

                                        return (
                                            <div className="relative">
                                                <button
                                                    onClick={canChangeStatus ? () => setActiveStatusId(activeStatusId === task._id ? null : task._id) : undefined}
                                                    className={`flex items-center gap-1 transition-all ${canChangeStatus ? 'hover:opacity-80 cursor-pointer' : 'opacity-50 cursor-not-allowed filter grayscale'}`}
                                                    disabled={!canChangeStatus}
                                                    title={!canChangeStatus ? t('Only assigned employee or subscriber can change status') : ''}
                                                >
                                                    <StateOfTask type={task.delivery || task.status} timeLate={task.timeLate} />
                                                    <RiArrowDownSLine className="text-soft-400" size={14} />
                                                </button>

                                                {canChangeStatus && activeStatusId === task._id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={() => setActiveStatusId(null)}
                                                        />
                                                        <div className="absolute top-full left-0 mt-1 w-32 bg-surface border border-status-border rounded-lg shadow-xl z-50 py-1">
                                                            {statusOptions.map((opt) => (
                                                                <button
                                                                    key={opt.id}
                                                                    onClick={() => handleStatusChange(task._id, opt.id)}
                                                                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-status-bg transition-colors ${(task.delivery || task.status) === opt.id ? 'text-primary-500 dark:text-primary-400 font-semibold' : 'text-cell-primary'
                                                                        }`}
                                                                >
                                                                    {t(opt.name)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })()}
                                    {task.priority && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                            task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {t(task.priority)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <StarRating
                                onClickRate={canEvaluate ? () => setSelectedTask(task.stages?.length > 0 ? task : { ...task, activeStage: task }) : null}
                                rating={task.rate}
                            />
                        </div>

                        <div className="flex flex-wrap justify-between items-center gap-2">
                            <div className={"members flex gap-2 items-center"}>
                                <p className={"text-cell-secondary text-xs"}>{t("Assigned to")}:</p>
                                <MembersListXLine members={task.members} maxVisible={3} />
                            </div>

                            <div className="flex gap-4 items-center">
                                {(canManageTeam && false) && (
                                    <button
                                        onClick={() => setTeamModalTaskId(task._id)}
                                        className="flex items-center gap-1 text-xs font-medium text-primary-base dark:text-primary-200 border border-primary-base rounded-md px-2 py-0.5 hover:bg-primary-base dark:hover:bg-primary-200 hover:text-white dark:hover:text-black transition-colors"
                                    >
                                        <RiGroupFill size={12} />
                                        <span>{t("Team")}</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-primary-base dark:text-primary-200 hover:opacity-80 transition-opacity"
                                >
                                    <RiStackLine size={14} />
                                    <span>{task.stages?.length || 0} {t("Stages")}</span>
                                    <RiArrowDownSLine className={`transition-transform ${expandedTaskId === task._id ? 'rotate-180' : ''}`} size={14} />
                                </button>

                                {
                                    isAssignedDate && (task.assignedDate || task.dueDate) &&
                                    <div className={"flex gap-4 items-center"}>
                                        {task.assignedDate && (
                                            <div className="flex flex-col">
                                                <span className={"text-cell-secondary text-[10px] capitalize"}>{t("Assigned")}:</span>
                                                <span className="text-xs text-cell-primary">{translateDate(task.assignedDate)}</span>
                                            </div>
                                        )}
                                        {task.dueDate && (
                                            <div className="flex flex-col">
                                                <span className={"text-cell-secondary text-[10px] capitalize"}>{t("Due")}:</span>
                                                <span className="text-xs text-cell-primary">{translateDate(task.dueDate)}</span>
                                            </div>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>

                        {expandedTaskId === task._id && (
                            <div className="mt-2 pl-4 border-l-2 border-primary-100 dark:border-primary-500/20 flex flex-col gap-4 py-2">
                                {task.stages?.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        {task.stages.map((stage, sIdx) => (
                                            <div key={stage._id || sIdx} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-2">
                                                    <RiFlag2Line size={12} className={stage.status === 'completed' ? 'text-green-500' : 'text-soft-400'} />
                                                    <span className="text-xs text-cell-primary font-medium">{stage.name}</span>
                                                    <span className={`text-[9px] px-1 rounded capitalize font-bold ${stage.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                                                        }`}>
                                                        {t(stage.status)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <StarRating
                                                        rating={stage.rate}
                                                        onClickRate={canEvaluate ? () => setSelectedTask({ ...task, activeStage: stage }) : null}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-2">
                                    <AttachmentsList
                                        attachments={task.attachments || []}
                                        onUpload={(file) => handleTaskUploadAttachment(task._id, file)}
                                        onDelete={canDeleteAttachments ? (attachmentId) => handleTaskDeleteAttachment(task._id, attachmentId) : null}
                                        isUploading={isUploading}
                                    />
                                </div>
                                <TaskLogsViewer taskId={task._id} />
                            </div>
                        )}
                    </div>
                ))
            }

            {/* Stage Rating Modal */}
            {selectedTask?.activeStage && (
                <StageRatingModal
                    stage={selectedTask.activeStage}
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onSubmit={handleStageRatingSubmit}
                />
            )}

            {/* Team Modal */}
            {teamModalTaskId && (
                <CreateTeamModal
                    isOpen={!!teamModalTaskId}
                    onClose={() => setTeamModalTaskId(null)}
                    taskId={teamModalTaskId}
                />
            )}

            <ApiResponseAlert
                isOpen={alertConfig.isOpen}
                status={alertConfig.status}
                message={alertConfig.message}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
            />
        </div>
    );
}

TasksList.propTypes = {
    tasks: PropTypes.array.isRequired,
    isAssignedDate: PropTypes.bool,
    isEmployeeView: PropTypes.bool,
    onStatusChange: PropTypes.func,
    onEvaluateStage: PropTypes.func
}

export default TasksList;