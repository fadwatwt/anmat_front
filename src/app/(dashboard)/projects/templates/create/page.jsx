"use client"
import { useState } from 'react';
import { useRouter } from "next/navigation";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import Page from "@/components/Page.jsx";
import TemplateInfoForm from "@/app/(dashboard)/projects/templates/_components/TemplateInfoForm.jsx";
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";

import { useTranslation } from 'react-i18next';
import { useProcessing } from "@/app/providers";
import { useCreateProjectTemplateMutation } from "@/redux/projects/subscriberProjectTemplatesApi";
import { useCreateSubscriberTaskMutation } from "@/redux/tasks/subscriberTasksApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function CreateTemplatePage() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });

    const breadcrumbItems = [
        { title: 'Projects', path: '/projects' },
        { title: 'Templates', path: '/projects?tab=1' },
        { title: 'Create a Template', path: '' }
    ];

    const initialSteps = [
        {
            title: 'Project Info',
            content: <TemplateInfoForm />,
        },
    ];

    const [steps, setSteps] = useState(initialSteps);

    const handleAddTask = () => {
        const taskCount = steps.filter(step => step.title.startsWith('Task')).length + 1;
        const newTaskStep = {
            title: `Task (${taskCount})`,
            content: <CreateTaskForm type="task" hideProjectSelect={true} />,
        };
        setSteps([...steps, newTaskStep]);
    };

    const [createTemplate, { isLoading: isCreatingTemplate }] = useCreateProjectTemplateMutation();
    const [createTask, { isLoading: isCreatingTask }] = useCreateSubscriberTaskMutation();

    const handleCreateTemplate = async (values) => {
        showProcessing();
        try {
            // 1. Create the Template
            const templateDto = {
                name: values.projectName,
                category: values.category,
                description: values.description,
                department_id: values.department,
                manager_id: values.manager,
                assignees_ids: values.assignees?.map(a => a.id) || [],
                status: values.status || "draft",
                // Dates are optional for templates but can be included
                start_date: values.assignedDate,
                due_date: values.dueDate,
            };

            const templateResponse = await createTemplate(templateDto).unwrap();
            const newTemplateId = templateResponse.data._id;

            // 2. Create Tasks if any
            const taskKeys = Object.keys(values).filter(key => key.startsWith('task_'));
            const tasks = taskKeys.map(key => values[key]);

            if (tasks.length > 0) {
                for (const taskData of tasks) {
                    const taskDto = {
                        title: taskData.title,
                        description: taskData.description,
                        project_template_id: newTemplateId,
                        assignee_id: taskData.assignee_id,
                        status: taskData.status || "open",
                        start_date: taskData.start_date,
                        due_date: taskData.due_date,
                        stages: taskData.stages || [],
                        is_template: true
                    };
                    await createTask(taskDto).unwrap();
                }
            }

            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Project template and tasks created successfully")
            });
            
            setTimeout(() => {
                router.push("/projects?tab=1");
            }, 2000);

        } catch (error) {
            console.error("Failed to create template:", error);
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to create project template")
            });
        } finally {
            hideProcessing();
        }
    };

    return (
        <Page title={"Creating a Templates"} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl w-full mx-auto bg-white dark:bg-white-0 p-5 rounded-2xl"}>
                <StepsComponent
                    steps={steps}
                    handelCreateProject={handleCreateTemplate}
                    buttonText="Create Template"
                    initialValues={{
                        dueDate: "",
                        assignedDate: "",
                        department: "",
                        taskName: "",
                        category: "",

                        description: "",
                        manager: "",
                        assignees: [],
                        rating: "",
                        status: ""
                    }}
                    handelAddTask={handleAddTask}
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

export default CreateTemplatePage;
