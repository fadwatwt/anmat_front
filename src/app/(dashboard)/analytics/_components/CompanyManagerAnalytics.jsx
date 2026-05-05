"use client";
import PropTypes from "prop-types";
import Page from "@/components/Page.jsx";
import AnalyticsCard from './AnalyticsCard';

import PerformanceBar from "@/app/(dashboard)/analytics/_components/charts/PerformanceBar";
import TimelineLine from "@/app/(dashboard)/analytics/_components/charts/TimelineLine";
import GaugeChart from "@/app/(dashboard)/analytics/_components/charts/GaugeChart";
import SimpleLineChart from "@/app/(dashboard)/analytics/_components/charts/SimpleLineChart";
import DynamicDoughnut from "@/app/(dashboard)/analytics/_components/charts/SummaryDoughnut.";
import RecentProjectsList from "@/app/(dashboard)/analytics/_components/charts/RecentProjectsList";
import ProjectsPerformanceList from "@/app/(dashboard)/analytics/_components/charts/ProjectsPerformanceList";
import TopEmployeesList from "@/app/(dashboard)/analytics/_components/charts/TopEmployeesList";
import DepartmentsRankingTable
    from "@/app/(dashboard)/analytics/_components/company_manager/departments/DepartmentsRankingTable";
import { useGetSubscriberAnalyticsQuery } from "@/redux/analytics/analyticsApi";

const SUMMARY_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#0EA5E9', '#EC4899'];
const RATING_COLORS = { 'High Rating': '#10B981', 'Medium Rating': '#FBBF24', 'Low Rating': '#EF4444', 'No Ratings': '#9CA3AF' };
const ATTENDANCE_COLORS = { 'Attended': '#4F46E5', 'Absent': '#FBBF24', 'On Time': '#10B981', 'Late': '#F59E0B' };
const DEPARTMENT_COLORS = { 'On Time': '#4F46E5', 'Late': '#FBBF24', 'Completed on time': '#10B981', 'Overdue': '#EF4444' };

const decorate = (arr, palette) =>
    (arr || []).map((item, i) => ({
        ...item,
        color: (palette && (palette[item.name] || palette[i])) || SUMMARY_COLORS[i % SUMMARY_COLORS.length],
    }));

const sumValues = (arr) => (arr || []).reduce((acc, x) => acc + (x.value || 0), 0);

