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
import TimeLine from "@/components/TimeLine/TimeLine.jsx";
import { useTranslation } from "react-i18next";
import { getTimeDifference } from "@/functions/Days.js";
import InfoCard from "@/app/(dashboard)/_components/InfoCard.jsx";
import { useState, useEffect } from "react";
import { filterAndSortTasks } from "@/functions/functionsForTasks.js";
import EditProjectModal from "@/app/(dashboard)/projects/_modal/EditProjectModal.jsx";
import { useParams } from "next/navigation";
import { useGetSubscriberProjectDetailsQuery, useAddSubscriberProjectCommentMutation, useDeleteSubscriberProjectCommentMutation, useEditSubscriberProjectCommentMutation, useUploadSubscriberProjectAttachmentMutation, useDeleteSubscriberProjectAttachmentMutation, useUpdateSubscriberProjectMutation } from "@/redux/projects/subscriberProjectsApi.js";
import { useGetEmployeeProjectDetailsQuery, useAddEmployeeProjectCommentMutation, useDeleteEmployeeProjectCommentMutation, useEditEmployeeProjectCommentMutation, useUploadEmployeeProjectAttachmentMutation, useDeleteEmployeeProjectAttachmentMutation, useEvaluateEmployeeProjectMutation } from "@/redux/projects/employeeProjectsApi.js";
import { useUpdateSubscriberTaskMutation } from "@/redux/tasks/subscriberTasksApi.js";
import { useUpdateTaskStatusMutation } from "@/redux/tasks/employeeTasksApi.js";
import useAuthStore from '@/store/authStore.js';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/auth/authSlice.js';
import { useGetProjectLogsQuery } from "@/redux/activity-logs/activityLogsApi";

function ProjectDetailsPage() {
    const { slug } = useParams();
    const { t } = useTranslation()
    const user = useSelector(selectUser);
    const authUserType = user?.type;
    const currentUserId = user?._id;

    const useGetDetails = authUserType === "Subscriber" ? useGetSubscriberProjectDetailsQuery : useGetEmployeeProjectDetailsQuery;
    const { data: project, isLoading, isError, error } = useGetDetails(slug);

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
    const [updateSubscriberProject] = useUpdateSubscriberProjectMutation();
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
        } catch (error) {
            console.error("Failed to update task status: ", error);
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
        } catch (error) {
            console.error("Failed to upload attachment: ", error);
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        try {
            if (authUserType === "Subscriber") {
                await deleteSubscriberAttachment({ projectId: project._id, attachmentId }).unwrap();
            } else {
                await deleteEmployeeAttachment({ projectId: project._id, attachmentId }).unwrap();
            }
        } catch (error) {
            console.error("Failed to delete attachment: ", error);
        }
    };

    const handleAddComment = async (text) => {
        try {
            if (authUserType === "Subscriber") {
                await addSubscriberComment({ projectId: project._id, text }).unwrap();
            } else {
                await addEmployeeComment({ projectId: project._id, text }).unwrap();
            }
        } catch (error) {
            console.error("Failed to add comment: ", error);
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
                await editSubscriberComment({ projectId: project._id, commentId, text }).unwrap();
            } else {
                await editEmployeeComment({ projectId: project._id, commentId, text }).unwrap();
            }
        } catch (error) {
            console.error("Failed to edit comment: ", error);
        } finally {
            setLoadingComments((prev) => ({ ...prev, [commentId]: null }));
        }
    };

    const [isOpenEditModal, setIsOpenEditModal] = useState(false)
    const [filterTasks, setFilterTasks] = useState([]);

    const mappedTasks = project?.tasks?.map(task => {
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
    }) || [];

    useEffect(() => {
        if (mappedTasks.length > 0) {
            setFilterTasks(mappedTasks);
        }
    }, [project?.tasks, project?.assignees]);

    const breadcrumbItems = [
        { title: t('Projects'), path: '/projects' },
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
            console.error("Failed to evaluate project: ", error);
            setAlertInfo({
                isOpen: true,
                status: 'error',
                message: error?.data?.message || t('Failed to evaluate project'),
            });
        }
    };

    const projectMembers = project.assignees?.map(member => ({
        name: member.name,
        imageProfile: member.imageProfile || member.avatar,
        email: member.email,
        rule: member.role,
    })) || [];

    const tasks = mappedTasks;

    const comments = project?.comments || [];
    const attachments = project?.attachments || [];

    const canDeleteAttachments = authUserType === "Subscriber" || user?.permissions?.includes('manage_attachments');
    const canEvaluate = authUserType === "Subscriber" || user?.permissions?.includes('evaluate');

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
        <Page title={t("Project Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"w-full flex items-start  gap-8 flex-col md:flex-row"}>
                <div className={"flex flex-col gap-6 md:w-[60%] w-full "}>
                    <InfoCard 
                        type={"project"} 
                        data={projectInfoData} 
                        handelEditAction={handelEditModal} 
                        rate={project.overall_rating || 0}
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
                    {true && <ProjectMembers members={projectMembers} />}
                    {/* Hiding components not yet linked to backend data */}
                    {true && <AttachmentsList 
                        attachments={attachments} 
                        onUpload={handleUploadAttachment} 
                        onDelete={canDeleteAttachments ? handleDeleteAttachment : null}
                        isUploading={isUploadingAttachment} 
                    />}
                    {true && <ActivityLogs activityLogs={activityLogs} isRawLogs={true} className={"h-72"} />}
                    {false && <TimeLine />}
                </div>

            </div>
            <EditProjectModal project={project} isOpen={isOpenEditModal} onClose={handelEditModal} />
        </Page>
    );
}

ProjectDetailsPage.propTypes = {}
export default ProjectDetailsPage;