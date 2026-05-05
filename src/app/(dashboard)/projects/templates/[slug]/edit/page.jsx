"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import TemplateInfoForm from "@/app/(dashboard)/projects/templates/_components/TemplateInfoForm.jsx";
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useProcessing } from "@/app/providers";
import {
    useGetProjectTemplateDetailsQuery,
    useUpdateProjectTemplateMutation,
} from "@/redux/projects/subscriberProjectTemplatesApi";
import { convertToSlug } from "@/functions/AnotherFunctions.js";

function EditTemplatePage() {
    const { slug } = useParams();
    const router = useRouter();
    const { t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();

    // Slug here is just the raw ID (from handleEditTemplate: template._id)
    const templateId = slug;

    const { data: template, isLoading, isError } = useGetProjectTemplateDetailsQuery(templateId, {
        skip: !templateId,
    });

    const [updateTemplate] = useUpdateProjectTemplateMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });

    const breadcrumbItems = [
        { title: t("Projects"), path: "/projects" },
        { title: t("Templates"), path: "/projects?tab=1" },
        { title: template?.name || t("Template"), path: `/projects/templates/${templateId}-${convertToSlug(template?.name || "")}` },
        { title: t("Edit"), path: "" },
    ];

    if (isLoading)
        return <div className="flex items-center justify-center h-screen">{t("Loading...")}</div>;
    if (isError)
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                {t("Error loading template")}
            </div>
        );

    const formatDate = (date) => (date ? date.split("T")[0] : "");

    const initialValues = {
        projectName: template?.name || "",
        category: template?.category || "",
        description: template?.description || "",
        department: template?.department?._id || template?.department_id || "",
        manager: template?.manager?._id || template?.manager_id || "",
        assignees: template?.assignees?.map((a) => ({
            id: a.user_id || a._id,
            name: a.name,
        })) || [],
        assignedDate: formatDate(template?.start_date),
        dueDate: formatDate(template?.due_date),
        rating: template?.rating || "",
        status: template?.status || "draft",
    };

    const steps = [
        {
            title: t("Template Info"),
            content: <TemplateInfoForm template={template} />,
        },
        ...(template?.tasks || []).map((task, index) => ({
            title: `${t("Task")} ${index + 1}`,
            content: <CreateTaskForm task={task} type="task" hideProjectSelect={true} />,
        })),
    ];

    const handleUpdateTemplate = async (values) => {
        showProcessing(t("Updating template..."));
        try {
            const payload = {
                name: values.projectName,
                category: values.category,
                description: values.description,
                department_id: values.department || undefined,
                manager_id: values.manager || undefined,
                assignees_ids: Array.isArray(values.assignees)
                    ? values.assignees.map((a) => (typeof a === "object" ? a.id : a))
                    : [],
                start_date: values.assignedDate
                    ? new Date(values.assignedDate).toISOString()
                    : undefined,
                due_date: values.dueDate
                    ? new Date(values.dueDate).toISOString()
                    : undefined,
                status: values.status || undefined,
            };

            await updateTemplate({ id: templateId, data: payload }).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Template updated successfully"),
            });
            setTimeout(() => {
                router.push("/projects?tab=1");
            }, 1500);
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update template"),
            });
        } finally {
            hideProcessing();
        }
    };

    return (
        <Page title={t("Edit Template")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className="max-w-4xl w-full mx-auto bg-white dark:bg-white-0 p-5 rounded-2xl">
                <StepsComponent
                    steps={steps}
                    handelCreateProject={handleUpdateTemplate}
                    buttonText={t("Save Changes")}
                    initialValues={initialValues}
                />
            </div>

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
            />
        </Page>
    );
}

export default EditTemplatePage;
