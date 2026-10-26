"use client";
import { useState, useMemo, useRef } from "react";
import Page from "@/components/Page.jsx";
import AnalyticsCard from './AnalyticsCard';

import PerformanceBar from "@/app/(dashboard)/analytics/_components/charts/PerformanceBar";
import TimelineLine from "@/app/(dashboard)/analytics/_components/charts/TimelineLine";
import { attendanceDateRange } from "./attendanceDateRange";
import DistributionBars from "./charts/DistributionBars";
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
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import {
    TIME_RANGE_OPTIONS,
    SECTION_OPTIONS,
    CHART_TYPE_OPTIONS,
} from './filterOptions';
import { formatSubscriberAnalytics, exportAsPdf, exportCsv, exportXlsx } from './exportHelpers';
import AnalyticsExportMenu from './AnalyticsExportMenu';
import AnalyticsPageSkeleton from './AnalyticsPageSkeleton';
import usePersistedAnalyticsFilter from './usePersistedAnalyticsFilter';
import WorkforceAnalyticsSection from './WorkforceAnalyticsSection';

const SUMMARY_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#0EA5E9', '#EC4899'];
const RATING_COLORS = { 'High Rating': '#10B981', 'Medium Rating': '#FBBF24', 'Low Rating': '#EF4444', 'No Ratings': '#9CA3AF' };
const ATTENDANCE_COLORS = { 'Attended': '#10B981', 'Absent': '#EF4444', 'On Time': '#10B981', 'Late': '#F59E0B' };
const DEPARTMENT_COLORS = { 'On Time': '#10B981', 'Late': '#F59E0B', 'Completed on time': '#10B981', 'Overdue': '#EF4444' };

const TIME_RANGE_MONTHS = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 };

const decorate = (arr, palette) =>
    (arr || []).map((item, i) => ({
        ...item,
        color: (palette && (palette[item.name] || palette[i])) || SUMMARY_COLORS[i % SUMMARY_COLORS.length],
    }));

const sumValues = (arr) => (arr || []).reduce((acc, x) => acc + (x.value || 0), 0);

const sliceMonthly = (arr, timeRange) => {
    if (!arr || !arr.length) return [];
    const count = TIME_RANGE_MONTHS[timeRange];
    if (!count) return arr;
    return arr.slice(-count);
};

