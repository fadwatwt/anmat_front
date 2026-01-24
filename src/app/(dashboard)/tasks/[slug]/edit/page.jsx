"use client"
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { tasksRows } from "@/functions/FactoryData.jsx";

function EditTask({ params }) {
    const { t } = useTranslation()
    const router = useRouter();


    const slug = params?.slug;
    const taskId = slug?.split("-")[0];
    const taskData = tasksRows.find(t => t.id === taskId) || tasksRows[0];


    const breadcrumbItems = [
        { title: 'Tasks', path: '/tasks' },
        { title: 'Edit Task', path: '' }
    ];


    const handleUpdateTask = () => {
        console.log("Task Updated");
        router.back();
    };


    return (
        <Page title={"Edit Task"} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"max-w-4xl flex flex-col gap-4 w-full mx-auto bg-white dark:bg-white-0 p-5 rounded-2xl"}>
                <CreateTaskForm task={taskData} />
                <div className={"flex justify-between items-center mt-4"}>
                    <div className="flex gap-4">
                        <button onClick={handleUpdateTask}
                            className=" bg-primary-base dark:bg-primary-200 dark:text-black min-w-[140px] text-white p-[10px] rounded-[10px] ">
                            {t("Update Task")}
                        </button>
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

export default EditTask;
