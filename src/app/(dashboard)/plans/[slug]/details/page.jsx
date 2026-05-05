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
    RiTimerFlashLine,
    RiHistoryLine,
    RiHashtag
} from "@remixicon/react";
import { useGetSubscriptionPlanQuery, useGetSubscriptionPlanHistoryQuery } from "@/redux/plans/subscriptionPlansApi";
import { format } from "date-fns";
import ContentCard from "@/components/containers/ContentCard";
import Table from "@/components/Tables/Table.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";

const InfoRow = ({ label, value, icon: Icon, colorClass = "text-cell-primary" }) => (
    <div className="flex items-center gap-2 py-1">
        {Icon && <Icon size={16} className="text-cell-secondary shrink-0" />}
        <span className="text-xs text-cell-secondary shrink-0">{label}:</span>
        <span className={`text-xs font-medium ${colorClass} truncate`} title={value}>{value}</span>
    </div>
);

function PlanDetails() {
    const { t, i18n } = useTranslation();
    const { slug } = useParams();
    const router = useRouter();
    const { data: plan, isLoading, error } = useGetSubscriptionPlanQuery(slug);
    const { data: history, isLoading: isLoadingHistory } = useGetSubscriptionPlanHistoryQuery(slug);

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading plan details...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading plan.</div>;
    if (!plan) return <div className="flex justify-center items-center h-screen">Plan not found.</div>;

    const historyRows = history?.map(h => [
        <div key={h._id} className="flex items-center gap-2 font-bold text-primary-600 text-sm">
            <RiHashtag size={16} />
            {h.version}
        </div>,
        <span key={`date-${h._id}`} className="text-sm text-cell-primary">
            {format(new Date(h.createdAt), "MMM dd, yyyy HH:mm")}
        </span>,
        <div key={`pricing-${h._id}`} className="flex flex-col gap-1.5">
            {h.pricing?.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cell-primary">{p.price}</span>
                    <span className="text-xs text-cell-secondary">/ {p.interval}</span>
                </div>
            ))}
        </div>,
        <div key={`features-${h._id}`} className="flex flex-col gap-2 py-1">
            {h.features?.map((f, idx) => (
                <div key={idx} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-primary-400"></div>
                        <span className="text-sm font-medium text-cell-primary">
                            {f.feature_type?.title || f.plan_feature?.title}
                        </span>
                    </div>
                    {f.properties?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 ml-3">
                            {f.properties.map((prop, pIdx) => (
                                <span key={pIdx} className="text-[11px] bg-status-bg px-1.5 py-0.5 rounded border border-status-border text-cell-secondary">
                                    <span className="opacity-70">{prop.key}:</span>
                                    <span className="font-bold text-primary-600 ml-1">{prop.value}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>,
        <div key={`subscribers-${h._id}`} className="flex items-center gap-2 font-bold text-green-600 text-sm">
            <RiCheckboxCircleFill size={16} />
            {h.active_subscribers_count || 0}
        </div>
    ]) || [];

    return (
        <Page isTitle={false} className={"w-full"}>
            <div className={"w-full flex flex-col items-center md:gap-6 xl:gap-4 gap-8 h-full"}>
                {/* Banner & Header Card */}
                <div className={"relative flex min-h-48 justify-center w-full h-full md:mb-0 mb-44"}>
                    <div className={"w-full md:h-40 h-[20vh]"}>
                        <img className={"max-w-full w-full max-h-full object-cover rounded-xl"} src={"/images/profileBanner.png"} alt={""} />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/40 to-transparent rounded-xl"></div>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-xl transition-all border border-white/20 text-xs font-medium"
                    >
                        <RiArrowLeftLine size={16} />
                        <span>{t("Back")}</span>
                    </button>

                    <div className={"absolute md:top-1/3 top-[50px] w-full md:px-10 px-2"}>
                        <div className={" rounded-2xl p-4 border border-status-border flex bg-surface shadow-xl"}>
                            <div className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-6 flex-1"}>
                                <div className={"flex justify-between items-center"}>
                                    <div className={"relative h-[72px] w-[72px]"}>
                                        <div className="rounded-full h-[72px] w-[72px] flex items-center justify-center bg-primary-50 border-2 border-primary-500 text-primary-500 shadow-inner">
                                            <RiListCheck size={36} />
                                        </div>
                                        {plan.is_active && (
                                            <RiCheckboxCircleFill size="23" className="absolute top-0 right-0 bg-surface rounded-full text-cyan-500 shadow-sm" />
                                        )}
                                    </div>
                                </div>
                                <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                    <div className={`flex flex-col gap-3 flex-1 border-status-border ${i18n.language === "ar" ? "md:border-l-2 " : "md:border-r-2 "}`}>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-cell-secondary">{t("Plan Name")}</span>
                                            <h1 className="text-lg font-black text-cell-primary">{plan.name}</h1>
                                        </div>
                                        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-1">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-cell-secondary tracking-tight">{t("Version")}</span>
                                                <div className="flex items-center gap-1 font-bold text-primary-600">
                                                    <RiHashtag size={14} className="opacity-70" />
                                                    <span className="text-sm">{plan.version || 1}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-cell-secondary tracking-tight">{t("Active Subscribers")}</span>
                                                <div className="flex items-center gap-1 font-bold text-green-600">
                                                    <RiCheckboxCircleFill size={14} className="opacity-70" />
                                                    <span className="text-sm">{plan.active_subscribers_count || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col gap-2 flex-1 justify-center"}>
                                        <InfoRow
                                            label={t("Status")}
                                            value={plan.is_active ? t("Active") : t("Inactive")}
                                            icon={RiCheckboxCircleLine}
                                            colorClass={plan.is_active ? "text-green-600" : "text-red-500"}
                                        />
                                        <InfoRow
                                            label={t("Created At")}
                                            value={plan.createdAt ? format(new Date(plan.createdAt), "MMM dd, yyyy") : "N/A"}
                                            icon={RiCalendarLine}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="px-4 py-2 bg-status-bg rounded-xl border border-status-border flex flex-col items-center">
                                        <span className="text-[10px] uppercase font-bold text-cell-secondary tracking-widest">{t("Trial")}</span>
                                        <span className={`text-sm font-black ${plan.trial?.is_active ? 'text-primary-base' : 'text-cell-secondary opacity-50'}`}>
                                            {plan.trial?.trial_days || 0} {t("Days")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Content */}
                <div className={"grid grid-cols-12 gap-6 md:px-10 px-2 w-full mt-4"}>
                    {/* Description & Pricing (Left 8) */}
                    <div className={"col-span-12 lg:col-span-8 flex flex-col gap-6"}>
                        <div className={"bg-surface rounded-2xl p-6 border border-status-border shadow-sm"}>
                            <h2 className="text-sm font-bold text-cell-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                <RiInformationLine size={18} className="text-primary-500" />
                                {t("Plan Description")}
                            </h2>
                            <p className="text-sm text-cell-secondary leading-relaxed italic">
                                {plan.description || t("No description provided for this plan.")}
                            </p>
                        </div>

                        <div className={"bg-surface rounded-2xl p-6 border border-status-border shadow-sm"}>
                            <h2 className="text-sm font-bold text-cell-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                <RiCoinLine size={18} className="text-primary-500" />
                                {t("Pricing Options")}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {plan.pricing?.map((price, index) => (
                                    <div key={index} className="p-4 rounded-xl border border-status-border bg-status-bg/50 hover:bg-status-bg transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                                <RiCoinLine size={20} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-cell-primary leading-none">
                                                    {price.price}
                                                    <span className="text-[10px] font-normal text-cell-secondary ml-1">/ {price.interval}</span>
                                                </p>
                                                <p className="text-[9px] text-cell-secondary uppercase font-bold opacity-60 mt-1">{price.interval_count} {price.interval}(s)</p>
                                            </div>
                                        </div>
                                        <Status type={price.is_active ? "active" : "in-active"} title={price.is_active ? t("Active") : t("Inactive")} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Features (Right 4) */}
                    <div className={"col-span-12 lg:col-span-4"}>
                        <ContentCard
                            title={t("Features & Capabilities")}
                            icon={<RiCheckboxCircleFill size={18} className="text-primary-500" />}
                            main={
                                <div className="flex flex-col gap-4">
                                    {plan.features?.map((feature, featureIdx) => (
                                        <div key={featureIdx} className="flex flex-col gap-1 pb-3 border-b border-status-border last:border-0">
                                            <div className="flex items-center gap-2">
                                                <RiCheckLine size={14} className="text-green-500 shadow-sm rounded-full bg-green-50" />
                                                <h4 className="text-xs font-bold text-cell-primary">
                                                    {feature.feature_type?.title || feature.plan_feature?.title || "Feature"}
                                                </h4>
                                            </div>
                                            {feature.properties?.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-1 ml-5">
                                                    {feature.properties.map((prop, pIdx) => (
                                                        <div key={pIdx} className="bg-status-bg px-2 py-0.5 rounded text-[9px] border border-status-border flex gap-1">
                                                            <span className="text-cell-secondary uppercase tracking-tighter opacity-70">{prop.key}:</span>
                                                            <span className="font-bold text-primary-600">{prop.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {(!plan.features || plan.features.length === 0) && (
                                        <p className="text-xs text-cell-secondary italic text-center py-4">{t("No features defined.")}</p>
                                    )}
                                </div>
                            }
                        />
                    </div>

                    {/* History Section (Full 12) */}
                    <div className={"col-span-12 mt-6"}>
                        <div className={"bg-surface rounded-2xl p-6 border border-status-border shadow-sm flex flex-col gap-6"}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-black text-cell-primary flex items-center gap-2">
                                    <RiHistoryLine size={24} className="text-primary-500" />
                                    {t("Plan Modification History")}
                                </h2>
                                <p className="text-xs text-cell-secondary italic">*{t("Archived snapshots for financial rights preservation")}</p>
                            </div>
                            <div className="w-full">
                                <Table
                                    classContainer={"max-w-full"}
                                    headers={[
                                        { label: t("Ver"), width: "8%" },
                                        { label: t("Archived At"), width: "20%" },
                                        { label: t("Pricing Snapshot"), width: "25%" },
                                        { label: t("Features Snapshot"), width: "35%" },
                                        { label: t("Subscribers"), width: "12%" }
                                    ]}
                                    rows={historyRows}
                                    isActions={false}
                                    isCheckInput={false}
                                    isTitle={false}
                                    isLoading={isLoadingHistory}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default PlanDetails;