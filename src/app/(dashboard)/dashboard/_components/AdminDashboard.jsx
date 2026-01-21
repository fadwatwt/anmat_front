"use client";

import Page from "@/components/Page";
import ContentCard from "@/components/containers/ContentCard";
import DefaultSelect from "@/components/Form/DefaultSelect";
import IndustriesChart from "@/app/(dashboard)/analytics/_components/admin/charts/IndustriesChart";
import CompaniesSubscriptionsChart from "@/app/(dashboard)/analytics/_components/admin/charts/CompaniesSubscriptionsChart";
import Table from "@/components/Tables/Table";
import EmployeeRequests from "@/app/(dashboard)/dashboard/_components/employee/EmployeeRequests";

import { format } from "date-fns";
import { useGetSubscriptionsBasicDetailsQuery } from "@/redux/subscriptions/subscriptionsApi";
import { statusCell } from "@/components/StatusCell";

const AdminDashboard = () => {
    const { data: subscriptions, isLoading, error } = useGetSubscriptionsBasicDetailsQuery();

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

    const lastCompaniesJoined = [
        {
            logo: "/images/logo.png",
            name: "Company Name",
            url: "company.io"
        },
        {
            logo: "/images/logo.png",
            name: "Company Name",
            url: "company.io"
        },
        {
            logo: "/images/logo.png",
            name: "Company Name",
            url: "company.io"
        },
        {
            logo: "/images/logo.png",
            name: "Company Name",
            url: "company.io"
        }
    ];

    if (isLoading) return <div className="flex justify-center items-center h-full p-10">Loading dashboard...</div>;
    if (error) return <div className="flex justify-center items-center h-full p-10 text-red-500">Error loading dashboard data.</div>;

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
                            title={"Last Companies Joined"}
                            toolbar={
                                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                                    <DefaultSelect placeholder="Industry" options={[{ id: 1, value: "Design" }]} />
                                </div>
                            }
                            main={
                                <div className="flex flex-col items-start justify-start gap-4 w-full">
                                    {lastCompaniesJoined.map((company, index) => {
                                        return (
                                            <div key={index} className="flex gap-2 items-start justify-start w-full">
                                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                                    <img src={company.logo} alt="Logo" className="w-full" />
                                                </div>
                                                <div className="flex flex-col items-start justify-start gap-1">
                                                    <span className="text-md text-gray-900">
                                                        {company.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {company.url}
                                                    </span>
                                                </div>
                                            </div>)
                                    })
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

