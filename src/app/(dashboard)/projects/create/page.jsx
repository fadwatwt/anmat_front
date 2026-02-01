"use client"
import { useState } from 'react';
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import Page from "@/components/Page.jsx";
import ProjectInfoForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/ProjectInfoForm.jsx";
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";

import { useCreateSubscriberProjectMutation } from "@/redux/projects/subscriberProjectsApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

function CreateProjectPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [createProject, { isLoading }] = useCreateSubscriberProjectMutation();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [pendingValues, setPendingValues] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isProjectCreated, setIsProjectCreated] = useState(false);
    const [projectId, setProjectId] = useState(null);

    const breadcrumbItems = [
        { title: t('Projects'), path: '/projects' },
        { title: t('Create a project'), path: '' }
    ];

    const projectInfoStep = {
        title: 'Project Info',
        content: <ProjectInfoForm />,
    };

    const [steps, setSteps] = useState([projectInfoStep]);

    const handleAddTask = () => {
        const taskCount = steps.filter(step => step.title.startsWith('Task')).length + 1;
        const newTaskStep = {
            title: `Task ${taskCount}`,
            content: <CreateTaskForm />,
        };
        setSteps([...steps, newTaskStep]);
    };

    const handleCreateProject = (values) => {
        // If we are on step 1 and project isn't created yet, submit to API
        if (currentStep === 1 && !isProjectCreated) {
            setPendingValues(values);
            setIsApprovalOpen(true);
        } else {
            // Handle task creation or finishing the flow
            console.log("Submit Tasks for Project ID:", projectId, values);
            router.push("/projects");
        }
    };

    const onConfirmCreate = async () => {
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
            setProjectId(response?.data?._id || response?._id);
            setIsProjectCreated(true);

            // Add first task step and navigate
            setSteps([projectInfoStep, {
                title: 'Task 1',
                content: <CreateTaskForm />,
            }]);
            setCurrentStep(2);

            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || t("Project created successfully. Now you can add tasks."),
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to create project"),
            });
        }
    };

    const handleCloseAlert = () => {
        setApiResponse({ ...apiResponse, isOpen: false });
    };

    return (
        <Page title={t("Create a project")} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl w-full mx-auto bg-white dark:bg-white-0 p-5 rounded-2xl"}>
                <StepsComponent
                    steps={steps}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    handelCreateProject={handleCreateProject}
                    disabled={isLoading}
                    initialValues={{
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
                    }}
                    handelAddTask={handleAddTask}
                    buttonText={currentStep === 1 && !isProjectCreated ? t("Create Project & Continue") : t("Finish")}
                />
            </div>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={onConfirmCreate}
                title={t("Confirm Project Creation")}
                message={t("Are you sure you want to create this project and continue to tasks?")}
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
