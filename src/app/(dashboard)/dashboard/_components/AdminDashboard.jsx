"use client";

import Page from "@/components/Page";
import AnalyticsCard from "@/app/(dashboard)/analytics/_components/AnalyticsCard";
import DefaultSelect from "@/components/Form/DefaultSelect";
import IndustriesChart from "@/app/(dashboard)/analytics/_components/admin/charts/IndustriesChart";
import CompaniesSubscriptionsChart from "@/app/(dashboard)/analytics/_components/admin/charts/CompaniesSubscriptionsChart";
import Table from "@/components/Tables/Table";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useGetSubscriptionsBasicDetailsQuery } from "@/redux/subscriptions/subscriptionsApi";
import { useGetIndustriesQuery } from "@/redux/industries/industriesApi";
import { useGetOrganizationsQuery } from "@/redux/organizations/organizationsApi";
import { useGetAdminAnalyticsQuery } from "@/redux/analytics/analyticsApi";
import { statusCell } from "@/components/StatusCell";
import { usePermission } from "@/Hooks/usePermission";
import {
    RiBuilding2Line,
    RiProjector2Line,
    RiTaskLine,
    RiUser3Line,
    RiArrowRightUpLine,
    RiArrowRightDownLine,
    RiLockLine
} from "@remixicon/react";

const SummaryCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-surface p-6 rounded-[24px] shadow-sm border border-status-border flex items-center justify-between hover:shadow-md transition-shadow group">
        <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-cell-secondary">{title}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-table-title">{value}</span>
                {trend && (
                    <span className={`text-xs flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend > 0 ? <RiArrowRightUpLine size={14} /> : <RiArrowRightDownLine size={14} />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

const SectionSkeleton = () => (
    <div className="animate-pulse bg-surface rounded-[24px] border border-status-border h-48" />
);

const AdminDashboard = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [selectedIndustry, setSelectedIndustry] = useState([]);
    const industryId = selectedIndustry[0]?.id;

    const canViewAnalytics = usePermission('admin.analytics.view');
    const canViewSubscribers = usePermission('admin.subscribers.list');
    const canViewIndustries = usePermission('admin.industries.list');

    const { data: adminStats, isLoading: statsLoading } = useGetAdminAnalyticsQuery(undefined, {
        skip: !canViewAnalytics,
    });
    const { data: subscriptions, isLoading: subsLoading } = useGetSubscriptionsBasicDetailsQuery(undefined, {
        skip: !canViewSubscribers,
    });
    const { data: industriesResponse } = useGetIndustriesQuery(undefined, {
        skip: !canViewIndustries,
    });
    const { data: organizations, isLoading: orgsLoading } = useGetOrganizationsQuery(
        industryId ? { industry_id: industryId } : {},
        { skip: !canViewSubscribers }
    );

    const industries = industriesResponse?.data || industriesResponse || [];
    const industryOptions = useMemo(() => [
        { id: null, value: "All" },
        ...industries.map(ind => ({ id: ind._id, value: ind.name }))
    ], [industries]);

    const stats = adminStats?.data || adminStats || {};

    const subsHeaders = [
        { label: "Subscriber", width: "180px" },
        { label: "Company", width: "220px" },
        { label: "Status", width: "100px" },
        { label: "Start Date", width: "120px" },
        { label: "Expiration", width: "120px" },
    ];

    const subsRows = subscriptions?.map((item) => [
        <div key={`sub-${item.subscription?._id}`} className="flex flex-col gap-0.5 max-w-[150px]">
            <span className="text-sm font-semibold text-cell-primary truncate" title={item.subscriber?.name}>
                {item.subscriber?.name || "N/A"}
            </span>
            <span className="text-[11px] text-cell-secondary truncate" title={item.subscriber?.email}>
                {item.subscriber?.email || ""}
            </span>
        </div>,
        <div key={`org-${item.subscription?._id}`} className="flex flex-col gap-0.5 max-w-[180px]">
            <span className="text-sm font-medium text-table-title truncate" title={item.organization?.name}>
                {item.organization?.name || "N/A"}
            </span>
            <span className="text-[11px] text-cell-secondary truncate" title={item.organization?.website || item.organization?.email}>
                {item.organization?.website || item.organization?.email || ""}
            </span>
        </div>,
        <div key={`status-${item.subscription?._id}`}>
            {statusCell(item.subscription?.status, item.subscription?._id)}
        </div>,
        <span key={`start-${item.subscription?._id}`} className="text-sm text-cell-secondary font-medium">
            {item.subscription?.starts_at ? format(new Date(item.subscription.starts_at), "MMM dd, yyyy") : "N/A"}
        </span>,
        <span key={`expires-${item.subscription?._id}`} className="text-sm text-cell-secondary font-medium">
            {item.subscription?.expires_at ? format(new Date(item.subscription.expires_at), "MMM dd, yyyy") : "N/A"}
        </span>,
    ]) || [];

    const hasAnySections = canViewAnalytics || canViewSubscribers;

    if (!hasAnySections) {
        return (
            <Page isTitle={false}>
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-cell-secondary">
                    <RiLockLine size={56} className="opacity-20" />
                    <p className="text-lg font-semibold">{t("No dashboard sections available")}</p>
                    <p className="text-sm opacity-60">{t("You don't have permission to view any dashboard content.")}</p>
                </div>
            </Page>
        );
    }

    return (
        <Page isTitle={false} className="gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-table-title">{t("Dashboard Overview")}</h1>
                <p className="text-sm text-cell-secondary">{t("Welcome back, here's what's happening with the system today.")}</p>
            </div>

            {/* Analytics section */}
            {canViewAnalytics && (
                <>
                    {statsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                            {[1,2,3,4].map(i => <SectionSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                            <SummaryCard
                                title="Total Companies"
                                value={stats.totalCompanies || 0}
                                icon={RiBuilding2Line}
                                color="bg-blue-500"
                                trend={12}
                            />
                            <SummaryCard
                                title="Active Projects"
                                value={stats.totalProjects || 0}
                                icon={RiProjector2Line}
                                color="bg-purple-500"
                                trend={8}
                            />
                            <SummaryCard
                                title="Total Tasks"
                                value={stats.totalTasks || 0}
                                icon={RiTaskLine}
                                color="bg-orange-500"
                                trend={-3}
                            />
                            <SummaryCard
                                title="System Users"
                                value={stats.totalUsers || 0}
                                icon={RiUser3Line}
                                color="bg-green-500"
                                trend={5}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                        <IndustriesChart industries={stats.industriesChart} />
                        <CompaniesSubscriptionsChart data={stats.companiesSubscriptionsMonthly} />
                    </div>
                </>
            )}

            {/* Subscribers section */}
            {canViewSubscribers && (
                subsLoading ? (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
                        <div className="xl:col-span-2"><SectionSkeleton /></div>
                        <SectionSkeleton />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full items-start">
                        <div className="xl:col-span-2">
                            <Table
                                title="Recent Subscriptions"
                                headers={subsHeaders}
                                rows={subsRows}
                                isCheckInput={false}
                                isTitle={true}
                                classContainer="shadow-sm border border-status-border rounded-[24px]"
                                onRowClick={(index) => {
                                    if (subscriptions?.[index]?.subscriber?._id) {
                                        router.push(`/subscribers/${subscriptions[index].subscriber._id}`);
                                    }
                                }}
                            />
                        </div>

                        <AnalyticsCard title="New Companies Joined">
                            <div className="flex flex-col gap-4 mt-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="mb-2">
                                    <DefaultSelect
                                        placeholder="Filter by Industry"
                                        options={industryOptions}
                                        value={selectedIndustry}
                                        onChange={setSelectedIndustry}
                                        multi={false}
                                        variant="chart"
                                    />
                                </div>

                                {orgsLoading ? (
                                    <div className="flex flex-col gap-4">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="flex gap-4 animate-pulse">
                                                <div className="w-12 h-12 rounded-full bg-status-bg" />
                                                <div className="flex-1 flex flex-col gap-2 justify-center">
                                                    <div className="h-4 bg-status-bg rounded w-3/4" />
                                                    <div className="h-3 bg-status-bg rounded w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : organizations?.length > 0 ? (
                                    organizations.map((org, index) => (
                                        <div key={org._id || index} className="flex gap-4 items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-all group border border-transparent hover:border-status-border">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-status-border flex-shrink-0 group-hover:scale-105 transition-transform">
                                                <img
                                                    src={org.logo || `https://ui-avatars.com/api/?name=${org.name}&background=random`}
                                                    alt={org.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col flex-1 overflow-hidden">
                                                <span className="text-sm font-bold text-table-title truncate" title={org.name}>
                                                    {org.name}
                                                </span>
                                                <span className="text-[11px] text-cell-secondary truncate" title={org.website || org.email}>
                                                    {org.website || org.email}
                                                </span>
                                            </div>
                                            <RiArrowRightUpLine size={16} className="text-cell-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-cell-secondary gap-2">
                                        <RiBuilding2Line size={40} className="opacity-20" />
                                        <p className="text-sm">No organizations found</p>
                                    </div>
                                )}
                            </div>
                        </AnalyticsCard>
                    </div>
                )
            )}
        </Page>
    );
}

export default AdminDashboard;
