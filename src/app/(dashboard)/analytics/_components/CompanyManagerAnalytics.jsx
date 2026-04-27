"use client";
import PropTypes from "prop-types";
import Page from "@/components/Page.jsx";
import AnalyticsCard from './AnalyticsCard'; // تأكد من تحديث هذا المكون بـ pb-10 والـ Icons

// استيراد التشارتات
import PerformanceBar from "@/app/(dashboard)/analytics/_components/charts/PerformanceBar";
import TimelineLine from "@/app/(dashboard)/analytics/_components/charts/TimelineLine";
import GaugeChart from "@/app/(dashboard)/analytics/_components/charts/GaugeChart";
import SimpleLineChart from "@/app/(dashboard)/analytics/_components/charts/SimpleLineChart";
import DynamicDoughnut from "@/app/(dashboard)/analytics/_components/charts/SummaryDoughnut."; // تأكد من اسم الملف
import RecentProjectsList from "@/app/(dashboard)/analytics/_components/charts/RecentProjectsList";
import ProjectsPerformanceList from "@/app/(dashboard)/analytics/_components/charts/ProjectsPerformanceList";
import TopEmployeesList from "@/app/(dashboard)/analytics/_components/charts/TopEmployeesList";
import DepartmentsRankingTable
    from "@/app/(dashboard)/analytics/_components/company_manager/departments/DepartmentsRankingTable";
import { useGetSubscriberAnalyticsQuery } from "@/redux/analytics/analyticsApi";

