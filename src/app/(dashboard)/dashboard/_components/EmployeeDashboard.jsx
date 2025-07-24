"use client";

import Page from "@/components/Page";
import TasksSummaryChart from "@/app/(dashboard)/analytics/_components/employee/TasksSummaryChart";
import ActivityLogs from "@/components/ActivityLogs.jsx";
import TasksPerformanceChart from "@/app/(dashboard)/analytics/_components/employee/TasksPerformanceChart";
import Table from "@/components/Tables/Table";

const EmployeeDashboard = () => {

    const headers = [
        { label: "Project/Task Name", width: "200px" },
        { label: "Department", width: "120px" },
        { label: "Assigned Employee(s)", width: "180px" },
        { label: "Delivery Date", width: "120px" },
    ];

    const activityLogs = [
        {
            type: "add",
            title: "New task added",
            description: "John Doe added a new task: Design website layout.",
            timeAgo: "2025-01-13T14:00:00.000Z",
        },
    ];

    const taskList = [
        {
            id: 1,
            name: "Project Omega",
            department: "Publishing",
            assignees: ["/api/placeholder/32/32", "/api/placeholder/32/32"],
            date: "15 Nov, 2024",
            rating: 4.5,
        },
        {
            id: 2,
            name: "Task Echo",
            department: "Sales",
            assignees: ["/api/placeholder/32/32"],
            date: "15 Nov, 2024",
            rating: 4.5,
        },
    ];

    const rows = taskList.map((task, index) => [
        task.name,
        task.department,
        <div key={index} className="flex">
            {task.assignees.map((assignee, idx) => (
                <img
                    key={idx}
                    src={assignee}
                    loading="lazy"
                    alt="assignee"
                    className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0"
                />
            ))}
        </div>,
        task.date
    ]);

    return (
        <Page
            title="Dashboard"
            isBtn={false}
        >
            {/* Companies Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <TasksSummaryChart />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TasksPerformanceChart />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <Table
                        title="Task/Project Evaluation"
                        headers={headers}
                        rows={rows}
                        isCheckInput={false}
                        isTitle={true}
                        classContainer={"w-full md:w-2/3"}
                        // ={
                        //     <button className="bg-white text-gray-500 hover:bg-gray-50 px-4 py-2">
                        //         See All
                        //     </button>
                        // }
                    />
                    <div className="w-full md:w-1/3">
                        <ActivityLogs activityLogs={activityLogs} className={"max-h-[30rem]"} />
                    </div>
                </div>
            </div>

        </Page>
    );
}

export default EmployeeDashboard;
