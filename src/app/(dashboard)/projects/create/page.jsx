"use client"
import { useState } from 'react';
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import Page from "@/components/Page.jsx";
import ProjectInfoForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/ProjectInfoForm.jsx";
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";

function CreateProjectPage() {
    const breadcrumbItems = [
        { title: 'Projects', path: '/projects' },
        { title: 'Create a project', path: '' }
    ];

    const initialSteps = [
        {
            title: 'Project Info',
            content: <ProjectInfoForm />,
        },
        {
            title: 'Task',
            content: <CreateTaskForm />,
        },

        {
            title: 'Task',
            content: <CreateTaskForm />,
        },
    ];

    const [steps, setSteps] = useState(initialSteps);

    const handleAddTask = () => {
        const taskCount = steps.filter(step => step.title.startsWith('Task')).length + 1;
        const newTaskStep = {
            title: `Task ${taskCount}`,
            content: <CreateTaskForm />,
        };
        setSteps([...steps, newTaskStep]);
    };

    const handleCreateProject = () => {
        console.log("Project Created");
    };

    return (
        <Page title={"Create a project"} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl w-full mx-auto bg-white dark:bg-white-0 p-5 rounded-2xl"}>
                <StepsComponent
                    steps={steps}
                    handelCreateProject={handleCreateProject}
                    initialValues={{dueDate:"",assignedDate:"",department:"",taskName:""}}
                    handelAddTask={handleAddTask}
                />
            </div>
        </Page>
    );
}

export default CreateProjectPage;