const formatBytes = (bytes) => {
    if (bytes === 'Unlimited') return 'Unlimited';
    if (!bytes || bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

function CompanyManagerAnalytics() {
    const { data: analyticsData, isLoading, error } = useGetSubscriberAnalyticsQuery();

    if (isLoading) return <div className="text-center py-20">Loading analytics...</div>;
    if (error) return <div className="p-8 text-red-500 text-center">Error loading analytics data.</div>;

    const data = analyticsData?.data || {};

    const tasksSummaryData = decorate(data.tasksSummary, SUMMARY_COLORS);
    const tasksRatingData = decorate(data.tasksRatingData, RATING_COLORS);
    const employeeAttendance = decorate(data.employeeAttendance, ATTENDANCE_COLORS);
    const employeeAdherence = decorate(data.employeeAdherence, ATTENDANCE_COLORS);
    const departmentAdherence = decorate(data.departmentAdherence, DEPARTMENT_COLORS);
    const departmentPerformance = decorate(data.departmentPerformance, DEPARTMENT_COLORS);

    const tasksDelay = data.tasksDelay || { percentage: 0, expectedHours: 0, actualHours: 0 };
    const tasksDelayFooter = [
        { text: `Employee completed task in ${tasksDelay.actualHours} hours`, color: '#F59E0B' },
        { text: `Expected Time was ${tasksDelay.expectedHours} Hours`, color: '#E5E7EB' }
    ];

    const employeeRatingData = data.employeePerformanceWeeks || [];

    const subUsage = data.subscriptionUsage || {
        employees: { current: 0, max: 'Unlimited', percentage: 0 },
        storage: { currentBytes: 0, maxBytes: 'Unlimited', percentage: 0 }
    };

    const employeesUsageFooter = [
        { text: `Current Employees: ${subUsage.employees.current}`, color: '#10B981' },
        { text: `Allowed in Plan: ${subUsage.employees.max}`, color: '#E5E7EB' }
    ];

    const storageUsageFooter = [
        { text: `Used Storage: ${formatBytes(subUsage.storage.currentBytes)}`, color: '#4F46E5' },
        { text: `Plan Limit: ${formatBytes(subUsage.storage.maxBytes)}`, color: '#E5E7EB' }
    ];

    return (
        <Page className={"p-0"}>
            <div className="p-8 bg-surface min-h-screen space-y-9">

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

                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">Subscription Usage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <AnalyticsCard title="Employees Quota">
                            <GaugeChart
                                percentage={subUsage.employees.percentage}
                                label="EMPLOYEES"
                                primaryColor="#10B981"
                                footerData={employeesUsageFooter}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Storage Quota">
                            <GaugeChart
                                percentage={subUsage.storage.percentage}
                                label="STORAGE"
                                primaryColor="#4F46E5"
                                footerData={storageUsageFooter}
                            />
                        </AnalyticsCard>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">Tasks Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsCard title="Tasks Summary">
                            <DynamicDoughnut
                                data={tasksSummaryData}
                                centerTitle="TASKS"
                                centerValue={data.overview?.totalTasks ?? sumValues(tasksSummaryData)}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Tasks Performance" showDropdowns={true} dropdown1Label="Last 6 months">
                            <PerformanceBar data={data.tasksPerformanceMonthly || []} />
                        </AnalyticsCard>
                        <AnalyticsCard title="Tasks Timeline">
                            <TimelineLine data={data.tasksTimelineMonthly || []} />
                        </AnalyticsCard>
                        <AnalyticsCard title="Tasks Rating" showDropdowns={true} dropdown1Label="Department">
                            <DynamicDoughnut
                                data={tasksRatingData}
                                centerTitle="TASKS"
                                centerValue={sumValues(tasksRatingData)}
                            />
                        </AnalyticsCard>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">Projects Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <AnalyticsCard title="Projects Performance" showDropdowns={true} dropdown1Label="Last 6 months">
                            <PerformanceBar data={data.projectsPerformanceMonthly || []} />
                        </AnalyticsCard>
                        <AnalyticsCard title="Project Timeline">
                            <TimelineLine data={data.projectTimelineMonthly || []} />
                        </AnalyticsCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <AnalyticsCard title="Projects Performance">
                                <ProjectsPerformanceList projects={data.projectsProgress || []} />
                            </AnalyticsCard>
                        </div>
                        <div className="lg:col-span-1">
                            <AnalyticsCard title="Last 4 Projects" showDropdowns={true} dropdown1Label="Performance">
                                <RecentProjectsList projects={data.recentProjects || []} />
                            </AnalyticsCard>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">Employees Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <AnalyticsCard title="Employee Attendance" showDropdowns={true} dropdown1Label="Employee Name">
                            <DynamicDoughnut
                                data={employeeAttendance}
                                centerTitle="DAYS"
                                centerValue={sumValues(employeeAttendance)}
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title="Employee Performance" showDropdowns={true} dropdown1Label="Employee Name">
                            <SimpleLineChart data={employeeRatingData} dataKey="rating" color="#FBBF24" />
                        </AnalyticsCard>

                        <AnalyticsCard title="Employee Accomplishment" showDropdowns={true} dropdown1Label="Employee Name">
                            <TimelineLine data={data.accomplishmentMonthly || []} />
                        </AnalyticsCard>

                        <AnalyticsCard title="Employee Adherence" showDropdowns={true} dropdown1Label="Employee Name">
                            <DynamicDoughnut
                                data={employeeAdherence}
                                centerTitle="RECORDS"
                                centerValue={sumValues(employeeAdherence)}
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title="Tasks Delay" showDropdowns={true} dropdown1Label="Employee Name">
                            <GaugeChart percentage={tasksDelay.percentage} label="DELAY" footerData={tasksDelayFooter} />
                        </AnalyticsCard>

                        <AnalyticsCard title="Top 3 Employees" showDropdowns={true} dropdown1Label="Performance">
                            <TopEmployeesList employees={data.topEmployees || []} />
                        </AnalyticsCard>
                    </div>
                </section>

                <section className="pb-10">
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">Department Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsCard title="Department Adherence" showDropdowns={true} dropdown1Label="Department Name">
                            <DynamicDoughnut
                                data={departmentAdherence}
                                centerTitle="Tasks"
                                centerValue={sumValues(departmentAdherence)}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Department Performance" showDropdowns={true} dropdown1Label="Department Name">
                            <DynamicDoughnut
                                data={departmentPerformance}
                                centerTitle="TASKS"
                                centerValue={sumValues(departmentPerformance)}
                            />
                        </AnalyticsCard>
                    </div>
                </section>
                <div className="flex pt- flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-full">
                        <DepartmentsRankingTable rows={data.departmentsRanking || []} />
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
