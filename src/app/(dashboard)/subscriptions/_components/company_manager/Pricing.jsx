"use client"






import { RiFlashlightLine, RiCheckboxCircleFill } from "@remixicon/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Switch2 from "@/components/Form/Switch2";
import Modal from "@/components/Modal/Modal";
import StripePaymentWrapper from "@/components/stripe/StripePaymentWrapper";
import { selectUser } from "@/redux/auth/authSlice";
import { useGetSubscriberSubscriptionPlansQuery } from "@/redux/plans/subscriptionPlansApi";
import { useGetMySubscriptionQuery } from "@/redux/subscriptions/subscriptionsApi";


import { useTranslation } from "react-i18next";


function Pricing() {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const { data: plans = [], isLoading } = useGetSubscriberSubscriptionPlansQuery();
    const { data: currentSubscription } = useGetMySubscriptionQuery();
    const [billingCycle, setBillingCycle] = useState("month"); // "month" or "year"
    const [selectedPlanInfo, setSelectedPlanInfo] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const handleToggleBillingCycle = () => {
        setBillingCycle(prev => prev === "month" ? "year" : "month");
    }

    const handleSelectPlan = (plan) => {
        const pricingIndex = plan.pricing?.findIndex(p => p.interval === billingCycle && p.is_active);
        const idx = pricingIndex >= 0 ? pricingIndex : 0;
        const selectedPricing = plan.pricing?.[idx];
        if (!selectedPricing) return;
        setSelectedPlanInfo({
            plan,
            price: selectedPricing.price,
            priceId: plan.stripe_price_ids?.[idx],
            trialDays: plan.trial?.is_active ? plan.trial?.trial_days : 0,
        });
        setIsCheckoutOpen(true);
    };

    const closeCheckout = () => {
        setIsCheckoutOpen(false);
        setSelectedPlanInfo(null);
    };

    const planFeatures = (plan) => {
        if (!plan.features || plan.features.length === 0) {
            return (
                <p className="text-sm italic text-cell-secondary col-span-full">
                    {t("Standard features included")}
                </p>
            );
        }
        return plan.features.map((feature, index) => {
            const title =
                feature.plan_feature?.title ||
                feature.feature_type?.title ||
                feature.feature_type_id?.title ||
                feature.title ||
                t("Feature");
            const details =
                feature.plan_feature?.details ||
                feature.feature_type?.details ||
                feature.details ||
                "";

            return (
                <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl border border-status-border bg-status-bg hover:bg-primary-50 hover:border-primary-100 transition-colors"
                >
                    <RiCheckboxCircleFill
                        size={20}
                        className="text-primary-base shrink-0 mt-0.5"
                    />
                    <div className="flex flex-col items-start text-start gap-1 flex-1 min-w-0">
                        <span className="!text-table-title text-sm font-semibold break-words">
                            {title}
                        </span>
                        {details ? (
                            <span className="!text-cell-secondary text-xs leading-snug">
                                {details}
                            </span>
                        ) : null}
                        {feature.properties && feature.properties.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {feature.properties.map((prop, pIdx) => (
                                    <span
                                        key={pIdx}
                                        className="inline-flex items-center px-2 py-0.5 bg-surface border border-status-border rounded-md text-[11px]"
                                    >
                                        <span className="!text-cell-secondary font-medium me-1">
                                            {prop.key}:
                                        </span>
                                        <span className="!text-primary-base font-bold">
                                            {prop.value}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            );
        });
    };

    if (isLoading) return <div className="p-10 text-center">{t("Loading plans...")}</div>;

    return (
        <div className="flex flex-col items-stretch justify-start gap-6">
            <div className={"flex justify-end items-baseline"}>
                <div className={"flex *:text-sm gap-3 items-center"}>
                    <span>{t("Pay Monthly")}</span>
                    <Switch2 isOn={billingCycle === "year"} handleToggle={handleToggleBillingCycle} />
                    <span>{t("Pay Yearly")}</span>
                    <span className={"text-blue-600 bg-blue-100 p-1 rounded-lg"}>{t("Save 25%")}</span>
                </div>
            </div>

            {plans.filter(p => p.is_active).map((plan, index) => {
                const pricing = plan.pricing?.find(p => p.interval === billingCycle && p.is_active) || plan.pricing?.[0];
                const isCurrentPlan = currentSubscription?.plan_id?._id === plan._id;

                return (
                    <div key={index} className={`rounded-2xl bg-surface border ${isCurrentPlan ? 'border-primary-500 ring-2 ring-primary-100' : 'border-status-border'} flex flex-col gap-6 overflow-hidden shadow-md transition-all`}>
                        {/* Details */}
                        <div className="flex items-stretch gap-6 justify-between px-8 py-8 md:flex-row flex-col">
                            {/* Basic Info */}
                            <div className="flex flex-col items-center justify-center gap-2 md:w-4/12 w-full md:border-e md:pe-6 border-status-border">
                                <div className="rounded-full p-2 bg-primary-100">
                                    <div className="rounded-full p-2 bg-primary-200">
                                        <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                                    </div>
                                </div>
                                <span className="!text-primary-base text-md font-semibold text-center">
                                    {plan.name}
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="!text-table-title text-3xl font-bold text-center">
                                        ${pricing?.price || 0}
                                    </span>
                                    <span className="!text-cell-secondary text-sm">
                                        /{billingCycle === 'month' ? t('mth') : t('yr')}
                                    </span>
                                </div>
                                <span className="!text-cell-secondary text-sm text-center">
                                    {plan.description || t("Plan description placeholder")}
                                </span>
                            </div>

                            {/* Features */}
                            <div className="flex flex-col flex-1 gap-3">
                                <span className="!text-table-title text-sm font-semibold uppercase tracking-wide">
                                    {t("What's included")}
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {planFeatures(plan)}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-4 bg-status-bg w-full">
                            <button
                                type="button"
                                disabled={isCurrentPlan}
                                onClick={() => handleSelectPlan(plan)}
                                className={`text-md font-light w-full rounded-xl py-2 cursor-pointer transition-colors ${
                                    isCurrentPlan
                                    ? "bg-status-border !text-cell-secondary cursor-not-allowed"
                                    : "!text-white bg-primary-500 hover:bg-primary-600"
                                }`}
                            >
                                {isCurrentPlan ? t("Current Plan") : t("Upgrade / Subscribe")}
                            </button>
                        </div>
                    </div>
                );
            })}

            <Modal
                isOpen={isCheckoutOpen}
                onClose={closeCheckout}
                title={t("Secure Subscription Checkout")}
                className={"lg:w-[500px] md:w-10/12 w-11/12 p-0 overflow-hidden"}
                isHideCancel={true}
            >
                {selectedPlanInfo && (
                    <div className="p-0">
                        <div className="bg-status-bg p-6 border-b border-status-border">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="!text-primary-base text-xs font-bold uppercase tracking-wider mb-1">
                                        {t("Selected Plan")}
                                    </p>
                                    <h3 className="!text-table-title text-xl font-bold">
                                        {selectedPlanInfo.plan.name}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="!text-table-title text-2xl font-black">
                                        ${selectedPlanInfo.price}
                                    </p>
                                    <p className="!text-cell-secondary text-xs font-medium">
                                        {t("Billed recurringly")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <StripePaymentWrapper
                                amount={selectedPlanInfo.price}
                                priceId={selectedPlanInfo.priceId}
                                planId={selectedPlanInfo.plan._id}
                                trialDays={selectedPlanInfo.trialDays}
                                onFinish={closeCheckout}
                                userEmail={user?.email}
                                userName={user?.name}
                                userPhone={user?.phone}
                            />
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
}

export default Pricing;