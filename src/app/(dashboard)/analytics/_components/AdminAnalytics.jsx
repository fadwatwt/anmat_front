"use client"
import { ImSpinner2 } from "react-icons/im";

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

const AdminAnalytics = () => {
    const { t } = useTranslation();
    const { data: adminData, isLoading, error } = useGetAdminAnalyticsQuery();

    if (isLoading) return <div className="text-center py-20"> <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div> </div>;
    if (error) return <div className="p-8 text-red-500 text-center">{t("Error loading admin analytics.")}</div>;

    const data = adminData?.data || {};

    return (
        <Page
            title={t("All Analytics Overview")}
            isBtn={false}
            otherHeaderActions={
                <div className="flex gap-3">
                    <select className="bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium cursor-pointer">
                        <option>{t("All Charts")}</option>
                    </select>
                    <select className="bg-status-bg border border-status-border rounded-xl px-4 py-2 text-sm shadow-sm outline-none text-cell-secondary font-medium cursor-pointer">
                        <option>{t("All Sections")}</option>
                    </select>
                </div>
            }
        >
            <div className="flex flex-col gap-12">
                <div className="flex flex-col items-start justify-start gap-6">
                    <h2 className="text-xl font-bold text-cell-primary">
                        {t("Companies Analytics")}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                        <div className="w-full h-full min-h-[400px]">
                            <IndustriesChart industries={data.industriesChart} />
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <SubscriptionsChart totalCompanies={data.totalCompanies} totalUsers={data.totalUsers} />
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <CompaniesSubscriptionsChart monthlyData={data.companiesSubscriptionsMonthly} />
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <TopCompaniesList companies={data.topCompanies} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-6 w-full">
                    <h2 className="text-xl font-bold text-cell-primary">
                        {t("Projects Analytics")}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                        <div className="w-full h-full min-h-[400px]">
                            <ProjectsPerformanceChart monthlyData={data.projectsPerformanceMonthly} />
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <ProjectTimelineChart data={data.projectTimelineMonthly} />
                        </div>
                        <div className="w-full h-full min-h-[400px] lg:col-span-2">
                            <LastProjectsList projects={data.lastProjects} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-6 w-full pb-8">
                    <h2 className="text-xl font-bold text-cell-primary">
                        {t("Revenues & Engagement")}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                        <div className="w-full h-full min-h-[400px]">
                            <CompaniesContactedChart data={data.companiesContacted} />
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <RevenuesChart data={data.revenuesMonthly} />
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default AdminAnalytics;
