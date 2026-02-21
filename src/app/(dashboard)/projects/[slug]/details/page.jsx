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
import { useGetSubscriberProjectDetailsQuery } from "@/redux/projects/subscriberProjectsApi.js";

function ProjectDetailsPage() {
    const { slug } = useParams();
    const { t } = useTranslation()
    const { data: project, isLoading, isError, error } = useGetSubscriberProjectDetailsQuery(slug);

    const [isOpenEditModal, setIsOpenEditModal] = useState(false)
    const [filterTasks, setFilterTasks] = useState([]);

    useEffect(() => {
        if (project?.tasks) {
            setFilterTasks(project.tasks);
        }
    }, [project?.tasks]);

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

    const projectMembers = project.assignees?.map(member => ({
        name: member.name,
        imageProfile: member.imageProfile || member.avatar,
        email: member.email,
        rule: member.role,
    })) || [];

    const tasks = project.tasks || [];

    const comments = [
        // Placeholder for comments if they are not in the project details API yet
    ];

    const attachments = [
        // Placeholder for attachments
    ];

    const activityLogs = [
        // Placeholder for activity logs
    ];

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
                    <InfoCard type={"project"} data={projectInfoData} handelEditAction={handelEditModal} />
                    <div className={"p-4 bg-white dark:bg-white-0 rounded-2xl w-full flex flex-col gap-3"}>
                        <div className={"title-header pb-3 w-full flex items-center justify-between "}>
                            <p className={"text-lg dark:text-gray-200"}>{t("Project Tasks")} </p>
                            <SelectWithoutLabel onChange={handelChangeFilterTask} options={filterOptions} title={"Filter by"} className={"w-[120px] h-[36px]"} />
                        </div>
                        <TasksList tasks={filterTasks} />
                    </div>
                    <div className={"bg-white dark:bg-white-0 rounded-2xl w-full flex flex-col gap-3"}>
                        <div className={"p-4 flex flex-col gap-3"}>
                            <div className={"title-header w-full flex items-center justify-between"}>
                                <p className={"text-lg dark:text-gray-200 "}>{t("Comments")}</p>
                            </div>
                            <TaskComments comments={comments} />
                        </div>
                        <CommentInput />
                    </div>
                </div>
                <div className={"flex-1 flex flex-col gap-6"}>
                    <ProjectMembers members={projectMembers} />
                    {/* Keep other components but they might need data binding later */}
                    <AttachmentsList attachments={attachments} />
                    <ActivityLogs activityLogs={activityLogs} className={"h-72"} />
                    <TimeLine />
                </div>

            </div>
            <EditProjectModal project={project} isOpen={isOpenEditModal} onClose={handelEditModal} />
        </Page>
    );
}

ProjectDetailsPage.propTypes = {}
export default ProjectDetailsPage;