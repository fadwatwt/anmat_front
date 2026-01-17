"use client"
import { useState } from 'react';
import { useRouter } from "next/navigation";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import Page from "@/components/Page.jsx";
import TemplateInfoForm from "@/app/(dashboard)/projects/templates/_components/TemplateInfoForm.jsx";
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";

function CreateTemplatePage() {
    const router = useRouter();

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
        {
            title: 'Task (1)',
            content: <CreateTaskForm />,
        },
        {
            title: 'Task (2)',
            content: <CreateTaskForm />,
        },
    ];

    const [steps, setSteps] = useState(initialSteps);

    const handleAddTask = () => {
        const taskCount = steps.filter(step => step.title.startsWith('Task')).length + 1;
        const newTaskStep = {
            title: `Task (${taskCount})`,
            content: <CreateTaskForm />,
        };
        setSteps([...steps, newTaskStep]);
    };

    const handleCreateTemplate = () => {
        console.log("Template Created");
        // Add your template creation logic here
        router.push("/projects?tab=1"); // Redirect to templates tab
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
                        assignTasks: "",
                        description: "",
                        manager: "",
                        assignees: "",
                        rating: "",
                        status: ""
                    }}
                    handelAddTask={handleAddTask}
                />
            </div>
        </Page>
    );
}

export default CreateTemplatePage;
