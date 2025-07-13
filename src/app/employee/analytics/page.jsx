"use client"

import Page from "@/components/Page";
import IndustriesChart from "@/app/admin/analytics/_components/charts/IndustriesChart";
import SubscriptionsChart from "@/app/admin/analytics/_components/charts/SubscriptionsChart";
import CompaniesContactedChart from "@/app/admin/analytics/_components/charts/CompaniesContactedChart";
import CompaniesSubscriptionsChart from "@/app/admin/analytics/_components/charts/CompaniesSubscriptionsChart";
import ProjectsPerformanceChart from "@/app/admin/analytics/_components/charts/ProjectsPerformanceChart";
import TopCompaniesList from "@/app/admin/analytics/_components/lists/TopCompaniesList";
import LastProjectsList from "@/app/admin/analytics/_components/lists/LastProjectsList";
import ProjectTimelineChart from "@/app/admin/analytics/_components/charts/ProjectTimelineChart";
import RevenuesChart from "@/app/admin/analytics/_components/charts/RevenuesChart";
import ProjectsPerformanceList from "@/app/admin/analytics/_components/lists/ProjectsPerformanceList";
import DefaultSelect from "@/components/Form/DefaultSelect";

const AdminAnalyticsPage = () => {

    return (
        <Page
            title="All Analytics Overview"
            isBtn={false}
            otherHeaderActions={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect placeholder="charts" options={[{ id: 1, value: "All Charts" }]} />
                    <DefaultSelect placeholder="sections" options={[{ id: 1, value: "All Sections" }]} />
                </div>
            }
        >
            {/* Companies Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                <span className="text-lg text-gray-500">
                    Companies
                </span>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <IndustriesChart />
                    </div>
                    <div className="w-full md:w-1/2">
                        <SubscriptionsChart />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <CompaniesSubscriptionsChart />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TopCompaniesList />
                    </div>
                </div>
            </div>

            {/* Tasks Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                <span className="text-lg text-gray-500">
                    Tasks
                </span>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <ProjectsPerformanceChart />
                    </div>
                    <div className="w-full md:w-1/2">
                        <ProjectTimelineChart />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-2/3">
                        <ProjectsPerformanceList />
                    </div>
                    <div className="w-full md:w-1/3">
                        <LastProjectsList />
                    </div>
                </div>
            </div>

            {/* Other Analytics */}
            <div className="flex flex-col items-start justify-start gap-4 w-full">
                <span className="text-lg text-gray-500">
                    Other Analytics
                </span>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <CompaniesContactedChart />
                    </div>
                    <div className="w-full md:w-1/2">
                        <RevenuesChart />
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default AdminAnalyticsPage;
