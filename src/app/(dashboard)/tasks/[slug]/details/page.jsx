"use client"
import Page from "@/components/Page.jsx";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel.jsx";
import TasksList from "@/app/(dashboard)/projects/[slug]/_components/TasksList.jsx";
import TaskComments from "@/app/(dashboard)/projects/[slug]/_components/TaskComments.jsx";
import CommentInput from "@/components/CommentInput.jsx";
import ProjectMembers from "@/app/(dashboard)/projects/[slug]/_components/ProjectMembers.jsx";
import AttachmentsList from "@/app/(dashboard)/projects/[slug]/_components/AttachmentsList.jsx";
import ActivityLogs from "@/components/ActivityLogs.jsx";
import TimeLine from "@/components/TimeLine/TimeLine.jsx";
import { useTranslation } from "react-i18next";
import InfoCard from "@/app/(dashboard)/_components/InfoCard.jsx";
import { useState, useMemo, use } from "react";
import { filterAndSortTasks } from "@/functions/functionsForTasks.js";
import { useRouter } from "next/navigation";
import { filterOptions, comments, members as defaultMembers, attachments, activityLogs } from "@/functions/FactoryData.jsx";
import { useGetSubscriberTaskDetailsQuery, useAddSubscriberTaskCommentMutation, useDeleteSubscriberTaskCommentMutation, useEditSubscriberTaskCommentMutation, useEvaluateSubscriberTaskStageMutation, useEvaluateSubscriberTaskMutation, useUploadSubscriberTaskAttachmentMutation, useDeleteSubscriberTaskAttachmentMutation } from "@/redux/tasks/subscriberTasksApi";
import { useGetEmployeeTaskDetailsQuery, useAddEmployeeTaskCommentMutation, useDeleteEmployeeTaskCommentMutation, useEditEmployeeTaskCommentMutation, useUploadEmployeeTaskAttachmentMutation, useDeleteEmployeeTaskAttachmentMutation } from "@/redux/tasks/employeeTasksApi";
import useAuthStore from '@/store/authStore.js';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/auth/authSlice.js';
import { usePermission } from '@/Hooks/usePermission';
import CreateTeamModal from "@/app/(dashboard)/projects/_modal/CreateTeamModal";
import { RiGroupFill } from "react-icons/ri";

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
    const { data: task, isLoading, isError } = useGetDetails(taskId, {
        skip: !taskId
    });

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
        } catch (error) {
            console.error("Failed to upload attachment: ", error);
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        try {
            if (authUserType === "Subscriber") {
                await deleteSubscriberAttachment({ taskId, attachmentId }).unwrap();
            } else {
                await deleteEmployeeAttachment({ taskId, attachmentId }).unwrap();
            }
        } catch (error) {
            console.error("Failed to delete attachment: ", error);
        }
    };

    const handleAddComment = async (text) => {
        try {
            if (authUserType === "Subscriber") {
                await addSubscriberComment({ taskId, text }).unwrap();
            } else {
                await addEmployeeComment({ taskId, text }).unwrap();
            }
        } catch (error) {
            console.error("Failed to add comment: ", error);
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
        } catch (error) {
            console.error("Failed to delete comment: ", error);
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
        } catch (error) {
            console.error("Failed to edit comment: ", error);
        } finally {
            setLoadingComments((prev) => ({ ...prev, [commentId]: null }));
        }
    };

    const handleEvaluateStage = async (stageId, data) => {
        try {
            if (authUserType === "Subscriber") {
                const evaluationPayload = {
                    score: data.score || 0,
                    rate_time: data.rate_time || 0,
                    rate_content: data.rate_content || 0,
                    rate_video: data.rate_video || 0,
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
            }
        } catch (error) {
            console.error("Failed to evaluate stage: ", error);
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
            delivery: stage.status === "completed" ? "Completed" : (stage.status || "Pending"), 
        }));

        if (filterBy === "all") return stages;
        return filterAndSortTasks(stages, filterBy, true);
    }, [task?.stages, filterBy]);

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
    const canManageTeam = usePermission("tasks.manage_participants");
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

    if (isLoading) {
        return (
            <Page title={t("Task Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">{t("Loading task details...")}</p>
                </div>
            </Page>
        );
    }

    if (isError || !task) {
        return (
            <Page title={t("Task Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
                <div className="flex items-center justify-center h-64 text-red-500 text-center">
                    <p>{t("Failed to load task details. Please try again later.")}</p>
                </div>
            </Page>
        );
    }

    return (
        <>
            {canManageTeam && (
                <CreateTeamModal
                    isOpen={isTeamModalOpen}
                    onClose={() => setIsTeamModalOpen(false)}
                    taskId={taskId}
                />
            )}
            <Page title={t("Task Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
                <div className={"w-full flex items-start gap-8 flex-col md:flex-row h-full"}>
                    <div className={"flex flex-col gap-6 md:w-[60%] w-full "}>
                        <InfoCard type={"task"} data={infoCardData} handelEditAction={handleEditPageNavigation} />
                        <div className={"p-4 bg-white dark:bg-white-0 rounded-2xl w-full flex flex-col gap-3 h-96"}>
                            <div className={"title-header pb-3 w-full flex items-center justify-between "}>
                                <p className={"text-lg dark:text-gray-200"}>{t("Task Stages")} </p>
                                <SelectWithoutLabel
                                    title={t("Filter by")}
                                    options={filterOptions}
                                    onChange={(val) => setFilterBy(val)}
                                    className={"w-[120px] h-[36px]"}
                                />
                            </div>
                            <TasksList isAssignedDate={true} tasks={mappedStages} onEvaluateStage={handleEvaluateStage} />
                        </div>
                        {true && <div className={"bg-white dark:bg-white-0 rounded-2xl w-full flex flex-col gap-3"}>
                            <div className={"p-4 flex flex-col gap-3"}>
                                <div className={"title-header w-full flex items-center justify-between"}>
                                    <p className={"text-lg dark:text-gray-200 "}>{t("Comments")}</p>
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
                        </div>}
                    </div>
                    <div className={"flex-1 flex flex-col gap-6"}>
                        <div className="flex flex-col gap-3">
                            <ProjectMembers members={assigneeMember} title="Assignee Employee" />
                            {canManageTeam && (
                                <button
                                    onClick={() => setIsTeamModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-base text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity w-fit"
                                >
                                    <RiGroupFill size={16} />
                                    {t("Manage Team")}
                                </button>
                            )}
                        </div>
                        {/* Hiding components not yet linked to backend data */}
                        {true && <AttachmentsList
                            attachments={task.attachments || []}
                            onUpload={handleUploadAttachment}
                            onDelete={canDeleteAttachments ? handleDeleteAttachment : null}
                            isUploading={isUploadingAttachment}
                        />}
                        {true && <ActivityLogs activityLogs={activityLogs} className={"h-72"} />}
                        {false && <TimeLine />}
                    </div>
                </div>
            </Page>
        </>
    );
}

export default TaskDetailsPage;