function CompanyManagerAnalytics() {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState("business");

    // --- Global filters (triggers API) ---
    const [sectionFilter, setSectionFilter] = usePersistedAnalyticsFilter("analytics:subscriber:section");
    const [chartTypeFilter, setChartTypeFilter] = usePersistedAnalyticsFilter("analytics:subscriber:chart");

    // --- Per-card time range (client-side only, instant) ---
    const [tasksPerfTimeRange, setTasksPerfTimeRange] = useState("6m");
    const [projectsPerfTimeRange, setProjectsPerfTimeRange] = useState("6m");
    const [attendanceTimeRange, setAttendanceTimeRange] = useState("6m");

    // --- Per-card entity filters (each triggers its own API call) ---
    const [tasksSummaryEmployee, setTasksSummaryEmployee] = useState("");
    const [attendanceEmployee, setAttendanceEmployee] = useState("");
    const [performanceEmployee, setPerformanceEmployee] = useState("");
    const [accomplishmentEmployee, setAccomplishmentEmployee] = useState("");
    const [adherenceEmployee, setAdherenceEmployee] = useState("");
    const [delayEmployee, setDelayEmployee] = useState("");
    const [tasksRatingDepartment, setTasksRatingDepartment] = useState("");
    const [deptAdherenceDepartment, setDeptAdherenceDepartment] = useState("");
    const [deptPerformanceDepartment, setDeptPerformanceDepartment] = useState("");
    const [performanceSort, setPerformanceSort] = useState("");

    // --- Export ---
    const contentRef = useRef(null);

    const handleExport = async (format) => {
        const { headers, rows, fileName } = formatSubscriberAnalytics(data);
        if (format === 'csv') {
            exportCsv(headers, rows, fileName);
        } else if (format === 'xlsx') {
            await exportXlsx(headers, rows, fileName, i18n.resolvedLanguage || i18n.language);
        } else if (format === 'pdf') {
            const sections = contentRef.current?.querySelectorAll(':scope > section');
            if (sections?.length) {
                await exportAsPdf(Array.from(sections), 'analytics_report');
            }
        }
    };

    // --- Main API call (defaults) ---
    const mainFilters = useMemo(() => ({}), []);
    const { data: analyticsData, isLoading, error } = useGetSubscriberAnalyticsQuery(mainFilters);

    // --- Per-card entity API calls (only when filter is set) ---
    const tasksSummaryFilters = useMemo(() => ({
        ...(tasksSummaryEmployee ? { employeeId: tasksSummaryEmployee } : {}),
    }), [tasksSummaryEmployee]);
    const { data: tasksSummaryApiData, isFetching: tasksSummaryFetching } = useGetSubscriberAnalyticsQuery(tasksSummaryFilters, { skip: !tasksSummaryEmployee });

    const attFilters = useMemo(() => ({
        ...attendanceDateRange(attendanceTimeRange),
        ...(attendanceEmployee ? { employeeId: attendanceEmployee } : {}),
    }), [attendanceEmployee, attendanceTimeRange]);
    const { currentData: attApiData, isFetching: attFetching } = useGetSubscriberAnalyticsQuery(attFilters);

    const perfFilters = useMemo(() => ({
        ...(performanceEmployee ? { employeeId: performanceEmployee } : {}),
    }), [performanceEmployee]);
    const { data: perfApiData, isFetching: perfFetching } = useGetSubscriberAnalyticsQuery(perfFilters, { skip: !performanceEmployee });

    const accompFilters = useMemo(() => ({
        ...(accomplishmentEmployee ? { employeeId: accomplishmentEmployee } : {}),
    }), [accomplishmentEmployee]);
    const { data: accompApiData, isFetching: accompFetching } = useGetSubscriberAnalyticsQuery(accompFilters, { skip: !accomplishmentEmployee });

    const adherFilters = useMemo(() => ({
        ...(adherenceEmployee ? { employeeId: adherenceEmployee } : {}),
    }), [adherenceEmployee]);
    const { data: adherApiData, isFetching: adherFetching } = useGetSubscriberAnalyticsQuery(adherFilters, { skip: !adherenceEmployee });

    const delayFilters = useMemo(() => ({
        ...(delayEmployee ? { employeeId: delayEmployee } : {}),
    }), [delayEmployee]);
    const { data: delayApiData, isFetching: delayFetching } = useGetSubscriberAnalyticsQuery(delayFilters, { skip: !delayEmployee });

    const tasksRatingFilters = useMemo(() => ({
        ...(tasksRatingDepartment ? { departmentId: tasksRatingDepartment } : {}),
    }), [tasksRatingDepartment]);
    const { data: tasksRatingApiData, isFetching: tasksRatingFetching } = useGetSubscriberAnalyticsQuery(tasksRatingFilters, { skip: !tasksRatingDepartment });

    const deptAdhFilters = useMemo(() => ({
        ...(deptAdherenceDepartment ? { departmentId: deptAdherenceDepartment } : {}),
    }), [deptAdherenceDepartment]);
    const { data: deptAdhApiData, isFetching: deptAdhFetching } = useGetSubscriberAnalyticsQuery(deptAdhFilters, { skip: !deptAdherenceDepartment });

    const deptPerfFilters = useMemo(() => ({
        ...(deptPerformanceDepartment ? { departmentId: deptPerformanceDepartment } : {}),
    }), [deptPerformanceDepartment]);
    const { data: deptPerfApiData, isFetching: deptPerfFetching } = useGetSubscriberAnalyticsQuery(deptPerfFilters, { skip: !deptPerformanceDepartment });

    // --- Options ---
    const { data: employeesData } = useGetEmployeesQuery();
    const { data: departmentsData } = useGetDepartmentsQuery();

    const employeeOptions = useMemo(() =>
        (employeesData || []).map((emp) => ({
            id: emp.user?._id || emp._id,
            value: emp.user?.name || emp.name || 'Unknown',
        })), [employeesData]);

    const departmentOptions = useMemo(() =>
        (departmentsData || []).map((dept) => ({
            id: dept._id,
            value: dept.name,
        })), [departmentsData]);

    const sectionCharts = { tasks: ['bar', 'line', 'doughnut'], projects: ['bar', 'line'], employees: ['bar', 'line', 'gauge'], departments: ['bar'], subscription: ['gauge'] };
    const showSection = (section) => (!sectionFilter || sectionFilter === section) && (!chartTypeFilter || sectionCharts[section]?.includes(chartTypeFilter));
    const isChartTypeVisible = (type) => !chartTypeFilter || chartTypeFilter === type;

    const formatBytes = (bytes) => {
        if (bytes === 'Unlimited') return t('Unlimited');
        if (!bytes || bytes === 0) return t('0 MB');
        const k = 1024;
        const sizes = [t('Bytes'), t('KB'), t('MB'), t('GB'), t('TB')];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // --- Data resolution: use entity API data if filter is active, else main data ---
    const data = analyticsData?.data || {};
    const attSrc = attApiData?.data || {};
    const perfSrc = performanceEmployee ? (perfApiData?.data || data) : data;
    const accompSrc = accomplishmentEmployee ? (accompApiData?.data || data) : data;
    const adherSrc = adherenceEmployee ? (adherApiData?.data || data) : data;
    const delaySrc = delayEmployee ? (delayApiData?.data || data) : data;
    const tasksRatingSrc = tasksRatingDepartment ? (tasksRatingApiData?.data || data) : data;
    const tasksSummarySrc = tasksSummaryEmployee ? (tasksSummaryApiData?.data || data) : data;
    const deptAdhSrc = deptAdherenceDepartment ? (deptAdhApiData?.data || data) : data;
    const deptPerfSrc = deptPerformanceDepartment ? (deptPerfApiData?.data || data) : data;

    // --- Client-side time range slicing ---
    const tasksPerfMonthly = useMemo(() => sliceMonthly(data.tasksPerformanceMonthly, tasksPerfTimeRange), [data.tasksPerformanceMonthly, tasksPerfTimeRange]);
    const projectsPerfMonthly = useMemo(() => sliceMonthly(data.projectsPerformanceMonthly, projectsPerfTimeRange), [data.projectsPerformanceMonthly, projectsPerfTimeRange]);

    // --- Top employees sorted ---
    const sortedTopEmployees = useMemo(() => {
        const emps = data.topEmployees || [];
        if (performanceSort === "asc") return [...emps].sort((a, b) => a.points - b.points);
        if (performanceSort === "desc") return [...emps].sort((a, b) => b.points - a.points);
        return emps;
    }, [data.topEmployees, performanceSort]);

    if (isLoading) return <AnalyticsPageSkeleton />;
    if (error) return <div className="p-8 text-red-500 text-center">{t("Error loading analytics data.")}</div>;

    // --- Prepare chart data from respective sources ---
    const tasksSummaryData = decorate(tasksSummarySrc.tasksSummary, SUMMARY_COLORS);
    const tasksRatingData = decorate(tasksRatingSrc.tasksRatingData, RATING_COLORS);
    const employeeAttendance = decorate(attSrc.employeeAttendance, ATTENDANCE_COLORS);
    const employeeAdherence = decorate(adherSrc.employeeAdherence, ATTENDANCE_COLORS);
    const departmentAdherence = decorate(deptAdhSrc.departmentAdherence, DEPARTMENT_COLORS);
    const departmentPerformance = decorate(deptPerfSrc.departmentPerformance, DEPARTMENT_COLORS);

    const tasksDelay = delaySrc.tasksDelay || { percentage: 0, expectedHours: 0, actualHours: 0 };
    const tasksDelayFooter = [
        { text: t("Employee completed task in {{hours}} hours", { hours: tasksDelay.actualHours }), color: '#F59E0B' },
        { text: t("Expected Time was {{hours}} Hours", { hours: tasksDelay.expectedHours }), color: '#E5E7EB' }
    ];
    const employeeRatingData = perfSrc.employeePerformanceWeeks || [];

    const subUsage = data.subscriptionUsage || { employees: { current: 0, max: 'Unlimited', percentage: 0 }, storage: { currentBytes: 0, maxBytes: 'Unlimited', percentage: 0 } };
    const employeesStatusBreakdown = [
        { name: t("Active"), value: subUsage.employees.active ?? 0, color: '#10B981' },
        { name: t("Inactive"), value: subUsage.employees.inactive ?? 0, color: '#EF4444' },
        { name: t("Incomplete / Not Registered"), value: subUsage.employees.registrationPending ?? 0, color: '#F59E0B' },
    ];
    const storageUsageFooter = [
        { text: t("Used Storage: {{storage}}", { storage: formatBytes(subUsage.storage.currentBytes) }), color: '#4F46E5' },
        { text: t("Plan Limit: {{limit}}", { limit: formatBytes(subUsage.storage.maxBytes) }), color: '#E5E7EB' }
    ];

    return (
        <Page className={"p-0"}>
                <div className="p-4 sm:p-6 lg:p-8 bg-surface min-h-screen space-y-9" ref={contentRef}>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-page-title">{t("All Analytics Overview")}</h1>
                    {activeTab === "business" && <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        <AnalyticsExportMenu onExport={handleExport} />
                        <div className="relative flex items-center">
                            <select className="appearance-none bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium cursor-pointer pr-9" value={chartTypeFilter} onChange={(e) => setChartTypeFilter(e.target.value)}>
                                {CHART_TYPE_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{t(opt.label)}</option>))}
                            </select>
                        </div>
                        <div className="relative flex items-center">
                            <select className="appearance-none bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium cursor-pointer pr-9" value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}>
                                {SECTION_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{t(opt.label)}</option>))}
                            </select>
                        </div>
                    </div>}
                </div>

                <div
                    className="flex w-full gap-1 rounded-2xl border border-status-border bg-status-bg p-1 sm:w-fit"
                    role="tablist"
                    aria-label={t("Analytics Sections")}
                >
                    {[
                        { id: "business", label: t("Business Analytics") },
                        { id: "workforce", label: t("Workforce Analytics") },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            id={`${tab.id}-analytics-tab`}
                            aria-selected={activeTab === tab.id}
                            aria-controls={`${tab.id}-analytics-panel`}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors sm:flex-none ${
                                activeTab === tab.id
                                    ? "bg-primary-base text-white shadow-sm"
                                    : "text-cell-secondary hover:bg-surface hover:text-page-title"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "business" ? <div
                    id="business-analytics-panel"
                    role="tabpanel"
                    aria-labelledby="business-analytics-tab"
                    className="space-y-9"
                >
                {!sectionFilter && (
                    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4" aria-label={t("All Analytics Overview")}>
                        {[["Projects", data.overview?.totalProjects], ["Tasks", data.overview?.totalTasks], ["Employees", data.overview?.totalEmployees], ["Departments", data.overview?.totalDepartments]].map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-status-border bg-surface p-5">
                                <p className="text-sm text-cell-secondary">{t(label)}</p>
                                <p className="mt-2 text-3xl font-bold text-page-title">{value ?? 0}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Tasks Analytics */}
                {showSection('tasks') && (
                    <section>
                        <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Tasks Analytics")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {isChartTypeVisible('doughnut') && (
                                <AnalyticsCard title={t("Tasks Summary")} isFetching={tasksSummaryFetching} showDropdowns={true} dropdown1Label={t("Employee Name")} dropdown1Options={employeeOptions} selectedFilter={tasksSummaryEmployee} onFilterChange={setTasksSummaryEmployee}>
                                    <DynamicDoughnut data={tasksSummaryData} centerTitle={t("TASKS")} centerValue={tasksSummarySrc.overview?.totalTasks ?? sumValues(tasksSummaryData)} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('bar') && (
                                <AnalyticsCard title={t("Tasks Performance")} showDropdowns={false} timeRangeOptions={TIME_RANGE_OPTIONS} selectedTimeRange={tasksPerfTimeRange} onTimeRangeChange={setTasksPerfTimeRange}>
                                    <PerformanceBar data={tasksPerfMonthly} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('line') && (
                                <AnalyticsCard title={t("Tasks Timeline")}>
                                    <TimelineLine data={data.tasksTimelineMonthly || []} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('bar') && (
                                <AnalyticsCard title={t("Tasks Rating")} isFetching={tasksRatingFetching} showDropdowns={true} dropdown1Label={t("Department")} dropdown1Options={departmentOptions} selectedFilter={tasksRatingDepartment} onFilterChange={setTasksRatingDepartment}>
                                    <DistributionBars data={tasksRatingData} />
                                </AnalyticsCard>
                            )}
                        </div>
                    </section>
                )}

                {/* Projects Analytics */}
                {showSection('projects') && (
                    <section>
                        <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Projects Analytics")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {isChartTypeVisible('bar') && (
                                <AnalyticsCard title={t("Projects Performance")} showDropdowns={false} timeRangeOptions={TIME_RANGE_OPTIONS} selectedTimeRange={projectsPerfTimeRange} onTimeRangeChange={setProjectsPerfTimeRange}>
                                    <PerformanceBar data={projectsPerfMonthly} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('line') && (
                                <AnalyticsCard title={t("Project Timeline")}>
                                    <TimelineLine data={data.projectTimelineMonthly || []} />
                                </AnalyticsCard>
                            )}
                        </div>
                        {!chartTypeFilter && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <AnalyticsCard title={t("Projects Performance")}><ProjectsPerformanceList projects={data.projectsProgress || []} /></AnalyticsCard>
                            </div>
                            <div className="lg:col-span-1">
                                <AnalyticsCard title={t("Last 4 Projects")}>
                                    <RecentProjectsList projects={data.recentProjects || []} />
                                </AnalyticsCard>
                            </div>
                        </div>}
                    </section>
                )}

                {/* Employees Analytics */}
                {showSection('employees') && (
                    <section>
                        <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Employees Analytics")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {isChartTypeVisible('bar') && (
                                <AnalyticsCard title={t("Employee Attendance")} isFetching={attFetching} showDropdowns={true} dropdown1Label={t("Employee Name")} dropdown1Options={employeeOptions} selectedFilter={attendanceEmployee} onFilterChange={setAttendanceEmployee} timeRangeOptions={TIME_RANGE_OPTIONS.filter(option => option.value !== "all")} selectedTimeRange={attendanceTimeRange} onTimeRangeChange={setAttendanceTimeRange}>
                                    <DistributionBars data={employeeAttendance} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('line') && (
                                <AnalyticsCard title={t("Employee Performance")} isFetching={perfFetching} showDropdowns={true} dropdown1Label={t("Employee Name")} dropdown1Options={employeeOptions} selectedFilter={performanceEmployee} onFilterChange={setPerformanceEmployee}>
                                    <SimpleLineChart data={employeeRatingData} dataKey="rating" color="#FBBF24" />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('line') && (
                                <AnalyticsCard title={t("Employee Accomplishment")} isFetching={accompFetching} showDropdowns={true} dropdown1Label={t("Employee Name")} dropdown1Options={employeeOptions} selectedFilter={accomplishmentEmployee} onFilterChange={setAccomplishmentEmployee}>
                                    <TimelineLine data={accompSrc.accomplishmentMonthly || []} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('bar') && (
                                <AnalyticsCard title={t("Employee Adherence")} isFetching={adherFetching} showDropdowns={true} dropdown1Label={t("Employee Name")} dropdown1Options={employeeOptions} selectedFilter={adherenceEmployee} onFilterChange={setAdherenceEmployee}>
                                    <DistributionBars data={employeeAdherence} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('gauge') && (
                                <AnalyticsCard title={t("Tasks Delay")} isFetching={delayFetching} showDropdowns={true} dropdown1Label={t("Employee Name")} dropdown1Options={employeeOptions} selectedFilter={delayEmployee} onFilterChange={setDelayEmployee}>
                                    <GaugeChart percentage={tasksDelay.percentage} label={t("DELAY")} footerData={tasksDelayFooter} />
                                </AnalyticsCard>
                            )}
                            {!chartTypeFilter && <AnalyticsCard title={t("Top 3 Employees")} showDropdowns={true} dropdown1Label={t("Performance")} dropdown1Options={[{ id: "asc", value: t("Ascending") }, { id: "desc", value: t("Descending") }]} selectedFilter={performanceSort} onFilterChange={setPerformanceSort}>
                                <TopEmployeesList employees={sortedTopEmployees} />
                            </AnalyticsCard>}
                        </div>
                    </section>
                )}

                {/* Department Analytics */}
                {showSection('departments') && (
                    <section className="pb-10">
                        <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Department Analytics")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {isChartTypeVisible('bar') && (
                                <AnalyticsCard title={t("Department Attendance Adherence")} isFetching={deptAdhFetching} showDropdowns={true} dropdown1Label={t("Department Name")} dropdown1Options={departmentOptions} selectedFilter={deptAdherenceDepartment} onFilterChange={setDeptAdherenceDepartment}>
                                    <DistributionBars data={departmentAdherence} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('bar') && (
                                <AnalyticsCard title={t("Department Performance")} isFetching={deptPerfFetching} showDropdowns={true} dropdown1Label={t("Department Name")} dropdown1Options={departmentOptions} selectedFilter={deptPerformanceDepartment} onFilterChange={setDeptPerformanceDepartment}>
                                    <DistributionBars data={departmentPerformance} />
                                </AnalyticsCard>
                            )}
                        </div>
                    </section>
                )}
                {showSection('departments') && !chartTypeFilter && (
                    <section><DepartmentsRankingTable rows={data.departmentsRanking || []} /></section>
                )}
                {/* Subscription Usage */}
                {showSection('subscription') && (!chartTypeFilter || chartTypeFilter === 'gauge') && (
                    <section>
                        <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Subscription Usage")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <AnalyticsCard compact title={t("Employees Quota")}><GaugeChart percentage={subUsage.employees.percentage} label={t("EMPLOYEES")} compact primaryColor="#10B981" footerData={[{ text: `${subUsage.employees.current} / ${subUsage.employees.max === "Unlimited" ? t("Unlimited") : subUsage.employees.max}` }]} breakdownData={employeesStatusBreakdown} /></AnalyticsCard>
                            <AnalyticsCard compact title={t("Storage Quota")}><GaugeChart percentage={subUsage.storage.percentage} label={t("STORAGE")} compact primaryColor="#4F46E5" footerData={storageUsageFooter} /></AnalyticsCard>
                        </div>
                    </section>
                )}
                </div> : <div
                    id="workforce-analytics-panel"
                    role="tabpanel"
                    aria-labelledby="workforce-analytics-tab"
                >
                    <WorkforceAnalyticsSection departmentOptions={departmentOptions} />
                </div>}

            </div>
        </Page>
    );
}

export default CompanyManagerAnalytics;
