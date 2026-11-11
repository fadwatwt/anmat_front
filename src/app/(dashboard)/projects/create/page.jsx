"use client"
import { useState, useMemo } from 'react';
import Page from "@/components/Page.jsx";
import ProjectInfoForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/ProjectInfoForm.jsx";
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";
import { useCreateSubscriberProjectMutation } from "@/redux/projects/subscriberProjectsApi";
import { useCreateSubscriberTaskMutation } from "@/redux/tasks/subscriberTasksApi";
import { useCreateProjectFromTemplateMutation, useGetProjectTemplateDetailsQuery } from "@/redux/projects/subscriberProjectTemplatesApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useProcessing } from "@/app/providers";
import { Formik, Form } from 'formik';
import ProjectCreatedSummary from "@/app/(dashboard)/projects/_components/ProjectCreatedSummary";
import PermissionGuard from "@/components/PermissionGuard";
import { createProjectValidationSchema, createTaskValidationSchema } from "@/app/(dashboard)/projects/_components/CreateProjectForm/workItemValidation";

function CreateProjectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateId = searchParams.get("templateId");

    const { t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();
    
    const { data: templateDetails } = useGetProjectTemplateDetailsQuery(templateId, { skip: !templateId });
    const template = templateDetails;

    const [createProject, { isLoading: isCreatingProject }] = useCreateSubscriberProjectMutation();
    const [createProjectFromTemplate, { isLoading: isCreatingFromTemplate }] = useCreateProjectFromTemplateMutation();
    const [createTask, { isLoading: isCreatingTask }] = useCreateSubscriberTaskMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'project' or 'task'
    const [pendingValues, setPendingValues] = useState(null);

    // Project creation state
    const [createdProject, setCreatedProject] = useState(null);
    const [isProjectCreated, setIsProjectCreated] = useState(false);

    // Task creation state
    const [createdTasks, setCreatedTasks] = useState([]);
    const taskCount = createdTasks.length;
    const [showTaskForm, setShowTaskForm] = useState(false);

    const breadcrumbItems = [
        { title: t('Projects'), path: '/projects' },
        { title: t(isProjectCreated ? 'Project Created Successfully' : 'Create a project'), path: '' }
    ];

    const projectInitialValues = useMemo(() => ({
        name: template?.name || "",
        description: template?.description || "",
        department_id: template?.department?._id || template?.department_id || "",
        manager_id: template?.manager?._id || template?.manager_id || "",
        assignees_ids: template?.assignees?.map(a => ({ 
            id: a._id, 
            name: a.user?.name || a.name || t("Unknown") 
        })) || [],
        start_date: "",
        due_date: "",
        started_in: "",
        finished_in: "",
        status: template?.status || "open",
        progress: template?.progress?.toString() || "0"
    }), [template, t]);

    // Task initial values - uses project's department as default
    const getTaskInitialValues = () => ({
        project_id: createdProject?._id || createdProject?.id || "",
        title: "",
        description: "",
        department_id: createdProject?.department_id || createdProject?.department?._id || "",
        assignee_id: "",
        status: "open",
        priority: "medium",
        estimated_hours: 0,
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

            showProcessing(t("Creating project..."));
            let response;
            if (templateId) {
                response = await createProjectFromTemplate({ templateId, data: payload }).unwrap();
            } else {
                response = await createProject(payload).unwrap();
            }
            hideProcessing();
            const projectData = response?.data || response;
            setCreatedProject(projectData);
            setCreatedTasks(Array.isArray(projectData.tasks) ? projectData.tasks.filter(task => task && typeof task === "object") : []);
            setIsProjectCreated(true);

            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Project created successfully!"),
            });
        } catch (error) {
            hideProcessing();
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
                estimated_hours: Number(pendingValues.estimated_hours) || 0,
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

            showProcessing(t("Creating task..."));
            const taskResponse = await createTask(payload).unwrap();
            const savedTask = taskResponse?.data || taskResponse;
            hideProcessing();
            setCreatedTasks(prev => [...prev, { ...payload, ...savedTask }]);
            setShowTaskForm(false); // Hide form after successful creation

            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Task created successfully! You can add another task or finish."),
            });
        } catch (error) {
            hideProcessing();
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
        router.push("/projects/" + (createdProject._id || createdProject.id) + "/details");
    };

    const handleAddNewTask = () => {
        setShowTaskForm(true);
    };

    return (
        <PermissionGuard permission="projects.create">
        <Page title={t(isProjectCreated ? "Project Created Successfully" : "Create a project")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl w-full mx-auto flex flex-col gap-6"}>
                {isProjectCreated && createdProject && <ProjectCreatedSummary
                    project={createdProject}
                    tasks={createdTasks}
                    onViewProject={handleFinish}
                    onAddTask={handleAddNewTask}
                    showActions={!showTaskForm}
                />}

                {/* Main Form Container */}
                <div className={!isProjectCreated || showTaskForm ? "bg-surface p-4 sm:p-5 rounded-2xl shadow-sm border border-status-border" : "hidden"}>
                    {/* Step 1: Project Info Form */}
                    {!isProjectCreated && (
                        <Formik 
                            initialValues={projectInitialValues} 
                            validationSchema={createProjectValidationSchema(t)}
                            onSubmit={handleProjectSubmit}
                            enableReinitialize={true}
                        >
                            {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
                                <Form className="flex flex-col gap-4">
                                    <ProjectInfoForm
                                        values={values}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        setFieldValue={setFieldValue}
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-4">
                                        <button
                                            type="submit"
                                            disabled={isCreatingProject || isCreatingFromTemplate}
                                            className="bg-primary-base dark:bg-primary-200 dark:text-black min-w-[160px] text-white p-[10px] rounded-[10px] disabled:opacity-50"
                                        >
                                            {isCreatingProject || isCreatingFromTemplate ? t("Creating...") : t("Create Project")}
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

                    {/* Task Form */}
                    {isProjectCreated && showTaskForm && (
                        <Formik
                            initialValues={getTaskInitialValues()}
                            validationSchema={createTaskValidationSchema(t)}
                            onSubmit={handleTaskSubmit}
                            enableReinitialize
                        >
                            {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
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
                                        handleBlur={handleBlur}
                                        setFieldValue={setFieldValue}
                                        errors={errors}
                                        touched={touched}
                                        lockedProjectId={createdProject?._id || createdProject?.id}
                                        lockedProjectName={createdProject?.name}
                                    />
                                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mt-4">
                                        <div className="flex flex-col sm:flex-row gap-3">
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
                isSubmitting={isCreatingProject || isCreatingFromTemplate || isCreatingTask}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleCloseAlert}
            />
        </Page>
        </PermissionGuard>
    );
}

export default CreateProjectPage;

