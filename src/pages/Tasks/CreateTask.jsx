import CreateTaskForm from "../Projects/Components/CreateProjectForm/CreateTaskForm.jsx";
import {useState} from "react";
import ProjectInfoForm from "../Projects/Components/CreateProjectForm/ProjectInfoForm.jsx";
import Page from "../Page.jsx";
import {useTranslation} from "react-i18next";

function CreateTask() {
    const {t} = useTranslation()
    const breadcrumbItems = [
        { title: 'Tasks', path: '/tasks' },
        { title: 'Create a Task', path: '' }
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

    const handleCreateTask = () => {
        console.log("Project Created");
    };

    return (
        <Page title={"Create a Task"} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl flex flex-col gap-4 w-full mx-auto bg-white dark:bg-white-0 p-5 rounded-2xl"}>
                <CreateTaskForm/>
                <div className={"flex gap-4 justify-start"}>
                    <button onClick={handleCreateTask}
                            className=" bg-primary-base dark:bg-primary-200 dark:text-black w-40 text-white p-[10px] rounded-[10px] ">
                        {t("Create the Task")}
                    </button>
                </div>
            </div>
        </Page>
    );
}

export default CreateTask;