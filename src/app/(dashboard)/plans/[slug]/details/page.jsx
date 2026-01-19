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
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden ${className}`}>
        <div className="flex items-center gap-2 p-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
            {Icon && <Icon size={20} className="text-primary-500" />}
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="p-5">
            {children}
        </div>
    </div>
);

const InfoRow = ({ label, value, icon: Icon, colorClass = "text-gray-900 dark:text-gray-100" }) => (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
        {Icon && <Icon size={18} className="text-gray-400" />}
        <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[140px]">{label}:</span>
        <span className={`text-sm font-medium ${colorClass}`}>{value}</span>
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
                <div className="relative w-full">
                    <div className="w-full h-32 md:h-44 rounded-3xl overflow-hidden shadow-lg">
                        <img className="w-full h-full object-cover" src="/images/profileBanner.png" alt="Banner" />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/40 to-transparent"></div>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1.5 rounded-xl transition-all border border-white/30 text-xs font-medium"
                    >
                        <RiArrowLeftLine size={16} />
                        {t("Back to Plans")}
                    </button>

                    <div className="absolute -bottom-10 left-6 md:left-12 flex items-end gap-6">
                        <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-3xl border-4 border-white dark:border-gray-900 shadow-xl overflow-hidden bg-white">
                            <div className="w-full h-full flex items-center justify-center bg-primary-50">
                                <RiListCheck size={48} className="text-primary-500" />
                            </div>
                        </div>
                        <div className="mb-10 text-white drop-shadow-md">
                            <h1 className="text-2xl md:text-3xl font-bold">{plan.name}</h1>
                            <p className="text-sm text-white/90 max-w-md line-clamp-2">{plan.description}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-6">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Plan Information Panel */}
                        <DetailCard title={t("Plan Information")} icon={RiInformationLine}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
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
                                    <div key={index} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                                                <RiCoinLine size={20} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                    {price.price} <span className="text-xs font-normal text-gray-500 truncate">per {price.interval_count} {price.interval}(s)</span>
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Option #{index + 1} - {price.days_number} days</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            {price.discount > 0 && (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                                                    <RiDiscountPercentLine size={14} />
                                                    {price.discount}% OFF
                                                </div>
                                            )}
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${price.is_active ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                                {price.is_active ? t("Active") : t("Inactive")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DetailCard>

                        {/* Features Panel */}
                        <DetailCard title={t("Features & Capabilities")} icon={RiCheckboxCircleFill}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {plan.features?.map((feature, featureIdx) => (
                                    <div key={featureIdx} className="p-4 rounded-xl border border-gray-50 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-900/30 transition-colors group">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 bg-primary-50 dark:bg-primary-900/20 p-1 rounded-lg text-primary-500 group-hover:scale-110 transition-transform">
                                                <RiCheckLine size={16} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                                                    {feature.feature_type?.title || feature.plan_feature?.title || "Feature"}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
                                                    {feature.feature_type?.details || feature.plan_feature?.details || "No details provided"}
                                                </p>
                                                {feature.properties?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {feature.properties.map((prop, pIdx) => (
                                                            <div key={pIdx} className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600">
                                                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{prop.key}:</span>
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
                                    <p className="text-xs text-gray-400 italic text-center px-4">
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