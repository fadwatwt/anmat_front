"use client"

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
import ProjectsPerformanceList from "@/app/(dashboard)/analytics/_components/admin/lists/ProjectsPerformanceList";
import DefaultSelect from "@/components/Form/DefaultSelect";

const AdminAnalytics = () => {

    return (
        <Page
            title="All Analytics Overview"
            isBtn={false}
            otherHeaderActions={
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-center justify-end">
                    <div className="w-full sm:w-40 md:w-48">
                        <DefaultSelect placeholder="charts" options={[{ id: 1, value: "All Charts" }]} />
                    </div>
                    <div className="w-full sm:w-40 md:w-48">
                        <DefaultSelect placeholder="sections" options={[{ id: 1, value: "All Sections" }]} />
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-12">
                {/* Companies Analytics */}
                {/* Companies Analytics Section */}
                <div className="flex flex-col items-start justify-start gap-6">
                    <h2 className="text-xl font-bold text-cell-primary">
                        Companies Analytics
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                        <div className="w-full h-full min-h-[400px]">
                            <IndustriesChart />
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <SubscriptionsChart />
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <CompaniesSubscriptionsChart />
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <TopCompaniesList />
                        </div>
                    </div>
                </div>

                {/* Other Analytics */}
                {/* Revenues & Engagement Section */}
                <div className="flex flex-col items-start justify-start gap-6 w-full pb-8">
                    <h2 className="text-xl font-bold text-cell-primary">
                        Revenues & Engagement
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                        <div className="w-full h-full min-h-[400px]">
                            <CompaniesContactedChart />
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <RevenuesChart />
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default AdminAnalytics;
