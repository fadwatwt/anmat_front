"use client";
import { useParams, useRouter } from 'next/navigation';
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import {
    RiCheckboxCircleFill,
    RiReceiptLine,
    RiCoinLine,
    RiCalendarLine,
    RiDiscountPercentLine,
    RiCheckboxCircleLine,
    RiCheckLine,
    RiArrowLeftLine,
    RiInformationLine,
    RiListCheck,
    RiTimerFlashLine
} from "@remixicon/react";
import { useGetSubscriptionPlanQuery } from "@/redux/plans/subscriptionPlansApi";
import { format } from "date-fns";

const DetailCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-surface rounded-2xl border border-status-border shadow-sm flex flex-col ${className}`}>
        <div className="flex items-center gap-2 p-4 border-b border-status-border bg-status-bg shrink-0">
            {Icon && <Icon size={20} className="text-primary-500" />}
            <h3 className="text-sm font-bold text-cell-primary uppercase tracking-wider">{title}</h3>
        </div>
        <div className="p-5 overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="min-w-max">
                {children}
            </div>
        </div>
    </div>
);

const InfoRow = ({ label, value, icon: Icon, colorClass = "text-cell-primary" }) => (
    <div className="flex items-start sm:items-center gap-3 py-3 border-b border-status-border last:border-0 group transition-colors hover:bg-page-bg/30">
        {Icon && <Icon size={18} className="text-cell-secondary mt-0.5 sm:mt-0" />}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
            <span className="text-xs sm:text-sm text-cell-secondary sm:min-w-[140px] shrink-0">{label}:</span>
            <span className={`text-sm font-semibold ${colorClass} whitespace-nowrap`} title={value}>{value}</span>
        </div>
    </div>
);

function PlanDetails() {
    const { t } = useTranslation();
    const { slug } = useParams();
    const router = useRouter();
    const { data: plan, isLoading, error } = useGetSubscriptionPlanQuery(slug);

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading plan details...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading plan.</div>;
    if (!plan) return <div className="flex justify-center items-center h-screen">Plan not found.</div>;

    return (
        <Page isTitle={false} className="w-full">
            <div className="flex flex-col gap-6 pb-10">
                {/* Header Section */}
                <div className="relative w-full mb-12 sm:mb-16">
                    <div className="w-full h-32 sm:h-40 md:h-48 rounded-3xl overflow-hidden shadow-lg">
                        <img className="w-full h-full object-cover" src="/images/profileBanner.png" alt="Banner" />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/60 to-transparent"></div>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-xl transition-all border border-white/20 text-xs font-medium"
                    >
                        <RiArrowLeftLine size={16} />
                        <span className="hidden xs:inline">{t("Back")}</span>
                    </button>

                    <div className="absolute -bottom-12 sm:-bottom-10 left-4 sm:left-12 flex items-center sm:items-end gap-4 sm:gap-6 w-[calc(100%-2rem)] sm:w-[calc(100%-6rem)] md:w-max max-w-[calc(100%-2rem)]">
                        <div className="relative h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-3xl border-4 shadow-2xl overflow-hidden bg-surface flex-shrink-0" style={{ borderColor: 'var(--bg-surface)' }}>
                            <div className="w-full h-full flex items-center justify-center bg-primary-50">
                                <RiListCheck size={40} className="text-primary-500 md:size-12" />
                            </div>
                        </div>
                        <div className="mb-2 sm:mb-6 text-white drop-shadow-lg flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pr-4">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-black whitespace-nowrap" title={plan.name}>{plan.name}</h1>
                            <p className="text-[10px] sm:text-xs md:text-sm text-cell-secondary/90 max-w-md line-clamp-1 sm:line-clamp-2 italic">{plan.description}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-6">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Plan Information Panel */}
                        <DetailCard title={t("Plan Information")} icon={RiInformationLine}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
                                <InfoRow
                                    label={t("Name")}
                                    value={plan.name}
                                    icon={RiReceiptLine}
                                />
                                <InfoRow
                                    label={t("Status")}
                                    value={plan.is_active ? t("Active") : t("Inactive")}
                                    icon={RiCheckboxCircleLine}
                                    colorClass={plan.is_active ? "text-green-600" : "text-red-500"}
                                />
                                <InfoRow
                                    label={t("Created At")}
                                    value={plan.createdAt ? format(new Date(plan.createdAt), "PPP") : "N/A"}
                                    icon={RiCalendarLine}
                                />
                            </div>
                        </DetailCard>

                        {/* Pricing Panel */}
                        <DetailCard title={t("Pricing Options")} icon={RiCoinLine}>
                            <div className="space-y-4">
                                {plan.pricing?.map((price, index) => (
                                    <div key={index} className="p-4 rounded-xl border border-status-border bg-status-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-primary-100">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 flex-shrink-0">
                                                <RiCoinLine size={24} className="sm:size-20" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-base sm:text-lg font-bold text-cell-primary flex items-baseline gap-1">
                                                    {price.price}
                                                    <span className="text-[10px] sm:text-xs font-normal text-cell-secondary whitespace-nowrap">/ {price.interval_count} {price.interval}(s)</span>
                                                </p>
                                                <p className="text-[9px] sm:text-[10px] text-cell-secondary uppercase tracking-tight font-medium opacity-70">Option #{index + 1} • {price.days_number} {t("days")}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                                            {price.discount > 0 && (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100/50 text-green-700 rounded-lg text-[10px] font-bold border border-green-200 uppercase">
                                                    <RiDiscountPercentLine size={12} />
                                                    {price.discount}% {t("OFF")}
                                                </div>
                                            )}
                                            <div className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${price.is_active ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-badge-bg text-badge-text border border-status-border'}`}>
                                                {price.is_active ? t("Active") : t("Inactive")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DetailCard>

                        {/* Features Panel */}
                        <DetailCard title={t("Features & Capabilities")} icon={RiCheckboxCircleFill}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {plan.features?.map((feature, featureIdx) => (
                                    <div key={featureIdx} className="p-4 rounded-xl border border-status-border hover:border-primary-100 transition-colors group">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 bg-primary-50 dark:bg-primary-900/20 p-1 rounded-lg text-primary-500 group-hover:scale-110 transition-transform">
                                                <RiCheckLine size={16} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-sm font-bold text-cell-primary">
                                                    {feature.feature_type?.title || feature.plan_feature?.title || "Feature"}
                                                </h4>
                                                <p className="text-xs text-cell-secondary leading-relaxed italic">
                                                    {feature.feature_type?.details || feature.plan_feature?.details || "No details provided"}
                                                </p>
                                                {feature.properties?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {feature.properties.map((prop, pIdx) => (
                                                            <div key={pIdx} className="flex items-center gap-1.5 bg-status-bg px-2 py-1 rounded-md border border-status-border">
                                                                <span className="text-[10px] text-cell-secondary font-medium uppercase tracking-tighter">{prop.key}:</span>
                                                                <span className="text-[10px] font-bold text-primary-600">{prop.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DetailCard>
                    </div>

                    {/* Sidebar Column */}
                    <div className="flex flex-col gap-6">
                        {/* Trial Details Panel */}
                        <DetailCard title={t("Free Trial Details")} icon={RiTimerFlashLine} className="border-primary-100 dark:border-primary-900/30">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-center p-6 bg-gradient-to-br from-primary-500/10 to-transparent rounded-2xl border border-primary-50 dark:border-primary-900/20">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="text-4xl font-black text-primary-600 mb-1">{plan.trial?.trial_days || 0}</div>
                                        <div className="text-xs font-bold text-primary-400 uppercase tracking-widest leading-none">{t("Trial Days")}</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <InfoRow
                                        label={t("Trial Status")}
                                        value={plan.trial?.is_active ? t("Active") : t("Inactive")}
                                        icon={RiCheckboxCircleLine}
                                        colorClass={plan.trial?.is_active ? "text-green-600" : "text-red-500"}
                                    />
                                    <p className="text-xs text-cell-secondary italic text-center px-4">
                                        {plan.trial?.is_active
                                            ? t("New subscribers will get a free trial period before being charged.")
                                            : t("Free trial is currently disabled for this plan.")}
                                    </p>
                                </div>
                            </div>
                        </DetailCard>

                        {/* Quick Actions or Summary */}
                        <div className="bg-primary-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-600/20 flex flex-col gap-4">
                            <h4 className="text-lg font-bold">{t("Need to make changes?")}</h4>
                            <p className="text-xs text-white/80 leading-relaxed">
                                {t("You can update plan details, pricing tiers, and feature configurations through the management interface.")}
                            </p>
                            <button disabled className="w-full bg-white text-primary-600 py-3 rounded-xl text-sm font-bold hover:bg-primary-50 transition-colors mt-2">
                                {t("Modify Plan Configuration")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default PlanDetails;