function CompanyManagerAnalytics() {
    const { data: analyticsData, isLoading, error } = useGetSubscriberAnalyticsQuery();

    if (isLoading) return <div className="text-center py-20">Loading analytics...</div>;
    if (error) return <div className="p-8 text-red-500 text-center">Error loading analytics data.</div>;

    const data = analyticsData?.data || {};

    // Map tasks summary dynamically
    const tasksSummaryData = data.tasksSummary?.length > 0 ? data.tasksSummary.map((item, index) => {
        const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        return { name: item.name, value: item.value, color: colors[index % colors.length] };
    }) : [
        { name: 'Active', value: 50, color: '#4F46E5' },
        { name: 'Completed', value: 50, color: '#10B981' },
    ];

    const tasksRatingData = data.tasksRatingData?.length > 0 ? data.tasksRatingData.map((item, index) => {
        const colors = ['#4F46E5', '#FBBF24', '#EF4444'];
        return { name: item.name, value: item.value, color: colors[index % colors.length] };
    }) : [
        { name: 'High Rating', value: 150, color: '#4F46E5' },
        { name: 'Low Rating', value: 50, color: '#FBBF24' },
    ];

    const projectsProgressData = data.projectsProgress?.length > 0 ? data.projectsProgress : [
        { name: 'Alpha Project', completedTasks: 75, totalTasks: 100, daysLeft: 2 },
        { name: 'Beta Project', completedTasks: 40, totalTasks: 100, daysLeft: 5 },
    ];

    const recentProjectsData = data.recentProjects?.length > 0 ? data.recentProjects : [
        { name: 'Alpha Project', department: 'Publishing Dep' },
        { name: 'Beta Project', department: 'Marketing Dep' },
    ];

    const topEmployeesData = data.topEmployees?.length > 0 ? data.topEmployees : [
        { name: 'Ali Ali', department: 'Publishing Dep' },
        { name: 'Rawan Ahmed', department: 'Publishing Dep' },
        { name: 'Yara Ahmed', department: 'Publishing Dep' },
    ];

    const employeeAttendanceData = data.employeeAttendance?.length > 0 ? data.employeeAttendance.map((item, index) => {
        const colors = ['#10B981', '#F59E0B'];
        return { name: item.name, value: item.value, color: colors[index % colors.length] };
    }) : [
        { name: 'On Time', value: 20, color: '#10B981' }, 
        { name: 'Late', value: 10, color: '#F59E0B' }
    ];

    const employeeRatingData = [
        { name: 'W1', rating: 3 }, { name: 'W2', rating: 4 }, { name: 'W3', rating: 3.5 }, { name: 'W4', rating: 4.8 }
    ];

    const tasksDelayFooter = [
        { text: 'Employee completed task in 67 hours', color: '#F59E0B' },
        { text: 'Expected Time was 55 Hours', color: '#E5E7EB' }
    ];

    return (
        <Page className={"p-0"}>
            <div className="p-8 bg-surface min-h-screen space-y-9">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-page-title">All Analytics Overview</h1>
                    <div className="flex gap-3">
                        <select className="bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium">
                            <option>All Charts</option>
                        </select>
                        <select className="bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium">
                            <option>All Sections</option>
                        </select>
                    </div>
                </div>

                {/* SECTION 1: Tasks Analytics (صورة 1) */}
                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">Tasks Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsCard title="Tasks Summary">
                            <DynamicDoughnut data={tasksSummaryData} centerTitle="TASKS" centerValue={data.overview?.totalTasks || "200"} />
                        </AnalyticsCard>
                        <AnalyticsCard title="Tasks Performance" showDropdowns={true} dropdown1Label="Last 6 months">
                            <PerformanceBar />
                        </AnalyticsCard>
                        <AnalyticsCard title="Tasks Timeline">
                            <TimelineLine />
                        </AnalyticsCard>
                        <AnalyticsCard title="Tasks Rating" showDropdowns={true} dropdown1Label="Department">
                            <DynamicDoughnut data={tasksRatingData} centerTitle="TASKS" centerValue="200" />
                        </AnalyticsCard>
                    </div>
                </section>

                {/* SECTION 2: Projects Analytics (صورة 1) */}
                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">Projects Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <AnalyticsCard title="Projects Performance" showDropdowns={true} dropdown1Label="Last 6 months">
                            <PerformanceBar />
                        </AnalyticsCard>
                        <AnalyticsCard title="Project Timeline">
                            <TimelineLine />
                        </AnalyticsCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <AnalyticsCard title="Projects Performance">
                                <ProjectsPerformanceList projects={projectsProgressData} />
                            </AnalyticsCard>
                        </div>
                        <div className="lg:col-span-1">
                            <AnalyticsCard title="Last 4 Projects" showDropdowns={true} dropdown1Label="Performance">
                                <RecentProjectsList projects={recentProjectsData} />
                            </AnalyticsCard>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: Employees Analytics (صورة 2) */}
                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">Employees Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <AnalyticsCard title="Employee Attendance" showDropdowns={true} dropdown1Label="Employee Name">
                            <DynamicDoughnut
                                data={[{ name: 'Attended', value: 25, color: '#4F46E5' }, { name: 'Absent', value: 5, color: '#FBBF24' }]}
                                centerTitle="DAYS" centerValue="30"
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title="Employee Performance" showDropdowns={true} dropdown1Label="Employee Name">
                            <SimpleLineChart data={employeeRatingData} dataKey="rating" color="#FBBF24" />
                        </AnalyticsCard>

                        <AnalyticsCard title="Employee Accomplishment" showDropdowns={true} dropdown1Label="Employee Name">
                            <TimelineLine />
                        </AnalyticsCard>

                        <AnalyticsCard title="Employee Adherence" showDropdowns={true} dropdown1Label="Employee Name">
                            <DynamicDoughnut
                                data={employeeAttendanceData}
                                centerTitle="RECORDS" centerValue={employeeAttendanceData.reduce((acc, curr) => acc + curr.value, 0).toString()}
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title="Tasks Delay" showDropdowns={true} dropdown1Label="Employee Name">
                            <GaugeChart percentage={22} label="DELAY" footerData={tasksDelayFooter} />
                        </AnalyticsCard>

                        <AnalyticsCard title="Top 3 Employees" showDropdowns={true} dropdown1Label="Performance">
                            <TopEmployeesList employees={topEmployeesData} />
                        </AnalyticsCard>
                    </div>
                </section>

                {/* SECTION 4: Department Analytics (صورة 2) */}
                <section className="pb-10">
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">Department Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsCard title="Department Adherence" showDropdowns={true} dropdown1Label="Department Name">
                            <DynamicDoughnut
                                data={[{ name: 'On Time', value: 80, color: '#4F46E5' }, { name: 'Late', value: 20, color: '#FBBF24' }]}
                                centerTitle="Tasks" centerValue="100"
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Department Performance" showDropdowns={true} dropdown1Label="Department Name">
                            <DynamicDoughnut
                                data={[{ name: 'Completed on time', value: 75, color: '#10B981' }, { name: 'Overdue', value: 25, color: '#EF4444' }]}
                                centerTitle="TASKS" centerValue="100"
                            />
                        </AnalyticsCard>
                    </div>
                </section>
                <div className="flex pt- flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-full">
                        <DepartmentsRankingTable />
                    </div>
                </div>
            </div>
        </Page>
    );
}

CompanyManagerAnalytics.propTypes = {
    t: PropTypes.func,
    i18n: PropTypes.object
};

export default CompanyManagerAnalytics;