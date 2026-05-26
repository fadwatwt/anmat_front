"use client";
import { ImSpinner2 } from "react-icons/im";
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
import { useTranslation } from "react-i18next";
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

function CompanyManagerAnalytics() {
    const { t } = useTranslation();

    const formatBytes = (bytes) => {
        if (bytes === 'Unlimited') return t('Unlimited');
        if (!bytes || bytes === 0) return t('0 MB');
        const k = 1024;
        const sizes = [t('Bytes'), t('KB'), t('MB'), t('GB'), t('TB')];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const { data: analyticsData, isLoading, error } = useGetSubscriberAnalyticsQuery();

    if (isLoading) return <div className="text-center py-20"> <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div> </div>;
    if (error) return <div className="p-8 text-red-500 text-center">{t("Error loading analytics data.")}</div>;

    const data = analyticsData?.data || {};

    const tasksSummaryData = decorate(data.tasksSummary, SUMMARY_COLORS);
    const tasksRatingData = decorate(data.tasksRatingData, RATING_COLORS);
    const employeeAttendance = decorate(data.employeeAttendance, ATTENDANCE_COLORS);
    const employeeAdherence = decorate(data.employeeAdherence, ATTENDANCE_COLORS);
    const departmentAdherence = decorate(data.departmentAdherence, DEPARTMENT_COLORS);
    const departmentPerformance = decorate(data.departmentPerformance, DEPARTMENT_COLORS);

    const tasksDelay = data.tasksDelay || { percentage: 0, expectedHours: 0, actualHours: 0 };
    const tasksDelayFooter = [
        { text: t("Employee completed task in {{hours}} hours", { hours: tasksDelay.actualHours }), color: '#F59E0B' },
        { text: t("Expected Time was {{hours}} Hours", { hours: tasksDelay.expectedHours }), color: '#E5E7EB' }
    ];

    const employeeRatingData = data.employeePerformanceWeeks || [];

    const subUsage = data.subscriptionUsage || {
        employees: { current: 0, max: 'Unlimited', percentage: 0 },
        storage: { currentBytes: 0, maxBytes: 'Unlimited', percentage: 0 }
    };

    const employeesUsageFooter = [
        { text: t("Current Employees: {{count}}", { count: subUsage.employees.current }), color: '#10B981' },
        { text: t("Allowed in Plan: {{max}}", { max: subUsage.employees.max }), color: '#E5E7EB' }
    ];

    const storageUsageFooter = [
        { text: t("Used Storage: {{storage}}", { storage: formatBytes(subUsage.storage.currentBytes) }), color: '#4F46E5' },
        { text: t("Plan Limit: {{limit}}", { limit: formatBytes(subUsage.storage.maxBytes) }), color: '#E5E7EB' }
    ];

    return (
        <Page className={"p-0"}>
            <div className="p-8 bg-surface min-h-screen space-y-9">

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-page-title">{t("All Analytics Overview")}</h1>
                    <div className="flex gap-3">
                        <select className="bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium">
                            <option>{t("All Charts")}</option>
                        </select>
                        <select className="bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium">
                            <option>{t("All Sections")}</option>
                        </select>
                    </div>
                </div>

                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Subscription Usage")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <AnalyticsCard title={t("Employees Quota")}>
                            <GaugeChart
                                percentage={subUsage.employees.percentage}
                                label={t("EMPLOYEES")}
                                primaryColor="#10B981"
                                footerData={employeesUsageFooter}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title={t("Storage Quota")}>
                            <GaugeChart
                                percentage={subUsage.storage.percentage}
                                label={t("STORAGE")}
                                primaryColor="#4F46E5"
                                footerData={storageUsageFooter}
                            />
                        </AnalyticsCard>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Tasks Analytics")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsCard title={t("Tasks Summary")}>
                            <DynamicDoughnut
                                data={tasksSummaryData}
                                centerTitle={t("TASKS")}
                                centerValue={data.overview?.totalTasks ?? sumValues(tasksSummaryData)}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title={t("Tasks Performance")} showDropdowns={true} dropdown1Label={t("Last 6 months")}>
                            <PerformanceBar data={data.tasksPerformanceMonthly || []} />
                        </AnalyticsCard>
                        <AnalyticsCard title={t("Tasks Timeline")}>
                            <TimelineLine data={data.tasksTimelineMonthly || []} />
                        </AnalyticsCard>
                        <AnalyticsCard title={t("Tasks Rating")} showDropdowns={true} dropdown1Label={t("Department")}>
                            <DynamicDoughnut
                                data={tasksRatingData}
                                centerTitle={t("TASKS")}
                                centerValue={sumValues(tasksRatingData)}
                            />
                        </AnalyticsCard>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Projects Analytics")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <AnalyticsCard title={t("Projects Performance")} showDropdowns={true} dropdown1Label={t("Last 6 months")}>
                            <PerformanceBar data={data.projectsPerformanceMonthly || []} />
                        </AnalyticsCard>
                        <AnalyticsCard title={t("Project Timeline")}>
                            <TimelineLine data={data.projectTimelineMonthly || []} />
                        </AnalyticsCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <AnalyticsCard title={t("Projects Performance")}>
                                <ProjectsPerformanceList projects={data.projectsProgress || []} />
                            </AnalyticsCard>
                        </div>
                        <div className="lg:col-span-1">
                            <AnalyticsCard title={t("Last 4 Projects")} showDropdowns={true} dropdown1Label={t("Performance")}>
                                <RecentProjectsList projects={data.recentProjects || []} />
                            </AnalyticsCard>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Employees Analytics")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <AnalyticsCard title={t("Employee Attendance")} showDropdowns={true} dropdown1Label={t("Employee Name")}>
                            <DynamicDoughnut
                                data={employeeAttendance}
                                centerTitle={t("DAYS")}
                                centerValue={sumValues(employeeAttendance)}
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title={t("Employee Performance")} showDropdowns={true} dropdown1Label={t("Employee Name")}>
                            <SimpleLineChart data={employeeRatingData} dataKey="rating" color="#FBBF24" />
                        </AnalyticsCard>

                        <AnalyticsCard title={t("Employee Accomplishment")} showDropdowns={true} dropdown1Label={t("Employee Name")}>
                            <TimelineLine data={data.accomplishmentMonthly || []} />
                        </AnalyticsCard>

                        <AnalyticsCard title={t("Employee Adherence")} showDropdowns={true} dropdown1Label={t("Employee Name")}>
                            <DynamicDoughnut
                                data={employeeAdherence}
                                centerTitle={t("RECORDS")}
                                centerValue={sumValues(employeeAdherence)}
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title={t("Tasks Delay")} showDropdowns={true} dropdown1Label={t("Employee Name")}>
                            <GaugeChart percentage={tasksDelay.percentage} label={t("DELAY")} footerData={tasksDelayFooter} />
                        </AnalyticsCard>

                        <AnalyticsCard title={t("Top 3 Employees")} showDropdowns={true} dropdown1Label={t("Performance")}>
                            <TopEmployeesList employees={data.topEmployees || []} />
                        </AnalyticsCard>
                    </div>
                </section>

                <section className="pb-10">
                    <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Department Analytics")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsCard title={t("Department Adherence")} showDropdowns={true} dropdown1Label={t("Department Name")}>
                            <DynamicDoughnut
                                data={departmentAdherence}
                                centerTitle={t("Tasks")}
                                centerValue={sumValues(departmentAdherence)}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title={t("Department Performance")} showDropdowns={true} dropdown1Label={t("Department Name")}>
                            <DynamicDoughnut
                                data={departmentPerformance}
                                centerTitle={t("TASKS")}
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



export default CompanyManagerAnalytics;
