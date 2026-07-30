"use client"
import { useState, useMemo, useRef, useEffect } from "react";
import { ImSpinner2 } from "react-icons/im";
import { RiDownloadLine } from '@remixicon/react';

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
import { useTranslation } from "react-i18next";
import { useGetEmployeeAnalyticsQuery } from "@/redux/analytics/analyticsApi";
import {
    TIME_RANGE_OPTIONS,
    resolveTimeRange,
    SECTION_OPTIONS,
    CHART_TYPE_OPTIONS,
} from './filterOptions';
import { formatEmployeeAnalytics, exportAsPdf, exportCsv, exportXlsx } from './exportHelpers';

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
    const { t } = useTranslation();

    const [timeRange, setTimeRange] = useState("6m");
    const [sectionFilter, setSectionFilter] = useState("");
    const [chartTypeFilter, setChartTypeFilter] = useState("");

    // --- Export ---
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (exportRef.current && !exportRef.current.contains(e.target)) {
                setShowExportMenu(false);
            }
        };
        if (showExportMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showExportMenu]);

    const handleExport = async (format) => {
        setShowExportMenu(false);
        const { headers, rows, fileName } = formatEmployeeAnalytics(data);
        if (format === 'csv') {
            exportCsv(headers, rows, fileName);
        } else if (format === 'xlsx') {
            await exportXlsx(headers, rows, fileName);
        } else if (format === 'pdf') {
            const children = contentRef.current ? Array.from(contentRef.current.children) : [];
            if (children.length) {
                await exportAsPdf(children, 'my_analytics_report');
            }
        }
    };

    const dateRange = useMemo(() => resolveTimeRange(timeRange), [timeRange]);

    const filters = useMemo(() => ({
        ...dateRange,
        section: sectionFilter || undefined,
    }), [dateRange, sectionFilter]);

    const { data: employeeData, isLoading, error } = useGetEmployeeAnalyticsQuery(filters);

    const showSection = (section) => !sectionFilter || sectionFilter === section;
    const isChartTypeVisible = (type) => !chartTypeFilter || chartTypeFilter === type;

    const sectionOptions = useMemo(() =>
        SECTION_OPTIONS.map((opt) => ({ id: opt.value, value: t(opt.label) })),
        [t]
    );

    const chartOptions = useMemo(() =>
        CHART_TYPE_OPTIONS.map((opt) => ({ id: opt.value, value: t(opt.label) })),
        [t]
    );

    const timeRangeSelectOptions = useMemo(() =>
        TIME_RANGE_OPTIONS.map((opt) => ({ id: opt.value, value: t(opt.label) })),
        [t]
    );

    if (isLoading) return <div className="text-center py-20"> <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div> </div>;
    if (error) return <div className="p-8 text-red-500 text-center">{t("Error loading employee analytics.")}</div>;

    const data = employeeData?.data || {};

    const tasksSummaryData = toDoughnutData(data.tasksSummary, null);
    const tasksRatingData = toDoughnutData(data.tasksRatingData, RATING_COLORS);

    return (
        <Page
            title={t("All Analytics Overview")}
            isBtn={false}
            otherHeaderActions={
                <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <div className="relative" ref={exportRef}>
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 bg-primary-base text-white rounded-xl px-4 py-2 text-sm shadow-sm font-medium hover:opacity-90"
                        >
                            <RiDownloadLine className="size-4" />
                            {t("Export")}
                        </button>
                        {showExportMenu && (
                            <div className="absolute right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
                                <button onClick={() => handleExport('csv')} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700">{t("CSV")}</button>
                                <button onClick={() => handleExport('xlsx')} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700">{t("Excel (XLSX)")}</button>
                                <button onClick={() => handleExport('pdf')} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700">{t("PDF")}</button>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <DefaultSelect
                            placeholder="charts"
                            options={chartOptions}
                            onChange={(selected) => setChartTypeFilter(selected[0]?.id || "")}
                        />
                    </div>
                    <div className="relative">
                        <DefaultSelect
                            placeholder="sections"
                            options={sectionOptions}
                            onChange={(selected) => setSectionFilter(selected[0]?.id || "")}
                        />
                    </div>
                    <div className="relative">
                        <DefaultSelect
                            placeholder="time"
                            options={timeRangeSelectOptions}
                            onChange={(selected) => setTimeRange(selected[0]?.id || "6m")}
                            multi={false}
                        />
                    </div>
                </div>
            }
        >
            <div ref={contentRef}>
            {/* Tasks Analytics */}
            {showSection('tasks') && (
                <div className="flex flex-col items-start justify-start gap-4">
                    <span className="text-lg text-gray-500">
                        {t("Tasks Analytics")}
                    </span>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        {isChartTypeVisible('doughnut') && (
                            <div className="w-full md:w-1/2">
                                <TasksSummaryChart data={tasksSummaryData} />
                            </div>
                        )}
                        {isChartTypeVisible('bar') && (
                            <div className="w-full md:w-1/2">
                                <TasksPerformanceChart monthlyData={data.tasksPerformanceMonthly || []} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        {isChartTypeVisible('line') && (
                            <div className="w-full md:w-1/2">
                                <TasksTimelineChart data={data.tasksTimelineMonthly || []} />
                            </div>
                        )}
                        {isChartTypeVisible('doughnut') && (
                            <div className="w-full md:w-1/2">
                                <TasksRatingChart data={tasksRatingData} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Projects Analytics */}
            {showSection('projects') && (
                <div className="flex flex-col items-start justify-start gap-4">
                    <span className="text-lg text-gray-500">
                        {t("Projects Analysis")}
                    </span>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        {isChartTypeVisible('bar') && (
                            <div className="w-full md:w-1/2">
                                <ProjectsPerformanceChart monthlyData={data.projectsPerformanceMonthly || []} />
                            </div>
                        )}
                        {isChartTypeVisible('line') && (
                            <div className="w-full md:w-1/2">
                                <ProjectTimelineChart data={data.projectTimelineMonthly || []} />
                            </div>
                        )}
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
            )}
            </div>

        </Page>
    );
}

export default EmployeeAnalytics;
