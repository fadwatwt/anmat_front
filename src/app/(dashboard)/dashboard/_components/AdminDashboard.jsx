"use client";

import Page from "@/components/Page";
import ContentCard from "@/components/containers/ContentCard";
import DefaultSelect from "@/components/Form/DefaultSelect";
import IndustriesChart from "@/app/(dashboard)/analytics/_components/admin/charts/IndustriesChart";
import CompaniesSubscriptionsChart from "@/app/(dashboard)/analytics/_components/admin/charts/CompaniesSubscriptionsChart";
import Table from "@/components/Tables/Table";
import EmployeeRequests from "@/app/(dashboard)/dashboard/_components/employee/EmployeeRequests";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useGetSubscriptionsBasicDetailsQuery } from "@/redux/subscriptions/subscriptionsApi";
import { useGetIndustriesQuery } from "@/redux/industries/industriesApi";
import { useGetOrganizationsQuery } from "@/redux/organizations/organizationsApi";
import { statusCell } from "@/components/StatusCell";

const AdminDashboard = () => {
    const [selectedIndustry, setSelectedIndustry] = useState([]);
    const industryId = selectedIndustry[0]?.id;

    const { data: subscriptions, isLoading: subsLoading, error: subsError } = useGetSubscriptionsBasicDetailsQuery();
    const { data: industriesResponse } = useGetIndustriesQuery();
    const { data: organizations, isLoading: orgsLoading } = useGetOrganizationsQuery(
        industryId ? { industry_id: industryId } : {}
    );

    const industries = industriesResponse?.data || industriesResponse || [];
    const industryOptions = useMemo(() => [
        { id: null, value: "All" },
        ...industries.map(ind => ({ id: ind._id, value: ind.name }))
    ], [industries]);

    const headers = [
        { label: "Subscriber", width: "180px" },
        { label: "Company", width: "220px" },
        { label: "Phone", width: "130px" },
        { label: "Status", width: "120px" },
        { label: "Start Date", width: "130px" },
        { label: "Expiration Date", width: "130px" },
    ];

    const rows = subscriptions?.map((item) => [
        <div key={`sub-${item.subscription?._id}`} className="flex flex-col items-start justify-start gap-0.5 overflow-hidden w-full">
            <span
                className="text-sm text-gray-700 truncate w-full block max-w-[150px]"
                title={item.subscriber?.name}
            >
                {item.subscriber?.name || "N/A"}
            </span>
            <span
                className="text-xs text-gray-400 truncate w-full block max-w-[150px]"
                title={item.subscriber?.email}
            >
                {item.subscriber?.email || ""}
            </span>
        </div>,
        <div key={`org-${item.subscription?._id}`} className="flex flex-col items-start justify-start gap-1 overflow-hidden w-full">
            <span
                className="text-sm font-medium text-gray-900 truncate w-full block max-w-[200px]"
                title={item.organization?.name}
            >
                {item.organization?.name || "N/A"}
            </span>
            <span
                className="text-xs text-gray-500 truncate w-full block max-w-[200px]"
                title={item.organization?.website || item.organization?.email}
            >
                {item.organization?.website || item.organization?.email || ""}
            </span>
        </div>,
        <span key={`phone-${item.subscription?._id}`} className="text-sm text-gray-600 truncate max-w-[120px]" title={item.organization?.phone || item.subscriber?.phone}>
            {item.organization?.phone || item.subscriber?.phone || "N/A"}
        </span>,
        statusCell(item.subscription?.status, item.subscription?._id),
        <span key={`start-${item.subscription?._id}`} className="text-sm text-gray-600">
            {item.subscription?.starts_at ? format(new Date(item.subscription.starts_at), "MMM dd, yyyy") : "N/A"}
        </span>,
        <span key={`expires-${item.subscription?._id}`} className="text-sm text-gray-600">
            {item.subscription?.expires_at ? format(new Date(item.subscription.expires_at), "MMM dd, yyyy") : "N/A"}
        </span>,
    ]) || [];


    if (subsLoading) return <div className="flex justify-center items-center h-full p-10">Loading dashboard...</div>;
    if (subsError) return <div className="flex justify-center items-center h-full p-10 text-red-500">Error loading dashboard data.</div>;

    return (
        <Page
            title="Dashboard"
            isBtn={false}
        >
            {/* Companies Analytics */}
            <div className="flex flex-col items-start justify-start gap-4">
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-1/2">
                        <IndustriesChart />
                    </div>
                    <div className="w-full md:w-1/2">
                        <CompaniesSubscriptionsChart />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                    <div className="w-full md:w-2/3">
                        <Table
                            title="Subscriptions"
                            headers={headers}
                            rows={rows}
                            isCheckInput={false}
                            isTitle={true}
                            classContainer={"h-full"}
                        />
                    </div>
                    <div className="w-full md:w-1/3">
                        <ContentCard
                            title={"Companies Joined"}
                            toolbar={
                                <div className="w-40 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                                    <DefaultSelect
                                        placeholder="Industry"
                                        options={industryOptions}
                                        value={selectedIndustry}
                                        onChange={setSelectedIndustry}
                                        multi={false}
                                    />
                                </div>
                            }
                            main={
                                <div className="flex flex-col items-start justify-start gap-4 w-full">
                                    {orgsLoading ? (
                                        <div className="text-sm text-gray-500 py-4 w-full text-center">Loading...</div>
                                    ) : organizations?.length > 0 ? (
                                        organizations.map((org, index) => {
                                            return (
                                                <div key={org._id || index} className="flex gap-2 items-start justify-start w-full overflow-hidden">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 flex-shrink-0">
                                                        <img
                                                            src={org.logo || `https://ui-avatars.com/api/?name=${org.name}&background=random`}
                                                            alt={org.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-start justify-start gap-1 overflow-hidden">
                                                        <span className="text-sm font-medium text-gray-900 truncate w-full" title={org.name}>
                                                            {org.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 truncate w-full" title={org.website || org.email}>
                                                            {org.website || org.email}
                                                        </span>
                                                    </div>
                                                </div>)
                                        })
                                    ) : (
                                        <div className="text-sm text-gray-400 py-4 w-full text-center">No organizations found.</div>
                                    )
                                    }
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>

        </Page>
    );
}

export default AdminDashboard;

