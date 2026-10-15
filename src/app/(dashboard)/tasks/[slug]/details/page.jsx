"use client"
import Page from "@/components/Page.jsx";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel.jsx";
import TasksList from "@/app/(dashboard)/projects/[slug]/_components/TasksList.jsx";
import TaskComments from "@/app/(dashboard)/projects/[slug]/_components/TaskComments.jsx";
import CommentInput from "@/components/CommentInput.jsx";
import ProjectMembers from "@/app/(dashboard)/projects/[slug]/_components/ProjectMembers.jsx";
import AttachmentsList from "@/app/(dashboard)/projects/[slug]/_components/AttachmentsList.jsx";
import ActivityLogs from "@/components/ActivityLogs.jsx";
import { useTranslation } from "react-i18next";
import InfoCard from "@/app/(dashboard)/_components/InfoCard.jsx";
import { useState, useMemo, use } from "react";
import { filterAndSortTasks } from "@/functions/functionsForTasks.js";
import { useRouter } from "next/navigation";
import { filterOptions } from "@/functions/FactoryData.jsx";
import { useGetTaskLogsQuery } from "@/redux/activity-logs/activityLogsApi";
import { useGetSubscriberTaskDetailsQuery, useAddSubscriberTaskCommentMutation, useDeleteSubscriberTaskCommentMutation, useEditSubscriberTaskCommentMutation, useEvaluateSubscriberTaskStageMutation, useEvaluateSubscriberTaskMutation, useUploadSubscriberTaskAttachmentMutation, useDeleteSubscriberTaskAttachmentMutation } from "@/redux/tasks/subscriberTasksApi";
import { useGetEmployeeTaskDetailsQuery, useAddEmployeeTaskCommentMutation, useDeleteEmployeeTaskCommentMutation, useEditEmployeeTaskCommentMutation, useUploadEmployeeTaskAttachmentMutation, useDeleteEmployeeTaskAttachmentMutation } from "@/redux/tasks/employeeTasksApi";
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/auth/authSlice.js';
import { usePermission } from '@/Hooks/usePermission';
import StarRating from "@/components/StarRating";
import EvaluationDetailsModal from "@/components/Modal/EvaluationDetailsModal";
import RecordPageState from "@/app/(dashboard)/_components/RecordPageState";
import PropTypes from "prop-types";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { getApiErrorMessage } from "@/functions/apiErrorMessage";

