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
import { useGetSubscriberTaskDetailsQuery } from "@/redux/tasks/subscriberTasksApi";

function TaskDetailsPage({ params }) {
    const { t } = useTranslation();
    const router = useRouter();
    const resolvedParams = use(params);
    const slug = resolvedParams?.slug;
    // Handle both "id-title" and just "id"
    const taskId = slug?.includes("-") ? slug.split("-")[0] : slug;

    const { data: task, isLoading, isError } = useGetSubscriberTaskDetailsQuery(taskId, {
        skip: !taskId
    });

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
            name: stage.name,
            status: stage.status,
            assignedDate: stage.start_date,
            dueDate: stage.due_date,
            delivery: stage.status === "completed" ? "Delayed" : "", // Mapping to StateOfTask ahead of deadline
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
                            <TasksList isAssignedDate={true} tasks={mappedStages} />
                        </div>
                        <div className={"bg-white dark:bg-white-0 rounded-2xl w-full flex flex-col gap-3"}>
                            <div className={"p-4 flex flex-col gap-3"}>
                                <div className={"title-header w-full flex items-center justify-between"}>
                                    <p className={"text-lg dark:text-gray-200 "}>{t("Comments")}</p>
                                </div>
                                <TaskComments comments={task.comments || comments} />
                            </div>
                            <CommentInput />
                        </div>
                    </div>
                    <div className={"flex-1 flex flex-col gap-6"}>
                        <ProjectMembers members={assigneeMember.length > 0 ? assigneeMember : defaultMembers} title="Assignee Employee" />
                        <AttachmentsList attachments={attachments} />
                        <ActivityLogs activityLogs={activityLogs} className={"h-72"} />
                        <TimeLine />
                    </div>
                </div>
            </Page>
        </>
    );
}

export default TaskDetailsPage;
