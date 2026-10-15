"use client"
import { useState, useMemo, useRef } from "react";

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
import AnalyticsExportMenu from './AnalyticsExportMenu';
import AnalyticsPageSkeleton from './AnalyticsPageSkeleton';
import usePersistedAnalyticsFilter from './usePersistedAnalyticsFilter';

const AdminAnalytics = () => {
    const { t, i18n } = useTranslation();

    const [sectionFilter, setSectionFilter] = usePersistedAnalyticsFilter("analytics:admin:section");
    const [chartTypeFilter, setChartTypeFilter] = usePersistedAnalyticsFilter("analytics:admin:chart");

    // --- Export ---
    const contentRef = useRef(null);

    const handleExport = async (format) => {
        const { headers, rows, fileName } = formatAdminAnalytics(data);
        if (format === 'csv') {
            exportCsv(headers, rows, fileName);
        } else if (format === 'xlsx') {
            await exportXlsx(headers, rows, fileName, i18n.resolvedLanguage || i18n.language);
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
        locale: i18n.language,
    }), [dateRange, i18n.language]);

    const { data: adminData, isLoading, error } = useGetAdminAnalyticsQuery(filters);

    const showSection = (section) => !sectionFilter || sectionFilter === section;
    const isChartTypeVisible = (type) => !chartTypeFilter || chartTypeFilter === type;

    if (isLoading) return <AnalyticsPageSkeleton />;
    if (error) return <div className="p-8 text-red-500 text-center">{t("Error loading admin analytics.")}</div>;

    const data = adminData?.data || {};

    return (
        <Page
            title={t("All Analytics Overview")}
            isBtn={false}
            otherHeaderActions={
                <div className="flex flex-wrap gap-2 items-center justify-end">
                    <AnalyticsExportMenu onExport={handleExport} />
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
