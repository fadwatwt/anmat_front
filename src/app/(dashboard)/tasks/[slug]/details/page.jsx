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
import { useState } from "react";
import { filterAndSortTasks } from "@/functions/functionsForTasks.js";
import EditTaskModal from "@/app/(dashboard)/tasks/_modal/EditTaskModal.jsx";
import { useRouter } from "next/navigation";
import { filterOptions, tasks, comments, members as defaultMembers, attachments, activityLogs, tasksRows } from "@/functions/FactoryData.jsx";

function TaskDetailsPage({ params }) {
    const slug = params?.slug;
    const taskId = slug?.split("-")[0];
    const taskData = tasksRows.find(t => t.id === taskId) || tasksRows[0];

    const { t } = useTranslation()
    const breadcrumbItems = [
        { title: t('Tasks'), path: '/tasks' },
        { title: t('Task Details'), path: '' }
    ];

    const router = useRouter();
    const handleEditPageNavigation = () => {
        router.push(`/tasks/${slug}/edit`);
    }

    const [filterTasks, setFilterTasks] = useState(tasks);
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

    return (
        <>
            <Page title={t("Task Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
                <div className={"w-full flex items-start  gap-8 flex-col md:flex-row h-full"}>
                    <div className={"flex flex-col gap-6 md:w-[60%] w-full "}>
                        <InfoCard type={"task"} data={taskData} handelEditAction={handleEditPageNavigation} />
                        <div className={"p-4 bg-white dark:bg-white-0 rounded-2xl w-full flex flex-col gap-3 h-96"}>
                            <div className={"title-header pb-3 w-full flex items-center justify-between "}>
                                <p className={"text-lg dark:text-gray-200"}>{t("Task Stages")} </p>
                                <SelectWithoutLabel title={t("Filter by")} options={filterOptions} onChange={handelChangeFilterTask} className={"w-[120px] h-[36px]"} />
                            </div>
                            <TasksList isAssignedDate={true} tasks={filterTasks} />
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
                        <ProjectMembers members={taskData?.members || defaultMembers} title="Assignee Employee" />
                        <AttachmentsList attachments={attachments} />
                        <ActivityLogs activityLogs={activityLogs} className={"h-72"} />
                        <TimeLine />
                    </div>

                </div>
            </Page>

        </>
    );
}

TaskDetailsPage.propTypes = {
    slug: String,
}

export default TaskDetailsPage;