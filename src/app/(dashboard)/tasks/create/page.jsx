"use client"
import { useState } from 'react';
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import { useCreateSubscriberTaskMutation } from "@/redux/tasks/subscriberTasksApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";

function CreateTask() {
    const { t } = useTranslation();
    const router = useRouter();
    const [createTask, { isLoading }] = useCreateSubscriberTaskMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [pendingValues, setPendingValues] = useState(null);

    const breadcrumbItems = [
        { title: t('Tasks'), path: '/tasks' },
        { title: t('Create a Task'), path: '' }
    ];

    const initialValues = {
        project_id: "",
        title: "",
        description: "",
        department_id: "",
        assignee_id: "",
        status: "open",
        priority: "medium",
        start_date: "",
        due_date: "",
        end_date: "",
        progress: 0,
        is_template: false,
        stages: [],
    };

    const onSubmit = (values) => {
        setPendingValues(values);
        setIsApprovalOpen(true);
    };

    const handleConfirmCreate = async () => {
        setIsApprovalOpen(false);
        if (!pendingValues) return;

        try {
            const payload = {
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
                    ...stage,
                    start_date: stage.start_date ? new Date(stage.start_date).toISOString() : undefined,
                    due_date: stage.due_date ? new Date(stage.due_date).toISOString() : undefined,
                })),
            };

            const response = await createTask(payload).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || t("Task created successfully"),
            });
            setTimeout(() => {
                router.push("/tasks");
            }, 1500);
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to create task"),
            });
        }
    };

    const handleCloseAlert = () => {
        setApiResponse({ ...apiResponse, isOpen: false });
    };

    return (
        <Page title={t("Create a Task")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl flex flex-col gap-4 w-full mx-auto bg-white dark:bg-white-0 p-5 rounded-2xl"}>
                <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
                                        disabled={isLoading}
                                        className="bg-primary-base dark:bg-primary-200 dark:text-black min-w-[140px] text-white p-[10px] rounded-[10px] disabled:opacity-50"
                                    >
                                        {t("Create Task")}
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
                onConfirm={handleConfirmCreate}
                title={t("Confirm Task Creation")}
                message={t("Are you sure you want to create this task?")}
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

export default CreateTask;