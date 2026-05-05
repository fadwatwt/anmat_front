"use client";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Page from "@/components/Page.jsx";
import InfoCard from "@/app/(dashboard)/_components/InfoCard.jsx";
import ProjectMembers from "@/app/(dashboard)/projects/[slug]/_components/ProjectMembers.jsx";
import TasksList from "@/app/(dashboard)/projects/[slug]/_components/TasksList.jsx";
import AttachmentsList from "@/app/(dashboard)/projects/[slug]/_components/AttachmentsList.jsx";
import { useGetProjectTemplateDetailsQuery } from "@/redux/projects/subscriberProjectTemplatesApi";

function TemplateDetailsPage() {
    const { slug } = useParams();
    const { t } = useTranslation();

    // Slug format is "{24-char-id}-{name-slug}" — extract just the ID
    const templateId = slug?.substring(0, 24);

    const { data: template, isLoading, isError, error } = useGetProjectTemplateDetailsQuery(
        templateId,
        { skip: !templateId }
    );

    const breadcrumbItems = [
        { title: t("Projects"), path: "/projects" },
        { title: t("Templates"), path: "/projects?tab=1" },
        { title: template?.name || t("Template Details"), path: "" },
    ];

    if (isLoading)
        return <div className="flex items-center justify-center h-screen">{t("Loading...")}</div>;
    if (isError)
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                {error?.data?.message || t("Error loading template details")}
            </div>
        );

    const templateInfoData = {
        name: template?.name,
        description: template?.description,
        status: template?.status || "draft",
        totalTasks: template?.tasks?.length || 0,
        completedTasks: 0,
        assignedDate: template?.start_date,
        dueDate: template?.due_date,
        department: template?.department?.name || null,
    };

    const mappedTasks =
        template?.tasks?.map((task) => ({
            ...task,
            name: task.title,
            delivery: task.status,
            members: [],
            assignedDate: task.start_date,
            dueDate: task.due_date,
            rate: task.rate || 0,
        })) || [];

    const templateMembers =
        template?.assignees?.map((member) => ({
            name: member.name,
            imageProfile: member.imageProfile || member.avatar,
            email: member.email,
            rule: member.role || "Assignee",
        })) || [];

    const handleEdit = () => {
        window.location.href = `/projects/templates/${templateId}/edit`;
    };

    return (
        <Page title={t("Template Details")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className="w-full flex items-start gap-8 flex-col md:flex-row">
                {/* Left column */}
                <div className="flex flex-col gap-6 md:w-[60%] w-full">
                    <InfoCard
                        type="project"
                        data={templateInfoData}
                        handelEditAction={handleEdit}
                    />

                    <div className="p-4 bg-surface rounded-2xl w-full flex flex-col gap-3">
                        <div className="title-header pb-3 w-full flex items-center justify-between">
                            <p className="text-lg text-table-title">{t("Template Tasks")}</p>
                        </div>
                        {mappedTasks.length > 0 ? (
                            <TasksList
                                tasks={mappedTasks}
                                isAssignedDate={true}
                                isEmployeeView={false}
                            />
                        ) : (
                            <p className="text-sm text-cell-secondary text-center py-4">
                                {t("No tasks added to this template")}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right column */}
                <div className="flex-1 flex flex-col gap-6">
                    {templateMembers.length > 0 && <ProjectMembers members={templateMembers} />}
                    {template?.attachments?.length > 0 && (
                        <AttachmentsList attachments={template.attachments} />
                    )}
                </div>
            </div>
        </Page>
    );
}

export default TemplateDetailsPage;
