"use client";

import Page from "@/components/Page";
import ContentCard from "@/components/containers/ContentCard";
import DefaultSelect from "@/components/Form/DefaultSelect";
import IndustriesChart from "@/app/(dashboard)/analytics/_components/admin/charts/IndustriesChart";
import CompaniesSubscriptionsChart from "@/app/(dashboard)/analytics/_components/admin/charts/CompaniesSubscriptionsChart";
import Table from "@/components/Tables/Table";
import EmployeeRequests from "@/app/(dashboard)/dashboard/_components/employee/EmployeeRequests";

const CompanyManagerDashboard = () => {

    const headers = [
        { label: "Company Name", width: "200px" },
        { label: "Industry", width: "150px" },
        { label: "Subscription Date", width: "150px" },
        { label: "Plan", width: "100px" },
    ];

    const companiesList = [
        {
            id: "1",
            companyName: "Tech Innovations",
            industry: "Technology",
            subscriptionDate: "2025-07-01",
            plan: "Premium",
            avatar: "https://ui-avatars.com/api/?name=Tech+Innovations",
        },
        {
            id: "2",
            companyName: "Green Solutions",
            industry: "Renewable Energy",
            subscriptionDate: "2025-06-15",
            plan: "Basic",
            avatar: "https://ui-avatars.com/api/?name=Green+Solutions",
        },
        {
            id: "3",
            companyName: "HealthCare Inc",
            industry: "Healthcare",
            subscriptionDate: "2025-07-10",
            plan: "Pro",
            avatar: "https://ui-avatars.com/api/?name=HealthCare+Inc",
        },
    ];

    const rows = companiesList.map((item) => [
        <div key={`name-${item.id}`} className="flex items-center space-x-2">
            <img src={item.avatar} alt={item.companyName} className="w-8 h-8 rounded-full" />
            <span className="text-sm">{item.companyName}</span>
        </div>,
        <span key={`industry-${item.id}`} className="text-sm">{item.industry}</span>,
        <span key={`date-${item.id}`} className="text-sm">{item.subscriptionDate}</span>,
        <span key={`plan-${item.id}`} className="text-sm capitalize">{item.plan}</span>,
    ]);

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
                            title="Companies Subscriptions"
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
                                    {lastCompaniesJoined.map(company => {
                                        return (
                                            <div className="flex gap-2 items-start justify-start w-full">
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

export default CompanyManagerDashboard;
