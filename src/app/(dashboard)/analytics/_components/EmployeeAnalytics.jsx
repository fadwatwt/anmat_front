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

const SUMMARY_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#0EA5E9', '#EC4899'];
const RATING_COLORS = { 'High Rating': '#375DFB', 'Medium Rating': '#FBBF24', 'Low Rating': '#EF4444', 'No Ratings': '#9CA3AF' };

const toDoughnutData = (records, palette) => {
    if (!records || !records.length) return null;
    const total = records.reduce((acc, r) => acc + (r.value || 0), 0);
    return {
        total,
        records: records.map((item, i) => ({
            title: item.name,
            value: item.value,
            color: (palette && palette[item.name]) || SUMMARY_COLORS[i % SUMMARY_COLORS.length],
        })),
    };
};

const EmployeeAnalytics = () => {
    const { data: employeeData, isLoading, error } = useGetEmployeeAnalyticsQuery();

    if (isLoading) return <div className="text-center py-20">Loading analytics...</div>;
    if (error) return <div className="p-8 text-red-500 text-center">Error loading employee analytics.</div>;

    const data = employeeData?.data || {};

    const tasksSummaryData = toDoughnutData(data.tasksSummary, null);
    const tasksRatingData = toDoughnutData(data.tasksRatingData, RATING_COLORS);

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
            {/* Tasks Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                <span className="text-lg text-gray-500">
                    Tasks Analytics
                </span>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <TasksSummaryChart data={tasksSummaryData} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TasksPerformanceChart monthlyData={data.tasksPerformanceMonthly || []} />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <TasksTimelineChart data={data.tasksTimelineMonthly || []} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TasksRatingChart data={tasksRatingData} />
                    </div>
                </div>
            </div>

            {/* Projects Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                <span className="text-lg text-gray-500">
                    Projects Analysis
                </span>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <ProjectsPerformanceChart monthlyData={data.projectsPerformanceMonthly || []} />
                    </div>
                    <div className="w-full md:w-1/2">
                        <ProjectTimelineChart data={data.projectTimelineMonthly || []} />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-2/3">
                        <ProjectsPerformanceList projects={data.projectsPerformance || []} />
                    </div>
                    <div className="w-full md:w-1/3">
                        <LastProjectsList projects={data.recentProjects || []} />
                    </div>
                </div>
            </div>

        </Page>
    );
}

export default EmployeeAnalytics;
