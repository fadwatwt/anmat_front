"use client"
import { useState, useMemo, useRef, useEffect } from "react";
import { ImSpinner2 } from "react-icons/im";
import { RiDownloadLine } from '@remixicon/react';

import Page from "@/components/Page";
import IndustriesChart from "@/app/(dashboard)/analytics/_components/admin/charts/IndustriesChart";
import SubscriptionsChart from "@/app/(dashboard)/analytics/_components/admin/charts/SubscriptionsChart";
import CompaniesContactedChart from "@/app/(dashboard)/analytics/_components/admin/charts/CompaniesContactedChart";
import CompaniesSubscriptionsChart from "@/app/(dashboard)/analytics/_components/admin/charts/CompaniesSubscriptionsChart";
import ProjectsPerformanceChart from "@/app/(dashboard)/analytics/_components/admin/charts/ProjectsPerformanceChart";
import TopCompaniesList from "@/app/(dashboard)/analytics/_components/admin/lists/TopCompaniesList";
import LastProjectsList from "@/app/(dashboard)/analytics/_components/admin/lists/LastProjectsList";
import ProjectTimelineChart from "@/app/(dashboard)/analytics/_components/admin/charts/ProjectTimelineChart";
import RevenuesChart from "@/app/(dashboard)/analytics/_components/admin/charts/RevenuesChart";
import { useTranslation } from "react-i18next";
import { useGetAdminAnalyticsQuery } from "@/redux/analytics/analyticsApi";
import {
    resolveTimeRange,
    SECTION_OPTIONS,
    CHART_TYPE_OPTIONS,
} from './filterOptions';
import { formatAdminAnalytics, exportAsPdf, exportCsv, exportXlsx } from './exportHelpers';

const AdminAnalytics = () => {
    const { t, i18n } = useTranslation();

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
        const { headers, rows, fileName } = formatAdminAnalytics(data);
        if (format === 'csv') {
            exportCsv(headers, rows, fileName);
        } else if (format === 'xlsx') {
            await exportXlsx(headers, rows, fileName);
        } else if (format === 'pdf') {
            const children = contentRef.current ? Array.from(contentRef.current.children) : [];
            if (children.length) {
                await exportAsPdf(children, 'admin_analytics_report');
            }
        }
    };

    const dateRange = useMemo(() => resolveTimeRange("12m"), []);

    const filters = useMemo(() => ({
        ...dateRange,
        section: sectionFilter || undefined,
        locale: i18n.language,
    }), [dateRange, sectionFilter, i18n.language]);

    const { data: adminData, isLoading, error } = useGetAdminAnalyticsQuery(filters);

    const showSection = (section) => !sectionFilter || sectionFilter === section;
    const isChartTypeVisible = (type) => !chartTypeFilter || chartTypeFilter === type;

    if (isLoading) return <div className="text-center py-20"> <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div> </div>;
    if (error) return <div className="p-8 text-red-500 text-center">{t("Error loading admin analytics.")}</div>;

    const data = adminData?.data || {};

    return (
        <Page
            title={t("All Analytics Overview")}
            isBtn={false}
            otherHeaderActions={
                <div className="flex gap-3 items-center">
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
                    <div className="relative flex items-center">
                        <select
                            className="appearance-none bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium cursor-pointer pr-9"
                            value={chartTypeFilter}
                            onChange={(e) => setChartTypeFilter(e.target.value)}
                        >
                            {CHART_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative flex items-center">
                        <select
                            className="appearance-none bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium cursor-pointer pr-9"
                            value={sectionFilter}
                            onChange={(e) => setSectionFilter(e.target.value)}
                        >
                            {SECTION_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-12" ref={contentRef}>
                {/* Companies Analytics */}
                {showSection('companies') && (
                    <div className="flex flex-col items-start justify-start gap-6">
                        <h2 className="text-xl font-bold text-cell-primary">
                            {t("Companies Analytics")}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                            {isChartTypeVisible('doughnut') && (
                                <div className="w-full h-full min-h-[400px]">
                                    <IndustriesChart industries={data.industriesChart} />
                                </div>
                            )}
                            {isChartTypeVisible('doughnut') && (
                                <div className="w-full h-full min-h-[400px]">
                                    <SubscriptionsChart totalCompanies={data.totalCompanies} totalUsers={data.totalUsers} />
                                </div>
                            )}
                            {isChartTypeVisible('bar') && (
                                <div className="w-full h-full min-h-[400px]">
                                    <CompaniesSubscriptionsChart monthlyData={data.companiesSubscriptionsMonthly} />
                                </div>
                            )}
                            <div className="w-full h-full min-h-[400px]">
                                <TopCompaniesList companies={data.topCompanies} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Projects Analytics */}
                {showSection('projects') && (
                    <div className="flex flex-col items-start justify-start gap-6 w-full">
                        <h2 className="text-xl font-bold text-cell-primary">
                            {t("Projects Analytics")}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                            {isChartTypeVisible('bar') && (
                                <div className="w-full h-full min-h-[400px]">
                                    <ProjectsPerformanceChart monthlyData={data.projectsPerformanceMonthly} />
                                </div>
                            )}
                            {isChartTypeVisible('line') && (
                                <div className="w-full h-full min-h-[400px]">
                                    <ProjectTimelineChart data={data.projectTimelineMonthly} />
                                </div>
                            )}
                            <div className="w-full h-full min-h-[400px] lg:col-span-2">
                                <LastProjectsList projects={data.lastProjects} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Revenues & Engagement */}
                {showSection('revenues') && (
                    <div className="flex flex-col items-start justify-start gap-6 w-full pb-8">
                        <h2 className="text-xl font-bold text-cell-primary">
                            {t("Revenues & Engagement")}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                            {isChartTypeVisible('doughnut') && (
                                <div className="w-full h-full min-h-[400px]">
                                    <CompaniesContactedChart data={data.companiesContacted} />
                                </div>
                            )}
                            {isChartTypeVisible('line') && (
                                <div className="w-full h-full min-h-[400px]">
                                    <RevenuesChart data={data.revenuesMonthly} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Page>
    );
}

export default AdminAnalytics;
