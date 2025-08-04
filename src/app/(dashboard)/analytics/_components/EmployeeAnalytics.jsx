"use client"

import Page from "@/components/Page";
import ProjectsPerformanceChart from "@/app/(dashboard)/analytics/_components/employee/ProjectsPerformanceChart";
import LastProjectsList from "@/app/(dashboard)/analytics/_components/employee/LastProjectsList";
import ProjectTimelineChart from "@/app/(dashboard)/analytics/_components/employee/ProjectTimelineChart";
import ProjectsPerformanceList from "@/app/(dashboard)/analytics/_components/employee/ProjectsPerformanceList";
import DefaultSelect from "@/components/Form/DefaultSelect";
import TasksSummaryChart from "@/app/(dashboard)/analytics/_components/employee/TasksSummaryChart";
import TasksPerformanceChart from "@/app/(dashboard)/analytics/_components/employee/TasksPerformanceChart";
import TasksTimelineChart from "@/app/(dashboard)/analytics/_components/employee/TasksTimelineChart";
import TasksRatingChart from "@/app/(dashboard)/analytics/_components/employee/TasksRatingChart";

const EmployeeAnalytics = () => {

    return (
        <Page
            title="All Analytics Overview"
            isBtn={false}
            otherHeaderActions={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect placeholder="charts" options={[{ id: 1, value: "All Charts" }]} />
                    <DefaultSelect placeholder="sections" options={[{ id: 1, value: "All Sections" }]} />
                </div>
            }
        >
            {/* Tasks Analytics Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                <span className="text-lg text-gray-500">
                    Tasks Analytics
                </span>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <TasksSummaryChart />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TasksPerformanceChart />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <TasksTimelineChart />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TasksRatingChart />
                    </div>
                </div>
            </div>

            {/* Tasks Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                <span className="text-lg text-gray-500">
                    Projects Analysis
                </span>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <ProjectsPerformanceChart />
                    </div>
                    <div className="w-full md:w-1/2">
                        <ProjectTimelineChart />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-2/3">
                        <ProjectsPerformanceList />
                    </div>
                    <div className="w-full md:w-1/3">
                        <LastProjectsList />
                    </div>
                </div>
            </div>
            
        </Page>
    );
}

export default EmployeeAnalytics;
