"use client"
// import propTypes from "prop-types"
import Page from "@/components/Page.jsx";
import ProjectMembers from "@/app/(dashboard)/projects/[slug]/_components/ProjectMembers.jsx";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel.jsx";
import TasksList from "@/app/(dashboard)/projects/[slug]/_components/TasksList.jsx";
import TaskComments from "@/app/(dashboard)/projects/[slug]/_components/TaskComments.jsx";
import CommentInput from "@/components/CommentInput.jsx";
import AttachmentsList from "@/app/(dashboard)/projects/[slug]/_components/AttachmentsList.jsx";
import ActivityLogs from "@/components/ActivityLogs.jsx";
import { useTranslation } from "react-i18next";
import InfoCard from "@/app/(dashboard)/_components/InfoCard.jsx";
import { useState, useEffect, useMemo } from "react";
import { filterAndSortTasks } from "@/functions/functionsForTasks.js";
import EditProjectModal from "@/app/(dashboard)/projects/_modal/EditProjectModal.jsx";
import { useParams } from "next/navigation";
import { useGetSubscriberProjectDetailsQuery, useAddSubscriberProjectCommentMutation, useDeleteSubscriberProjectCommentMutation, useEditSubscriberProjectCommentMutation, useUploadSubscriberProjectAttachmentMutation, useDeleteSubscriberProjectAttachmentMutation, useUpdateSubscriberProjectMutation } from "@/redux/projects/subscriberProjectsApi.js";
import { useGetEmployeeProjectDetailsQuery, useAddEmployeeProjectCommentMutation, useDeleteEmployeeProjectCommentMutation, useEditEmployeeProjectCommentMutation, useUploadEmployeeProjectAttachmentMutation, useDeleteEmployeeProjectAttachmentMutation, useEvaluateEmployeeProjectMutation } from "@/redux/projects/employeeProjectsApi.js";
import { useUpdateSubscriberTaskMutation } from "@/redux/tasks/subscriberTasksApi.js";
import { useUpdateTaskStatusMutation } from "@/redux/tasks/employeeTasksApi.js";
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/auth/authSlice.js';
import { usePermission } from '@/Hooks/usePermission';
import { useGetProjectLogsQuery } from "@/redux/activity-logs/activityLogsApi";
import RecordPageState from "@/app/(dashboard)/_components/RecordPageState";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { getApiErrorMessage } from "@/functions/apiErrorMessage";

