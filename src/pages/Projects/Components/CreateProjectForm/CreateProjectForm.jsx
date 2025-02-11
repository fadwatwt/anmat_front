import { useState } from 'react';
import StepsComponent from "./StepsComponent.jsx";
import Page from "../../../Page.jsx";
import ProjectInfoForm from "./ProjectInfoForm.jsx";
import CreateTaskForm from "./CreateTaskForm.jsx";

function CreateProjectForm() {
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
        // const newStepNumber = steps.filter(step => step.title.startsWith('Task')).length + 1;
        const newTaskStep = {
            title: `Task`,
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
                    handelAddTask={handleAddTask}
                />
            </div>
        </Page>
    );
}

export default CreateProjectForm;
