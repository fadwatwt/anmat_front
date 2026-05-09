"use client"
import Page from "@/components/Page.jsx";
import ProjectMembers from "@/app/(dashboard)/projects/[slug]/_components/ProjectMembers.jsx";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel.jsx";
import TasksList from "@/app/(dashboard)/projects/[slug]/_components/TasksList.jsx";
import TaskComments from "@/app/(dashboard)/projects/[slug]/_components/TaskComments.jsx";
import CommentInput from "@/components/CommentInput.jsx";
import { useTranslation } from "react-i18next";
import InfoCard from "@/app/(dashboard)/_components/InfoCard.jsx";
import AttachmentsList from "@/app/(dashboard)/projects/[slug]/_components/AttachmentsList.jsx";
import ActivityLogs from "@/components/ActivityLogs.jsx";
import { useState, useEffect } from "react";
import { filterAndSortTasks } from "@/functions/functionsForTasks.js";
import { useParams } from "next/navigation";
import { useGetEmployeeProjectDetailsQuery, useAddEmployeeProjectCommentMutation, useDeleteEmployeeProjectCommentMutation, useEditEmployeeProjectCommentMutation, useUploadEmployeeProjectAttachmentMutation, useDeleteEmployeeProjectAttachmentMutation, useEvaluateEmployeeProjectMutation } from "@/redux/projects/employeeProjectsApi.js";
import { useUpdateTaskStatusMutation } from "@/redux/tasks/employeeTasksApi.js";
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/auth/authSlice.js';
import { usePermission } from '@/Hooks/usePermission';
import CreateTeamModal from "@/app/(dashboard)/projects/_modal/CreateTeamModal";
import { RiGroupFill } from "react-icons/ri";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function EmployeeProjectDetailsPage() {
    const { slug } = useParams();
    const { t } = useTranslation()
    const { data: projectData, isLoading, isError, error, refetch } = useGetEmployeeProjectDetailsQuery(slug);
    const project = projectData?.data || projectData;
    const user = useSelector(selectUser);
    const authUserType = user?.type;
    const currentUserId = user?._id;

    const [addComment, { isLoading: isAddingComment }] = useAddEmployeeProjectCommentMutation();
    const [deleteComment] = useDeleteEmployeeProjectCommentMutation();
    const [editComment] = useEditEmployeeProjectCommentMutation();
    const [uploadAttachment, { isLoading: isUploadingAttachment }] = useUploadEmployeeProjectAttachmentMutation();
    const [deleteAttachment] = useDeleteEmployeeProjectAttachmentMutation();
    const [evaluateProject] = useEvaluateEmployeeProjectMutation();
    const [updateTaskStatus] = useUpdateTaskStatusMutation();

    const [loadingComments, setLoadingComments] = useState({});
    const [alertInfo, setAlertInfo] = useState({ isOpen: false, status: 'success', message: '' });
    const [filterTasks, setFilterTasks] = useState([]);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

    const canDeleteAttachments = usePermission("attachments.delete");
    const canEvaluate = usePermission("projects.evaluate");
    const canManageTeam = usePermission("tasks.manage_participants");

    const mappedTasks = project?.tasks?.map(task => {
        // For employees, assignees might be formatted differently or we use the project's assignees
        const assignee = project.assignees?.find(m => m._id === task.assignee_id);
        return {
            ...task,
            name: task.title,
            delivery: task.status,
            members: assignee ? [{
                name: assignee.name,
                imageProfile: assignee.imageProfile || assignee.avatar
            }] : (task.assignee ? [{
                name: task.assignee.name,
                imageProfile: task.assignee.imageProfile || task.assignee.avatar
            }] : []),
            assignedDate: task.start_date,
            dueDate: task.due_date,
            rate: task.rate || 0
        };
    }) || [];

    useEffect(() => {
        if (mappedTasks.length > 0) {
            setFilterTasks(mappedTasks);
        }
    }, [project?.tasks, project?.assignees]);

    const breadcrumbItems = [
        { title: t('Projects'), path: '/employee/projects' },
        { title: project?.name || t('Project Details'), path: '' }
    ];

    if (isLoading) return <div className="flex items-center justify-center h-screen">{t("Loading...")}</div>;
    if (isError) return <div className="flex items-center justify-center h-screen text-red-500">{error?.data?.message || t("Error loading project details")}</div>;

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

    const projectMembers = project.assignees?.map(member => ({
        name: member.name,
        imageProfile: member.imageProfile || member.avatar,
        email: member.email,
        rule: member.role,
    })) || [];

    const filterOptions = [
        { id: "deadLine", name: "dead line" },
        { id: "startDate", name: "start date" },
        { id: "department", name: "department" }
    ]

    const handelChangeFilterTask = (value) => {
        switch (value) {
            case "deadLine":
                setFilterTasks(filterAndSortTasks(mappedTasks, "deadLine", true));
                break;
            case "startDate":
                setFilterTasks(filterAndSortTasks(mappedTasks, "startDate", true));
                break;
            case "department":
                setFilterTasks(filterAndSortTasks(mappedTasks, "department", true));
                break;
            default:
                setFilterTasks(mappedTasks);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const res = await updateTaskStatus({ id: taskId, status: newStatus }).unwrap();
            setAlertInfo({
                isOpen: true,
                status: 'success',
                message: res?.message || t('Task status updated successfully'),
            });
            refetch();
        } catch (err) {
            setAlertInfo({
                isOpen: true,
                status: 'error',
                message: err?.data?.message || err?.message || t('Failed to update task status'),
            });
            throw err;
        }
    };

    const handleUploadAttachment = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            await uploadAttachment({ projectId: project._id, formData }).unwrap();
        } catch (error) {
            console.error("Failed to upload attachment: ", error);
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        try {
            await deleteAttachment({ projectId: project._id, attachmentId }).unwrap();
        } catch (error) {
            console.error("Failed to delete attachment: ", error);
        }
    };

    const handleAddComment = async (text) => {
        try {
            await addComment({ projectId: project._id, text }).unwrap();
        } catch (error) {
            console.error("Failed to add comment: ", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            setLoadingComments((prev) => ({ ...prev, [commentId]: 'deleting' }));
            await deleteComment({ projectId: project._id, commentId }).unwrap();
        } catch (error) {
            console.error("Failed to delete comment: ", error);
        } finally {
            setLoadingComments((prev) => ({ ...prev, [commentId]: null }));
        }
    };

    const handleEditComment = async (commentId, text) => {
        try {
            setLoadingComments((prev) => ({ ...prev, [commentId]: 'editing' }));
            await editComment({ projectId: project._id, commentId, text }).unwrap();
        } catch (error) {
            console.error("Failed to edit comment: ", error);
        } finally {
            setLoadingComments((prev) => ({ ...prev, [commentId]: null }));
        }
    };

    const handleEvaluateProject = async (evaluationData) => {
        try {
            await evaluateProject({ projectId: project._id, data: evaluationData }).unwrap();
            setAlertInfo({
                isOpen: true,
                status: 'success',
                message: t('Project evaluated successfully'),
            });
        } catch (error) {
            console.error("Failed to evaluate project: ", error);
            setAlertInfo({
                isOpen: true,
                status: 'error',
                message: error?.data?.message || t('Failed to evaluate project'),
            });
        }
    };

    const comments = project?.comments || [];
    const attachments = project?.attachments || [];
    const activityLogs = [];

    return (
        <Page title={t("Project Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"w-full flex items-start  gap-8 flex-col md:flex-row"}>
                <div className={"flex flex-col gap-6 md:w-[60%] w-full "}>
                    <InfoCard 
                        type={"project"} 
                        data={projectInfoData} 
                        isEditBtn={false} 
                        rate={project?.overall_rating || 0}
                        onRate={canEvaluate ? handleEvaluateProject : null}
                    />
                    <div className={"p-4 bg-surface rounded-2xl w-full flex flex-col gap-3"}>
                        <div className={"title-header pb-3 w-full flex items-center justify-between "}>
                            <p className={"text-lg text-table-title"}>{t("Project Tasks")} </p>
                            <SelectWithoutLabel onChange={handelChangeFilterTask} options={filterOptions} title={"Filter by"} className={"w-[120px] h-[36px]"} />
                        </div>
                        <TasksList 
                            tasks={filterTasks} 
                            isAssignedDate={true} 
                            isEmployeeView={true} 
                            onStatusChange={handleStatusChange} 
                        />
                    </div>
                    {true && <div className={"bg-surface rounded-2xl w-full flex flex-col gap-3"}>
                        <div className={"p-4 flex flex-col gap-3"}>
                            <div className={"title-header w-full flex items-center justify-between"}>
                                <p className={"text-lg text-table-title"}>{t("Comments")}</p>
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
                    </div>}
                </div>
                <div className={"flex-1 flex flex-col gap-6"}>
                    <div className="flex flex-col gap-3">
                        <ProjectMembers members={projectMembers} />
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
                    <AttachmentsList
                        attachments={attachments}
                        onUpload={handleUploadAttachment}
                        onDelete={canDeleteAttachments ? handleDeleteAttachment : null}
                        isUploading={isUploadingAttachment}
                    />
                    <ActivityLogs activityLogs={activityLogs} className={"h-72"} />
                </div>
            </div>

            {canManageTeam && (
                <CreateTeamModal
                    isOpen={isTeamModalOpen}
                    onClose={() => setIsTeamModalOpen(false)}
                />
            )}

            {alertInfo.isOpen && (
                <ApiResponseAlert
                    isOpen={alertInfo.isOpen}
                    status={alertInfo.status}
                    message={alertInfo.message}
                    onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
                />
            )}
        </Page>
    );
}

export default EmployeeProjectDetailsPage;
