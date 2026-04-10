"use client"
import Page from "@/components/Page.jsx";
import ProjectMembers from "@/app/(dashboard)/projects/[slug]/_components/ProjectMembers.jsx";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel.jsx";
import TasksList from "@/app/(dashboard)/projects/[slug]/_components/TasksList.jsx";
import { useTranslation } from "react-i18next";
import InfoCard from "@/app/(dashboard)/_components/InfoCard.jsx";
import { useState, useEffect } from "react";
import { filterAndSortTasks } from "@/functions/functionsForTasks.js";
import { useParams } from "next/navigation";
import { useGetEmployeeProjectDetailsQuery } from "@/redux/projects/employeeProjectsApi.js";
import { useUpdateTaskStatusMutation } from "@/redux/tasks/employeeTasksApi.js";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function EmployeeProjectDetailsPage() {
    const { slug } = useParams();
    const { t } = useTranslation()
    const { data: projectData, isLoading, isError, error, refetch } = useGetEmployeeProjectDetailsQuery(slug);
    const project = projectData?.data || projectData;
    const [updateTaskStatus] = useUpdateTaskStatusMutation();

    const [alertInfo, setAlertInfo] = useState({ isOpen: false, status: 'success', message: '' });
    const [filterTasks, setFilterTasks] = useState([]);

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
            rate: task.ratings?.length ? (task.ratings.reduce((acc, r) => acc + r.value, 0) / task.ratings.length) : 0
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

    return (
        <Page title={t("Project Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"w-full flex items-start  gap-8 flex-col md:flex-row"}>
                <div className={"flex flex-col gap-6 md:w-[60%] w-full "}>
                    <InfoCard type={"project"} data={projectInfoData} isEditBtn={false} />
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
                </div>
                <div className={"flex-1 flex flex-col gap-6"}>
                    <ProjectMembers members={projectMembers} />
                </div>
            </div>
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