function ProjectDetailsPage() {
    const { slug } = useParams();
    const { t } = useTranslation()
    const user = useSelector(selectUser);
    const authUserType = user?.type;
    const currentUserId = user?._id;

    const useGetDetails = authUserType === "Subscriber" ? useGetSubscriberProjectDetailsQuery : useGetEmployeeProjectDetailsQuery;
    const { data: project, isLoading, isError, error, refetch } = useGetDetails(slug, { skip: !slug || !authUserType });

    const { data: projectLogsData } = useGetProjectLogsQuery({ projectId: project?._id, limit: 10 }, { skip: !project?._id });
    const activityLogs = projectLogsData?.data || [];

    const [addSubscriberComment, { isLoading: isSubAdding }] = useAddSubscriberProjectCommentMutation();
    const [addEmployeeComment, { isLoading: isEmpAdding }] = useAddEmployeeProjectCommentMutation();
    const [deleteSubscriberComment] = useDeleteSubscriberProjectCommentMutation();
    const [deleteEmployeeComment] = useDeleteEmployeeProjectCommentMutation();
    const [editSubscriberComment] = useEditSubscriberProjectCommentMutation();
    const [editEmployeeComment] = useEditEmployeeProjectCommentMutation();
    const [uploadSubscriberAttachment, { isLoading: isSubUploading }] = useUploadSubscriberProjectAttachmentMutation();
    const [uploadEmployeeAttachment, { isLoading: isEmpUploading }] = useUploadEmployeeProjectAttachmentMutation();
    const [deleteSubscriberAttachment] = useDeleteSubscriberProjectAttachmentMutation();
    const [deleteEmployeeAttachment] = useDeleteEmployeeProjectAttachmentMutation();
    const [updateSubscriberProject, { isLoading: isUpdatingProject }] = useUpdateSubscriberProjectMutation();
    const [evaluateEmployeeProject] = useEvaluateEmployeeProjectMutation();

    const [updateSubscriberTaskStatus] = useUpdateSubscriberTaskMutation();
    const [updateEmployeeTaskStatus] = useUpdateTaskStatusMutation();

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            if (authUserType === "Subscriber") {
                await updateSubscriberTaskStatus({ id: taskId, status: newStatus }).unwrap();
            } else {
                await updateEmployeeTaskStatus({ id: taskId, status: newStatus }).unwrap();
            }
            setAlertInfo({ isOpen: true, status: "success", message: t("Task status updated successfully") });
        } catch (error) {
            setAlertInfo({ isOpen: true, status: "error", message: getApiErrorMessage(error, t("Failed to update task status")) });
        }
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
                await uploadSubscriberAttachment({ projectId: project._id, formData }).unwrap();
            } else {
                await uploadEmployeeAttachment({ projectId: project._id, formData }).unwrap();
            }
            setAlertInfo({ isOpen: true, status: "success", message: t("Attachment uploaded successfully") });
        } catch (error) {
            setAlertInfo({ isOpen: true, status: "error", message: getApiErrorMessage(error, t("Failed to upload attachment")) });
            throw error;
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        try {
            if (authUserType === "Subscriber") {
                await deleteSubscriberAttachment({ projectId: project._id, attachmentId }).unwrap();
            } else {
                await deleteEmployeeAttachment({ projectId: project._id, attachmentId }).unwrap();
            }
            setAlertInfo({ isOpen: true, status: "success", message: t("Attachment deleted successfully") });
        } catch (error) {
            setAlertInfo({ isOpen: true, status: "error", message: getApiErrorMessage(error, t("Failed to delete attachment")) });
        }
    };

    const handleAddComment = async (text) => {
        try {
            if (authUserType === "Subscriber") {
                await addSubscriberComment({ projectId: project._id, text }).unwrap();
            } else {
                await addEmployeeComment({ projectId: project._id, text }).unwrap();
            }
            setAlertInfo({ isOpen: true, status: "success", message: t("Comment added successfully") });
        } catch (error) {
            setAlertInfo({ isOpen: true, status: "error", message: getApiErrorMessage(error, t("Failed to add comment")) });
            throw error;
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            setLoadingComments((prev) => ({ ...prev, [commentId]: 'deleting' }));
            if (authUserType === "Subscriber") {
                await deleteSubscriberComment({ projectId: project._id, commentId }).unwrap();
            } else {
                await deleteEmployeeComment({ projectId: project._id, commentId }).unwrap();
            }
            setAlertInfo({ isOpen: true, status: "success", message: t("Comment deleted successfully") });
        } catch (error) {
            setAlertInfo({ isOpen: true, status: "error", message: getApiErrorMessage(error, t("Failed to delete comment")) });
        } finally {
            setLoadingComments((prev) => ({ ...prev, [commentId]: null }));
        }
    };

    const handleEditComment = async (commentId, text) => {
        try {
            setLoadingComments((prev) => ({ ...prev, [commentId]: 'editing' }));
            if (authUserType === "Subscriber") {
                await editSubscriberComment({ projectId: project._id, commentId, text }).unwrap();
            } else {
                await editEmployeeComment({ projectId: project._id, commentId, text }).unwrap();
            }
            setAlertInfo({ isOpen: true, status: "success", message: t("Comment updated successfully") });
        } catch (error) {
            setAlertInfo({ isOpen: true, status: "error", message: getApiErrorMessage(error, t("Failed to update comment")) });
            throw error;
        } finally {
            setLoadingComments((prev) => ({ ...prev, [commentId]: null }));
        }
    };

    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [filterTasks, setFilterTasks] = useState([]);
    const [alertInfo, setAlertInfo] = useState({ isOpen: false, status: "", message: "" });

    const canDeleteAttachments = usePermission("attachments.delete");
    const canUploadAttachments = usePermission("attachments.upload");
    const canEvaluate = usePermission("projects.evaluate");
    const canEditProject = usePermission("projects.update");
    const canComment = usePermission("projects.comment");
    const canManageTeam = usePermission("tasks.manage_participants");

    const getProjectAssigneeIds = () => (project?.assignees_ids || project?.assignees || [])
        .map(member => typeof member === "string" ? member : (member.user_id || member._id))
        .filter(Boolean)
        .map(String);

    const handleAddProjectMember = async (employeeId) => {
        try {
            const assigneesIds = [...new Set([...getProjectAssigneeIds(), String(employeeId)])];
            await updateSubscriberProject({ id: project._id, data: { assignees_ids: assigneesIds } }).unwrap();
            setAlertInfo({ isOpen: true, status: "success", message: t("Member added successfully") });
        } catch (error) {
            setAlertInfo({ isOpen: true, status: "error", message: getApiErrorMessage(error, t("Failed to add member")) });
            throw error;
        }
    };

    const handleRemoveProjectMember = async (member) => {
        try {
            const memberId = String(member.user_id || member._id);
            const assigneesIds = getProjectAssigneeIds().filter(id => id !== memberId);
            await updateSubscriberProject({ id: project._id, data: { assignees_ids: assigneesIds } }).unwrap();
            setAlertInfo({ isOpen: true, status: "success", message: t("Member removed successfully") });
        } catch (error) {
            setAlertInfo({ isOpen: true, status: "error", message: getApiErrorMessage(error, t("Failed to remove member")) });
        }
    };

    const mappedTasks = useMemo(() => project?.tasks?.map(task => {
        const assignee = project.assignees?.find(m => m._id === task.assignee_id);
        return {
            ...task,
            name: task.title,
            delivery: task.status,
            members: assignee ? [{
                name: assignee.name,
                imageProfile: assignee.imageProfile || assignee.avatar
            }] : [],
            assignedDate: task.start_date,
            dueDate: task.due_date,
            rate: task.rate || 0,
        };
    }) || [], [project?.tasks, project?.assignees]);

    useEffect(() => {
        if (mappedTasks.length > 0) {
            setFilterTasks(mappedTasks);
        }
    }, [mappedTasks]);

    const breadcrumbItems = [
        { title: t('Projects'), path: '/projects' },
        { title: project?.name || t('Project Details'), path: '' }
    ];

    if (isLoading) return <Page title={t("Project Details")}><RecordPageState loading /></Page>;
    if (isError || !project) return (
        <Page title={t("Project Details")}>
            <RecordPageState
                notFound={error?.status === 404 || error?.originalStatus === 404}
                onRetry={refetch}
                onBack={() => window.history.back()}
            />
        </Page>
    );

    const projectInfoData = {
        name: project.name,
        description: project.description,
        status: project.status,
        progress: project.progress,
        totalTasks: project.tasks?.length || 0,
        completedTasks: project.tasks?.filter(task => task.status === "completed" || task.status === "done").length || 0,
        assignedDate: project.start_date,
        dueDate: project.due_date,
        department: project.department?.name || project.department_id?.name || null,
    };

    const handleEvaluateProject = async (evaluationData) => {
        try {
            if (authUserType === "Subscriber") {
                await updateSubscriberProject({ id: project._id, data: evaluationData }).unwrap();
            } else {
                await evaluateEmployeeProject({ projectId: project._id, data: evaluationData }).unwrap();
            }
            setAlertInfo({
                isOpen: true,
                status: 'success',
                message: t('Project evaluated successfully'),
            });
        } catch (error) {
            setAlertInfo({
                isOpen: true,
                status: 'error',
                message: getApiErrorMessage(error, t('Failed to evaluate project')),
            });
        }
    };

    const projectMembers = project.assignees?.map(member => ({
        ...member,
        name: member.name,
        imageProfile: member.imageProfile || member.avatar,
        email: member.email,
        rule: member.role,
    })) || [];

    const tasks = mappedTasks;

    const comments = project?.comments || [];
    const attachments = project?.attachments || [];

    const filterOptions = [
        { id: "deadLine", name: "dead line" },
        { id: "startDate", name: "start date" },
        { id: "department", name: "department" }
    ]

    const handelChangeFilterTask = (value) => {
        switch (value) {
            case "deadLine":
                setFilterTasks(filterAndSortTasks(tasks, "deadLine", true));
                break;
            case "startDate":
                setFilterTasks(filterAndSortTasks(tasks, "startDate", true));
                break;
            case "department":
                setFilterTasks(filterAndSortTasks(tasks, "department", true));
                break;
            default:
                setFilterTasks(tasks);
        }
    };

    const handelEditModal = () => {
        setIsOpenEditModal(!isOpenEditModal)
    }

    return (
        <Page title={t("Project Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems} className="gap-5">
            <div className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)] gap-5 xl:gap-6 items-start">
                <main className="min-w-0 flex flex-col gap-5">
                    <InfoCard 
                        type={"project"} 
                        data={projectInfoData} 
                        handelEditAction={canEditProject ? handelEditModal : undefined}
                        rate={project.overall_rating || 0}
                        onRate={canEvaluate ? handleEvaluateProject : null}
                    />
                    <section className="p-4 sm:p-5 bg-surface rounded-[24px] border border-status-border shadow-sm w-full flex flex-col gap-4">
                        <div className="title-header pb-3 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-status-border">
                            <div>
                                <h2 className="text-lg font-bold text-table-title">{t("Project Tasks")}</h2>
                                <p className="text-xs text-cell-secondary mt-1">{tasks.length} {t("Tasks")}</p>
                            </div>
                            <SelectWithoutLabel onChange={handelChangeFilterTask} options={filterOptions} title={"Filter by"} className="w-full sm:w-[150px] h-[40px]" />
                        </div>
                        <TasksList 
                            tasks={filterTasks} 
                            isAssignedDate={true} 
                            isEmployeeView={true} 
                            onStatusChange={handleStatusChange} 
                        />
                    </section>
                    {canComment && <section className="bg-surface rounded-[24px] border border-status-border shadow-sm w-full flex flex-col gap-3 overflow-hidden">
                        <div className="p-4 sm:p-5 flex flex-col gap-3">
                            <div className={"title-header w-full flex items-center justify-between"}>
                                <h2 className="text-lg font-bold text-table-title">{t("Comments")}</h2>
                            </div>
                            <TaskComments
                                comments={comments}
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
                        <ProjectMembers
                            members={projectMembers}
                            canAddMember={authUserType === "Subscriber" && canManageTeam}
                            canDeleteMember={authUserType === "Subscriber" && canManageTeam}
                            onAddMember={authUserType === "Subscriber" && canManageTeam ? handleAddProjectMember : undefined}
                            onRemoveMember={authUserType === "Subscriber" && canManageTeam ? handleRemoveProjectMember : undefined}
                            isUpdating={isUpdatingProject}
                        />
                    </div>
                    {/* Hiding components not yet linked to backend data */}
                    <AttachmentsList
                        attachments={attachments}
                        onUpload={canUploadAttachments ? handleUploadAttachment : null}
                        onDelete={canDeleteAttachments ? handleDeleteAttachment : null}
                        isUploading={isUploadingAttachment}
                    />
                    <ActivityLogs activityLogs={activityLogs} isRawLogs={true} className={"h-72"} />
                </aside>

            </div>
            <EditProjectModal project={project} isOpen={isOpenEditModal} onClose={handelEditModal} />
            <ApiResponseAlert
                isOpen={alertInfo.isOpen}
                status={alertInfo.status}
                message={alertInfo.message}
                onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
            />
        </Page>
    );
}

ProjectDetailsPage.propTypes = {}
export default ProjectDetailsPage;