function TaskDetailsPage({ params }) {
    const { t } = useTranslation();
    const router = useRouter();
    const resolvedParams = use(params);
    const slug = resolvedParams?.slug;
    // Handle both "id-title" and just "id"
    const taskId = slug?.includes("-") ? slug.split("-")[0] : slug;

    const user = useSelector(selectUser);
    const authUserType = user?.type;
    const currentUserId = user?._id;

    const useGetDetails = authUserType === "Subscriber" ? useGetSubscriberTaskDetailsQuery : useGetEmployeeTaskDetailsQuery;
    const { data: task, isLoading, isError, error, refetch } = useGetDetails(taskId, {
        skip: !taskId || !authUserType
    });

    const { data: taskLogsData, isLoading: isLogsLoading } = useGetTaskLogsQuery(
        { taskId, limit: 10 },
        { skip: !taskId }
    );
    const taskActivityLogs = taskLogsData?.data || [];

    const [addSubscriberComment, { isLoading: isSubAdding }] = useAddSubscriberTaskCommentMutation();
    const [addEmployeeComment, { isLoading: isEmpAdding }] = useAddEmployeeTaskCommentMutation();
    const [deleteSubscriberComment] = useDeleteSubscriberTaskCommentMutation();
    const [deleteEmployeeComment] = useDeleteEmployeeTaskCommentMutation();
    const [editSubscriberComment] = useEditSubscriberTaskCommentMutation();
    const [editEmployeeComment] = useEditEmployeeTaskCommentMutation();
    const [evaluateStage] = useEvaluateSubscriberTaskStageMutation();
    const [evaluateTask] = useEvaluateSubscriberTaskMutation();

    const [uploadSubscriberAttachment, { isLoading: isSubUploading }] = useUploadSubscriberTaskAttachmentMutation();
    const [uploadEmployeeAttachment, { isLoading: isEmpUploading }] = useUploadEmployeeTaskAttachmentMutation();
    const [deleteSubscriberAttachment] = useDeleteSubscriberTaskAttachmentMutation();
    const [deleteEmployeeAttachment] = useDeleteEmployeeTaskAttachmentMutation();
    const [operationResponse, setOperationResponse] = useState({ isOpen: false, status: "", message: "" });

    const showOperationResponse = (status, message) => {
        setOperationResponse({ isOpen: true, status, message });
    };

    const [loadingComments, setLoadingComments] = useState({});

    const isAddingComment = isSubAdding || isEmpAdding;
    const isUploadingAttachment = isSubUploading || isEmpUploading;

    const handleUploadAttachment = async (file, description) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (description) {
                formData.append('description', description);
            }
            if (authUserType === "Subscriber") {
                await uploadSubscriberAttachment({ taskId, formData }).unwrap();
            } else {
                await uploadEmployeeAttachment({ taskId, formData }).unwrap();
            }
            showOperationResponse("success", t("Attachment uploaded successfully"));
        } catch (error) {
            showOperationResponse("error", getApiErrorMessage(error, t("Failed to upload attachment")));
            throw error;
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        try {
            if (authUserType === "Subscriber") {
                await deleteSubscriberAttachment({ taskId, attachmentId }).unwrap();
            } else {
                await deleteEmployeeAttachment({ taskId, attachmentId }).unwrap();
            }
            showOperationResponse("success", t("Attachment deleted successfully"));
        } catch (error) {
            showOperationResponse("error", getApiErrorMessage(error, t("Failed to delete attachment")));
        }
    };

    const handleAddComment = async (text) => {
        try {
            if (authUserType === "Subscriber") {
                await addSubscriberComment({ taskId, text }).unwrap();
            } else {
                await addEmployeeComment({ taskId, text }).unwrap();
            }
            showOperationResponse("success", t("Comment added successfully"));
        } catch (error) {
            showOperationResponse("error", getApiErrorMessage(error, t("Failed to add comment")));
            throw error;
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            setLoadingComments((prev) => ({ ...prev, [commentId]: 'deleting' }));
            if (authUserType === "Subscriber") {
                await deleteSubscriberComment({ taskId, commentId }).unwrap();
            } else {
                await deleteEmployeeComment({ taskId, commentId }).unwrap();
            }
            showOperationResponse("success", t("Comment deleted successfully"));
        } catch (error) {
            showOperationResponse("error", getApiErrorMessage(error, t("Failed to delete comment")));
        } finally {
            setLoadingComments((prev) => ({ ...prev, [commentId]: null }));
        }
    };

    const handleEditComment = async (commentId, text) => {
        try {
            setLoadingComments((prev) => ({ ...prev, [commentId]: 'editing' }));
            if (authUserType === "Subscriber") {
                await editSubscriberComment({ taskId, commentId, text }).unwrap();
            } else {
                await editEmployeeComment({ taskId, commentId, text }).unwrap();
            }
            showOperationResponse("success", t("Comment updated successfully"));
        } catch (error) {
            showOperationResponse("error", getApiErrorMessage(error, t("Failed to update comment")));
            throw error;
        } finally {
            setLoadingComments((prev) => ({ ...prev, [commentId]: null }));
        }
    };

    const handleEvaluateStage = async (stageId, data) => {
        try {
            if (authUserType === "Subscriber") {
                const evaluationPayload = {
                    score: data.score || 0,
                    rate_time: data.ratings?.rate_time || data.rate_time || 0,
                    rate_content: data.ratings?.rate_content || data.rate_content || 0,
                    rate_video: data.ratings?.rate_video || data.rate_video || 0,
                    evaluation_criteria: data.evaluation_criteria || {},
                    comment: data.comment || "",
                    attachment: data.attachment || null 
                };

                if (stageId && stageId !== taskId) {
                    await evaluateStage({ 
                        taskId, 
                        stageId, 
                        data: evaluationPayload
                    }).unwrap();
                } else {
                    await evaluateTask({
                        taskId,
                        data: evaluationPayload
                    }).unwrap();
                }
                showOperationResponse("success", t("Evaluation submitted successfully"));
            }
        } catch (error) {
            showOperationResponse("error", getApiErrorMessage(error, t("Failed to submit evaluation")));
        }
    };

    const breadcrumbItems = [
        { title: t('Tasks'), path: '/tasks' },
        { title: t('Task Details'), path: '' }
    ];

    const handleEditPageNavigation = () => {
        router.push(`/tasks/${slug}/edit`);
    }

    const [filterBy, setFilterBy] = useState("all");

    const mappedStages = useMemo(() => {
        if (!task?.stages) return [];

        let stages = task.stages.map(stage => ({
            _id: stage._id,
            taskId: taskId, // Pass parent taskId to each stage
            name: stage.name,
            status: stage.status,
            assignedDate: stage.start_date,
            dueDate: stage.due_date,
            rate: stage.rate,
            rate_time: stage.rate_time,
            rate_content: stage.rate_content,
            rate_video: stage.rate_video,
            comment: stage.comment,
            delivery: stage.status === "completed" ? t("Completed") : (stage.status || t("Pending")), 
        }));

        if (filterBy === "all") return stages;
        return filterAndSortTasks(stages, filterBy, true);
    }, [task?.stages, filterBy, taskId, t]);

    const infoCardData = useMemo(() => {
        if (!task) return null;
        return {
            ...task,
            name: task.title,
            totalTasks: task.stages?.length || 0,
            completedTasks: task.stages?.filter(s => s.status === 'completed').length || 0,
            assignedDate: task.start_date,
            dueDate: task.due_date,
            department: task.department?.name || t("No Department")
        };
    }, [task, t]);

    const assigneeMember = useMemo(() => {
        if (!task?.assignee) return [];
        return [{
            ...task.assignee,
            role: "Assignee",
            work: task.assignee.email
        }];
    }, [task?.assignee]);

    const canDeleteAttachments = usePermission("attachments.delete");
    const canUploadAttachments = usePermission("attachments.upload");
    const canComment = usePermission("tasks.comment");
    const canEditTask = usePermission("tasks.update");
    const [isEvalDetailsOpen, setIsEvalDetailsOpen] = useState(false);

    const taskAvgRating = useMemo(() => {
        if (!task?.ratings || task.ratings.length === 0) return 0;
        const sum = task.ratings.reduce((acc, r) => acc + (r.score || 0), 0);
        return Math.round((sum / task.ratings.length) * 10) / 10;
    }, [task?.ratings]);

    if (isLoading) {
        return (
            <Page title={t("Task Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
                <RecordPageState loading />
            </Page>
        );
    }

    if (isError || !task) {
        return (
            <Page title={t("Task Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
                <RecordPageState
                    notFound={error?.status === 404 || error?.originalStatus === 404}
                    onRetry={refetch}
                    onBack={() => router.push("/tasks")}
                />
            </Page>
        );
    }

    return (
        <>
            <Page title={t("Task Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems} className="gap-5">
                <div className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)] gap-5 xl:gap-6 items-start">
                    <main className="min-w-0 flex flex-col gap-5">
                        <InfoCard type={"task"} data={infoCardData} handelEditAction={canEditTask ? handleEditPageNavigation : undefined} />
                        <section className="p-4 sm:p-5 bg-surface rounded-[24px] border border-status-border shadow-sm w-full flex flex-col gap-4 min-h-72">
                            <div className="title-header pb-3 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-status-border">
                                <div>
                                    <h2 className="text-lg font-bold text-table-title">{t("Task Stages")}</h2>
                                    <p className="text-xs text-cell-secondary mt-1">{mappedStages.length} {t("Stages")}</p>
                                </div>
                                <SelectWithoutLabel
                                    title={t("Filter by")}
                                    options={filterOptions}
                                    onChange={(val) => setFilterBy(val)}
                                    className="w-full sm:w-[150px] h-[40px]"
                                />
                            </div>
                            <TasksList
                                isAssignedDate={true}
                                tasks={mappedStages}
                                onEvaluateStage={handleEvaluateStage}
                                showStagesCount={false}
                                showAssignees={false}
                            />
                        </section>
                        {taskAvgRating > 0 && (
                            <div className="p-4 sm:p-5 bg-surface rounded-[24px] border border-status-border shadow-sm w-full flex items-center justify-between gap-3">
                                <h2 className="text-lg font-bold text-table-title">{t("Evaluation")}</h2>
                                <StarRating rating={taskAvgRating} onClickRate={() => setIsEvalDetailsOpen(true)} />
                            </div>
                        )}
                        {canComment && <section className="bg-surface rounded-[24px] border border-status-border shadow-sm w-full flex flex-col gap-3 overflow-hidden">
                            <div className="p-4 sm:p-5 flex flex-col gap-3">
                                <div className={"title-header w-full flex items-center justify-between"}>
                                    <h2 className="text-lg font-bold text-table-title">{t("Comments")}</h2>
                                </div>
                                <TaskComments 
                                    comments={task.comments || []} 
                                    currentUserId={currentUserId}
                                    authUserType={authUserType}
                                    onDeleteComment={handleDeleteComment}
                                    onEditComment={handleEditComment}
                                    loadingComments={loadingComments}
                                />
                            </div>
                            <CommentInput onSend={handleAddComment} isLoading={isAddingComment} />
                        </section>}
                    </main>
                    <aside className="min-w-0 flex flex-col gap-5 xl:sticky xl:top-5">
                        <div className="flex flex-col gap-3">
                            <ProjectMembers members={assigneeMember} title={t("Assignee Employee")} canAddMember={false} canDeleteMember={false} />
                        </div>
                        {/* Hiding components not yet linked to backend data */}
                        <AttachmentsList
                            attachments={task.attachments || []}
                            onUpload={canUploadAttachments ? handleUploadAttachment : null}
                            onDelete={canDeleteAttachments ? handleDeleteAttachment : null}
                            isUploading={isUploadingAttachment}
                        />
                        <ActivityLogs
                            activityLogs={taskActivityLogs}
                            isRawLogs={true}
                            isLoading={isLogsLoading}
                            className={"h-72"}
                        />
                    </aside>
                </div>
            </Page>
            <EvaluationDetailsModal
                isOpen={isEvalDetailsOpen}
                onClose={() => setIsEvalDetailsOpen(false)}
                ratings={task.ratings}
            />
            <ApiResponseAlert
                isOpen={operationResponse.isOpen}
                status={operationResponse.status}
                message={operationResponse.message}
                onClose={() => setOperationResponse(prev => ({ ...prev, isOpen: false }))}
            />
        </>
    );
}

TaskDetailsPage.propTypes = {
    params: PropTypes.any.isRequired,
};

export default TaskDetailsPage;
