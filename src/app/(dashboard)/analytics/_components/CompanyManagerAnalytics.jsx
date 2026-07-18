"use client";
import { useState, useMemo } from "react";
import { ImSpinner2 } from "react-icons/im";
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
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import {
    TIME_RANGE_OPTIONS,
    SECTION_OPTIONS,
    CHART_TYPE_OPTIONS,
} from './filterOptions';

const SUMMARY_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#0EA5E9', '#EC4899'];
const RATING_COLORS = { 'High Rating': '#10B981', 'Medium Rating': '#FBBF24', 'Low Rating': '#EF4444', 'No Ratings': '#9CA3AF' };
const ATTENDANCE_COLORS = { 'Attended': '#4F46E5', 'Absent': '#FBBF24', 'On Time': '#10B981', 'Late': '#F59E0B' };
const DEPARTMENT_COLORS = { 'On Time': '#4F46E5', 'Late': '#FBBF24', 'Completed on time': '#10B981', 'Overdue': '#EF4444' };

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
    const { t } = useTranslation();

    // --- Global filters (triggers API) ---
    const [sectionFilter, setSectionFilter] = useState("");
    const [chartTypeFilter, setChartTypeFilter] = useState("");

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

    // --- Main API call (defaults) ---
    const mainFilters = useMemo(() => ({
        section: sectionFilter || undefined,
    }), [sectionFilter]);
    const { data: analyticsData, isLoading, error } = useGetSubscriberAnalyticsQuery(mainFilters);

    // --- Per-card entity API calls (only when filter is set) ---
    const tasksSummaryFilters = useMemo(() => ({
        ...(tasksSummaryEmployee ? { employeeId: tasksSummaryEmployee } : {}),
    }), [tasksSummaryEmployee]);
    const { data: tasksSummaryApiData, isFetching: tasksSummaryFetching } = useGetSubscriberAnalyticsQuery(tasksSummaryFilters);

    const attFilters = useMemo(() => ({
        ...(attendanceEmployee ? { employeeId: attendanceEmployee } : {}),
    }), [attendanceEmployee]);
    const { data: attApiData, isFetching: attFetching } = useGetSubscriberAnalyticsQuery(attFilters);

    const perfFilters = useMemo(() => ({
        ...(performanceEmployee ? { employeeId: performanceEmployee } : {}),
    }), [performanceEmployee]);
    const { data: perfApiData, isFetching: perfFetching } = useGetSubscriberAnalyticsQuery(perfFilters);

    const accompFilters = useMemo(() => ({
        ...(accomplishmentEmployee ? { employeeId: accomplishmentEmployee } : {}),
    }), [accomplishmentEmployee]);
    const { data: accompApiData, isFetching: accompFetching } = useGetSubscriberAnalyticsQuery(accompFilters);

    const adherFilters = useMemo(() => ({
        ...(adherenceEmployee ? { employeeId: adherenceEmployee } : {}),
    }), [adherenceEmployee]);
    const { data: adherApiData, isFetching: adherFetching } = useGetSubscriberAnalyticsQuery(adherFilters);

    const delayFilters = useMemo(() => ({
        ...(delayEmployee ? { employeeId: delayEmployee } : {}),
    }), [delayEmployee]);
    const { data: delayApiData, isFetching: delayFetching } = useGetSubscriberAnalyticsQuery(delayFilters);

    const tasksRatingFilters = useMemo(() => ({
        ...(tasksRatingDepartment ? { departmentId: tasksRatingDepartment } : {}),
    }), [tasksRatingDepartment]);
    const { data: tasksRatingApiData, isFetching: tasksRatingFetching } = useGetSubscriberAnalyticsQuery(tasksRatingFilters);

    const deptAdhFilters = useMemo(() => ({
        ...(deptAdherenceDepartment ? { departmentId: deptAdherenceDepartment } : {}),
    }), [deptAdherenceDepartment]);
    const { data: deptAdhApiData, isFetching: deptAdhFetching } = useGetSubscriberAnalyticsQuery(deptAdhFilters);

    const deptPerfFilters = useMemo(() => ({
        ...(deptPerformanceDepartment ? { departmentId: deptPerformanceDepartment } : {}),
    }), [deptPerformanceDepartment]);
    const { data: deptPerfApiData, isFetching: deptPerfFetching } = useGetSubscriberAnalyticsQuery(deptPerfFilters);

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

    const showSection = (section) => !sectionFilter || sectionFilter === section;
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
    const attSrc = attendanceEmployee ? (attApiData?.data || data) : data;
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

    if (isLoading) return <div className="text-center py-20"><div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div></div>;
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

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-page-title">{t("All Analytics Overview")}</h1>
                    <div className="flex gap-3">
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
                    </div>
                </div>

                {/* Subscription Usage */}
                {showSection('subscription') && (
                    <section>
                        <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Subscription Usage")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <AnalyticsCard title={t("Employees Quota")}><GaugeChart percentage={subUsage.employees.percentage} label={t("EMPLOYEES")} primaryColor="#10B981" footerData={employeesUsageFooter} /></AnalyticsCard>
                            <AnalyticsCard title={t("Storage Quota")}><GaugeChart percentage={subUsage.storage.percentage} label={t("STORAGE")} primaryColor="#4F46E5" footerData={storageUsageFooter} /></AnalyticsCard>
                        </div>
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
                            {isChartTypeVisible('doughnut') && (
                                <AnalyticsCard title={t("Tasks Rating")} isFetching={tasksRatingFetching} showDropdowns={true} dropdown1Label={t("Department")} dropdown1Options={departmentOptions} selectedFilter={tasksRatingDepartment} onFilterChange={setTasksRatingDepartment}>
                                    <DynamicDoughnut data={tasksRatingData} centerTitle={t("TASKS")} centerValue={sumValues(tasksRatingData)} />
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
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <AnalyticsCard title={t("Projects Performance")}><ProjectsPerformanceList projects={data.projectsProgress || []} /></AnalyticsCard>
                            </div>
                            <div className="lg:col-span-1">
                                <AnalyticsCard title={t("Last 4 Projects")} showDropdowns={true} dropdown1Label={t("Performance")} dropdown1Options={[{ id: "asc", value: t("Ascending") }, { id: "desc", value: t("Descending") }]} selectedFilter={performanceSort} onFilterChange={setPerformanceSort}>
                                    <RecentProjectsList projects={data.recentProjects || []} />
                                </AnalyticsCard>
                            </div>
                        </div>
                    </section>
                )}

                {/* Employees Analytics */}
                {showSection('employees') && (
                    <section>
                        <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Employees Analytics")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {isChartTypeVisible('doughnut') && (
                                <AnalyticsCard title={t("Employee Attendance")} isFetching={attFetching} showDropdowns={true} dropdown1Label={t("Employee Name")} dropdown1Options={employeeOptions} selectedFilter={attendanceEmployee} onFilterChange={setAttendanceEmployee} timeRangeOptions={TIME_RANGE_OPTIONS} selectedTimeRange={attendanceTimeRange} onTimeRangeChange={setAttendanceTimeRange}>
                                    <DynamicDoughnut data={employeeAttendance} centerTitle={t("DAYS")} centerValue={sumValues(employeeAttendance)} />
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
                            {isChartTypeVisible('doughnut') && (
                                <AnalyticsCard title={t("Employee Adherence")} isFetching={adherFetching} showDropdowns={true} dropdown1Label={t("Employee Name")} dropdown1Options={employeeOptions} selectedFilter={adherenceEmployee} onFilterChange={setAdherenceEmployee}>
                                    <DynamicDoughnut data={employeeAdherence} centerTitle={t("RECORDS")} centerValue={sumValues(employeeAdherence)} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('gauge') && (
                                <AnalyticsCard title={t("Tasks Delay")} isFetching={delayFetching} showDropdowns={true} dropdown1Label={t("Employee Name")} dropdown1Options={employeeOptions} selectedFilter={delayEmployee} onFilterChange={setDelayEmployee}>
                                    <GaugeChart percentage={tasksDelay.percentage} label={t("DELAY")} footerData={tasksDelayFooter} />
                                </AnalyticsCard>
                            )}
                            <AnalyticsCard title={t("Top 3 Employees")} showDropdowns={true} dropdown1Label={t("Performance")} dropdown1Options={[{ id: "asc", value: t("Ascending") }, { id: "desc", value: t("Descending") }]} selectedFilter={performanceSort} onFilterChange={setPerformanceSort}>
                                <TopEmployeesList employees={sortedTopEmployees} />
                            </AnalyticsCard>
                        </div>
                    </section>
                )}

                {/* Department Analytics */}
                {showSection('departments') && (
                    <section className="pb-10">
                        <h2 className="text-sm font-bold text-cell-secondary mb-6 uppercase tracking-widest px-1">{t("Department Analytics")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {isChartTypeVisible('doughnut') && (
                                <AnalyticsCard title={t("Department Adherence")} isFetching={deptAdhFetching} showDropdowns={true} dropdown1Label={t("Department Name")} dropdown1Options={departmentOptions} selectedFilter={deptAdherenceDepartment} onFilterChange={setDeptAdherenceDepartment}>
                                    <DynamicDoughnut data={departmentAdherence} centerTitle={t("Tasks")} centerValue={sumValues(departmentAdherence)} />
                                </AnalyticsCard>
                            )}
                            {isChartTypeVisible('doughnut') && (
                                <AnalyticsCard title={t("Department Performance")} isFetching={deptPerfFetching} showDropdowns={true} dropdown1Label={t("Department Name")} dropdown1Options={departmentOptions} selectedFilter={deptPerformanceDepartment} onFilterChange={setDeptPerformanceDepartment}>
                                    <DynamicDoughnut data={departmentPerformance} centerTitle={t("TASKS")} centerValue={sumValues(departmentPerformance)} />
                                </AnalyticsCard>
                            )}
                        </div>
                    </section>
                )}
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
