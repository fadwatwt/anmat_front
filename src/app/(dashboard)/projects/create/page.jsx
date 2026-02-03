"use client"
import { useState } from 'react';
import Page from "@/components/Page.jsx";
import ProjectInfoForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/ProjectInfoForm.jsx";
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";
import { useCreateSubscriberProjectMutation } from "@/redux/projects/subscriberProjectsApi";
import { useCreateSubscriberTaskMutation } from "@/redux/tasks/subscriberTasksApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import { FaCheckCircle, FaProjectDiagram } from 'react-icons/fa';
import { translateDate } from "@/functions/Days";

function CreateProjectPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [createProject, { isLoading: isCreatingProject }] = useCreateSubscriberProjectMutation();
    const [createTask, { isLoading: isCreatingTask }] = useCreateSubscriberTaskMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'project' or 'task'
    const [pendingValues, setPendingValues] = useState(null);

    // Project creation state
    const [createdProject, setCreatedProject] = useState(null);
    const [isProjectCreated, setIsProjectCreated] = useState(false);

    // Task creation state
    const [taskCount, setTaskCount] = useState(0);
    const [showTaskForm, setShowTaskForm] = useState(false);

    const breadcrumbItems = [
        { title: t('Projects'), path: '/projects' },
        { title: t('Create a project'), path: '' }
    ];

    const projectInitialValues = {
        name: "",
        description: "",
        department_id: "",
        manager_id: "",
        assignees_ids: [],
        start_date: "",
        due_date: "",
        started_in: "",
        finished_in: "",
        status: "open",
        progress: "0"
    };

    // Task initial values - uses project's department as default
    const getTaskInitialValues = () => ({
        project_id: createdProject?._id || createdProject?.id || "",
        title: "",
        description: "",
        department_id: createdProject?.department_id || createdProject?.department?._id || "",
        assignee_id: "",
        status: "open",
        priority: "medium",
        start_date: "",
        due_date: "",
        end_date: "",
        progress: 0,
        is_template: false,
        stages: [],
    });

    // Handle project form submission
    const handleProjectSubmit = (values) => {
        setPendingValues(values);
        setPendingAction('project');
        setIsApprovalOpen(true);
    };

    // Confirm project creation
    const onConfirmProjectCreate = async () => {
        setIsApprovalOpen(false);
        if (!pendingValues) return;

        try {
            const payload = {
                name: pendingValues.name,
                description: pendingValues.description,
                manager_id: pendingValues.manager_id || undefined,
                department_id: pendingValues.department_id || undefined,
                assignees_ids: pendingValues.assignees_ids?.map(tag => tag.id) || [],
                start_date: pendingValues.start_date ? new Date(pendingValues.start_date).toISOString() : undefined,
                due_date: pendingValues.due_date ? new Date(pendingValues.due_date).toISOString() : undefined,
                started_in: pendingValues.started_in ? new Date(pendingValues.started_in).toISOString() : undefined,
                finished_in: pendingValues.finished_in ? new Date(pendingValues.finished_in).toISOString() : undefined,
                progress: Number(pendingValues.progress) || 0,
                status: pendingValues.status || "open",
            };

            const response = await createProject(payload).unwrap();
            const projectData = response?.data || response;
            setCreatedProject(projectData);
            setIsProjectCreated(true);

            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || t("Project created successfully!"),
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to create project"),
            });
        }
    };

    // Handle task form submission
    const handleTaskSubmit = (values) => {
        setPendingValues(values);
        setPendingAction('task');
        setIsApprovalOpen(true);
    };

    // Confirm task creation
    const onConfirmTaskCreate = async () => {
        setIsApprovalOpen(false);
        if (!pendingValues || !createdProject) return;

        try {
            const payload = {
                project_id: createdProject._id || createdProject.id,
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
            setTaskCount(prev => prev + 1);
            setShowTaskForm(false); // Hide form after successful creation

            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || t("Task created successfully! You can add another task or finish."),
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to create task"),
            });
        }
    };

    const handleConfirm = () => {
        if (pendingAction === 'project') {
            onConfirmProjectCreate();
        } else if (pendingAction === 'task') {
            onConfirmTaskCreate();
        }
    };

    const handleCloseAlert = () => {
        setApiResponse({ ...apiResponse, isOpen: false });
    };

    const handleFinish = () => {
        router.push("/projects");
    };

    const handleAddNewTask = () => {
        setShowTaskForm(true);
    };

    const handleSkipTasks = () => {
        router.push("/projects");
    };

    return (
        <Page title={t("Create a project")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl w-full mx-auto flex flex-col gap-6"}>
                {/* Project Details Header (shown after project creation) */}
                {isProjectCreated && createdProject && (
                    <div className="bg-white dark:bg-white-0 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                                <FaProjectDiagram size={28} className="text-primary-500 dark:text-primary-300" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaCheckCircle className="text-green-500" size={18} />
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{t("Project Created Successfully")}</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{createdProject.name}</h2>
                                {createdProject.description && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{createdProject.description}</p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {createdProject.start_date && (
                                        <div>
                                            <span className="text-gray-400 dark:text-gray-500">{t("Start Date")}:</span>{" "}
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{translateDate(createdProject.start_date)}</span>
                                        </div>
                                    )}
                                    {createdProject.due_date && (
                                        <div>
                                            <span className="text-gray-400 dark:text-gray-500">{t("Due Date")}:</span>{" "}
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{translateDate(createdProject.due_date)}</span>
                                        </div>
                                    )}
                                    {taskCount > 0 && (
                                        <div className="bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                                            <span className="font-medium text-primary-600 dark:text-primary-300">{taskCount} {t("Task(s) Added")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Form Container */}
                <div className="bg-white dark:bg-white-0 p-5 rounded-2xl">
                    {/* Step 1: Project Info Form */}
                    {!isProjectCreated && (
                        <Formik initialValues={projectInitialValues} onSubmit={handleProjectSubmit}>
                            {({ values, handleChange, setFieldValue }) => (
                                <Form className="flex flex-col gap-4">
                                    <ProjectInfoForm
                                        values={values}
                                        handleChange={handleChange}
                                        setFieldValue={setFieldValue}
                                    />
                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            type="submit"
                                            disabled={isCreatingProject}
                                            className="bg-primary-base dark:bg-primary-200 dark:text-black min-w-[160px] text-white p-[10px] rounded-[10px] disabled:opacity-50"
                                        >
                                            {isCreatingProject ? t("Creating...") : t("Create Project")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 min-w-[140px] p-[10px] rounded-[10px]"
                                        >
                                            {t("Cancel")}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {/* Step 2: Task Creation (Optional) */}
                    {isProjectCreated && !showTaskForm && (
                        <div className="flex flex-col items-center gap-6 py-8">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold dark:text-gray-200 mb-2">
                                    {taskCount === 0 ? t("Would you like to add tasks to this project?") : t("Add another task?")}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {t("You can add tasks now or finish and add them later.")}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddNewTask}
                                    className="bg-primary-base dark:bg-primary-200 dark:text-black min-w-[160px] text-white p-[12px] rounded-[10px] flex items-center justify-center gap-2"
                                >
                                    <span>+</span> {t("Add Task")}
                                </button>
                                <button
                                    onClick={handleFinish}
                                    className="border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 min-w-[160px] p-[12px] rounded-[10px]"
                                >
                                    {taskCount === 0 ? t("Skip & Finish") : t("Finish")}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Task Form */}
                    {isProjectCreated && showTaskForm && (
                        <Formik
                            initialValues={getTaskInitialValues()}
                            onSubmit={handleTaskSubmit}
                            enableReinitialize
                        >
                            {({ values, handleChange, setFieldValue }) => (
                                <Form className="flex flex-col gap-4">
                                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                                        <h3 className="text-lg font-semibold dark:text-gray-200">
                                            {t("Create Task")} #{taskCount + 1}
                                        </h3>
                                    </div>
                                    <CreateTaskForm
                                        type="task"
                                        values={values}
                                        handleChange={handleChange}
                                        setFieldValue={setFieldValue}
                                        lockedProjectId={createdProject?._id || createdProject?.id}
                                        lockedProjectName={createdProject?.name}
                                    />
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={isCreatingTask}
                                                className="bg-primary-base dark:bg-primary-200 dark:text-black min-w-[160px] text-white p-[10px] rounded-[10px] disabled:opacity-50"
                                            >
                                                {isCreatingTask ? t("Creating...") : t("Create Task")}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowTaskForm(false)}
                                                className="border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 min-w-[100px] p-[10px] rounded-[10px]"
                                            >
                                                {t("Cancel")}
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleFinish}
                                            className="text-primary-base dark:text-primary-200 underline"
                                        >
                                            {t("Finish without saving this task")}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={handleConfirm}
                title={pendingAction === 'project' ? t("Confirm Project Creation") : t("Confirm Task Creation")}
                message={pendingAction === 'project'
                    ? t("Are you sure you want to create this project?")
                    : t("Are you sure you want to create this task?")}
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

export default CreateProjectPage;

