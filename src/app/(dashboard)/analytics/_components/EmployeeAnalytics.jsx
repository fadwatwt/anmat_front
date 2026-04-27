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
import { useGetEmployeeAnalyticsQuery } from "@/redux/analytics/analyticsApi";

const EmployeeAnalytics = () => {
    const { data: employeeData, isLoading, error } = useGetEmployeeAnalyticsQuery();

    if (isLoading) return <div className="text-center py-20">Loading analytics...</div>;
    if (error) return <div className="p-8 text-red-500 text-center">Error loading employee analytics.</div>;

    const data = employeeData?.data || {};

    const tasksSummaryData = data.tasksSummary?.length > 0 ? {
        total: data.tasksSummary.reduce((acc, curr) => acc + curr.value, 0),
        records: data.tasksSummary.map((item, index) => {
            const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
            return { title: item.name, value: item.value, color: colors[index % colors.length] };
        })
    } : null;
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
                        <TasksSummaryChart data={tasksSummaryData} />
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
