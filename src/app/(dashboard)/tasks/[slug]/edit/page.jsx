"use client"
import { useState, useMemo, use } from 'react';
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import { useGetSubscriberTaskDetailsQuery, useUpdateSubscriberTaskMutation } from "@/redux/tasks/subscriberTasksApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";

function EditTask({ params }) {
    const { t } = useTranslation();
    const router = useRouter();
    const resolvedParams = use(params);
    const slug = resolvedParams?.slug;
    const taskId = slug?.includes("-") ? slug.split("-")[0] : slug;

    const { data: taskData, isLoading: isFetching, isError } = useGetSubscriberTaskDetailsQuery(taskId, {
        skip: !taskId
    });
    const [updateTask, { isLoading: isUpdating }] = useUpdateSubscriberTaskMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [pendingValues, setPendingValues] = useState(null);

    const breadcrumbItems = [
        { title: t('Tasks'), path: '/tasks' },
        { title: t('Edit Task'), path: '' }
    ];

    // Format date for input fields (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        return dateString.split("T")[0];
    };

    const initialValues = useMemo(() => {
        if (!taskData) return null;
        return {
            project_id: taskData.project_id || taskData.project?._id || "",
            title: taskData.title || "",
            description: taskData.description || "",
            department_id: taskData.department_id || taskData.department?._id || "",
            assignee_id: taskData.assignee_id || taskData.assignee?._id || "",
            status: taskData.status || "open",
            priority: taskData.priority || "medium",
            start_date: formatDateForInput(taskData.start_date),
            due_date: formatDateForInput(taskData.due_date),
            end_date: formatDateForInput(taskData.end_date),
            progress: taskData.progress || 0,
            is_template: taskData.is_template || false,
            stages: (taskData.stages || []).map(stage => ({
                ...stage,
                start_date: formatDateForInput(stage.start_date),
                due_date: formatDateForInput(stage.due_date),
            })),
        };
    }, [taskData]);

    const onSubmit = (values) => {
        setPendingValues(values);
        setIsApprovalOpen(true);
    };

    const handleConfirmUpdate = async () => {
        setIsApprovalOpen(false);
        if (!pendingValues) return;

        try {
            const payload = {
                id: taskId,
                project_id: pendingValues.project_id,
                title: pendingValues.title,
                description: pendingValues.description,
                department_id: pendingValues.department_id || undefined,
                assignee_id: pendingValues.assignee_id,
                status: pendingValues.status,
                priority: pendingValues.priority,
                start_date: pendingValues.start_date ? new Date(pendingValues.start_date).toISOString() : undefined,
                due_date: pendingValues.due_date ? new Date(pendingValues.due_date).toISOString() : undefined,
                end_date: pendingValues.end_date ? new Date(pendingValues.end_date).toISOString() : undefined,
                progress: Number(pendingValues.progress) || 0,
                is_template: pendingValues.is_template,
                stages: pendingValues.stages.map(stage => ({
                    name: stage.name,
                    description: stage.description,
                    status: stage.status || "pending",
                    start_date: stage.start_date ? new Date(stage.start_date).toISOString() : undefined,
                    due_date: stage.due_date ? new Date(stage.due_date).toISOString() : undefined,
                })),
                ratings: [],
                time_tracks: [],
                comments: [],
            };

            const response = await updateTask(payload).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || t("Task updated successfully"),
            });
            setTimeout(() => {
                router.push("/tasks");
            }, 1500);
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update task"),
            });
        }
    };

    const handleCloseAlert = () => {
        setApiResponse({ ...apiResponse, isOpen: false });
    };

    if (isFetching) {
        return (
            <Page title={t("Edit Task")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">{t("Loading task data...")}</p>
                </div>
            </Page>
        );
    }

    if (isError || !taskData || !initialValues) {
        return (
            <Page title={t("Edit Task")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
                <div className="flex items-center justify-center h-64 text-red-500 text-center">
                    <p>{t("Failed to load task data. Please try again later.")}</p>
                </div>
            </Page>
        );
    }

    return (
        <Page title={t("Edit Task")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl flex flex-col gap-4 w-full mx-auto bg-white dark:bg-white-0 p-5 rounded-2xl"}>
                <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
                    {({ values, handleChange, setFieldValue }) => (
                        <Form className="flex flex-col gap-4">
                            <CreateTaskForm
                                type="task"
                                values={values}
                                handleChange={handleChange}
                                setFieldValue={setFieldValue}
                            />
                            <div className={"flex justify-between items-center mt-4"}>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="bg-primary-base dark:bg-primary-200 dark:text-black min-w-[140px] text-white p-[10px] rounded-[10px] disabled:opacity-50"
                                    >
                                        {isUpdating ? t("Updating...") : t("Update Task")}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 min-w-[140px] p-[10px] rounded-[10px]"
                                >
                                    {t("Back")}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={handleConfirmUpdate}
                title={t("Confirm Task Update")}
                message={t("Are you sure you want to update this task?")}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleCloseAlert}
            />
        </Page>
    );
}

export default EditTask;

