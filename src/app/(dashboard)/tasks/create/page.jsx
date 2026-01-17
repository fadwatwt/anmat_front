"use client"
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

function CreateTask() {
    const { t } = useTranslation()
    const router = useRouter();
    const breadcrumbItems = [
        { title: 'Tasks', path: '/tasks' },
        { title: 'Create a Task', path: '' }
    ];

    // const initialSteps = [
    //     {
    //         title: 'Project Info',
    //         content: <ProjectInfoForm />,
    //     },
    //     {
    //         title: 'Task',
    //         content: <CreateTaskForm />,
    //     },
    //
    //     {
    //         title: 'Task',
    //         content: <CreateTaskForm />,
    //     },
    // ];

    // const [steps, setSteps] = useState(initialSteps);

    // const handleAddTask = () => {
    //     // const newStepNumber = steps.filter(step => step.title.startsWith('Task')).length + 1;
    //     const newTaskStep = {
    //         title: `Task`,
    //         content: <CreateTaskForm />,
    //     };
    //     setSteps([...steps, newTaskStep]);
    // };

    const handleCreateTask = () => {
        console.log("Project Created");
    };

    return (
        <Page title={"Create a Task"} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl flex flex-col gap-4 w-full mx-auto bg-white dark:bg-white-0 p-5 rounded-2xl"}>
                <CreateTaskForm />
                <div className={"flex justify-between items-center mt-4"}>
                    <div className="flex gap-4">
                        <button onClick={handleCreateTask}
                            className=" bg-primary-base dark:bg-primary-200 dark:text-black min-w-[140px] text-white p-[10px] rounded-[10px] ">
                            {t("Create Task")}
                        </button>
                        {/*                         
                        <button
                            className=" border border-primary-base text-primary-base dark:border-primary-200 dark:text-primary-200 min-w-[140px] p-[10px] rounded-[10px] flex items-center justify-center gap-2">
                            {t("Next")}
                            <span className="transform rotate-180">{'<'}</span> 
                        </button> 
                        */}

                    </div>
                    <button onClick={() => router.back()}
                        className=" border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 min-w-[140px] p-[10px] rounded-[10px] ">
                        {t("Back")}
                    </button>
                </div>
            </div>
        </Page>
    );
}

export default CreateTask;