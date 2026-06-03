"use client"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiVipDiamondLine } from "react-icons/ri";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import { useGetMySubscriptionQuery, useCancelRenewalMutation, useReactivateRenewalMutation } from "@/redux/subscriptions/subscriptionsApi";
import { format } from "date-fns";
import toast from "react-hot-toast";

function Details({ onUpgradeClick }) {
    const { t } = useTranslation();
    const { data: subscription, isLoading, error } = useGetMySubscriptionQuery();
    const [cancelRenewal, { isLoading: isCancelling }] = useCancelRenewalMutation();
    const [reactivateRenewal, { isLoading: isReactivating }] = useReactivateRenewalMutation();
    const [showCancelAlert, setShowCancelAlert] = useState(false);
    const [showReactivateAlert, setShowReactivateAlert] = useState(false);

    if (isLoading) return <div className="p-5 text-center">{t("Loading...")}</div>;
    if (error) return <div className="p-5 text-center text-red-500">{t("Error loading subscription details")}</div>;
    if (!subscription) return <div className="p-5 text-center">{t("No active subscription found")}</div>;

    const plan = subscription.plan_id || {};
    
    // Find user limit feature — actual DB key: 'max_emp_num', feature type ID: 69d3ce73f265322590686460
    const EMPLOYEE_FEATURE_ID = '69d3ce73f265322590686460';
    const STORAGE_FEATURE_ID  = '69d3ce18f265322590686458';

    const userLimitFeature = plan.features?.find(f => {
        const ftId = f.feature_type_id?._id?.toString() || f.feature_type_id?.toString() || '';
        const ftType = (f.feature_type_id?.type || '').toLowerCase();
        const ftTitle = (f.feature_type_id?.title || '').toLowerCase();
        return ftId === EMPLOYEE_FEATURE_ID ||
               ftType.includes('user') || ftType.includes('employee') ||
               ftTitle.includes('user') || ftTitle.includes('employee');
    });
    const EMPLOYEE_KEYS = ['max_emp_num', 'limit', 'max', 'count', 'max_employees', 'users_limit'];
    const userLimitProp = userLimitFeature?.properties?.find(p => EMPLOYEE_KEYS.includes(p.key));
    const userLimit = userLimitProp?.value ?? 'Unlimited';

    // Find storage feature — actual DB key: 'size' (in MB), feature type ID: 69d3ce18f265322590686458
    const storageFeature = plan.features?.find(f => {
        const ftId = f.feature_type_id?._id?.toString() || f.feature_type_id?.toString() || '';
        const ftType = (f.feature_type_id?.type || '').toLowerCase();
        const ftTitle = (f.feature_type_id?.title || '').toLowerCase();
        return ftId === STORAGE_FEATURE_ID || ftType.includes('storage') || ftTitle.includes('storage');
    });
    const storageSizeMB = storageFeature?.properties?.find(p => ['size', 'limit', 'max', 'value'].includes(p.key))?.value;
    const storageLabel = storageSizeMB != null
        ? storageSizeMB >= 1024 ? `${(storageSizeMB / 1024).toFixed(1)} GB` : `${storageSizeMB} MB`
        : 'Unlimited';

    // Find price (using first active pricing as fallback)
    const activePricing = plan.pricing?.find(p => p.is_active) || plan.pricing?.[0];
    const price = activePricing?.price || 0;

    return (
        <div className={"md:p-5 p-2 rounded-2xl bg-surface border border-status-border"}>
            <div className="flex flex-col gap-8 w-full">
                {/* header */}
                <div className="flex items-start gap-2 w-full">
                    <div className="rounded-full p-2 bg-primary-100">
                        <div className="rounded-full p-3 bg-primary-200">
                            <RiVipDiamondLine size={25} className="rounded-full text-primary-500 dark:text-primary-400 stroke-[2px] border-2 border-primary-500 p-1" />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1">
                        <span className="!text-cell-secondary text-md">
                            {t("You're subscribed on")}
                        </span>
                        <span className="!text-primary-base dark:!text-primary-200 text-lg font-bold">
                            {plan.name || t("Unknown Plan")}
                        </span>
                    </div>
                </div>

                {/* info */}
                <div className="flex items-start gap-8 justify-between w-full flex-wrap">
                    <div className="flex flex-col items-start justify-start gap-0 min-w-0 sm:min-w-[12rem]">
                        <span className="!text-cell-secondary text-sm">
                            {t("Users")}
                        </span>
                        <span className="!text-table-title text-sm font-bold">
                            {subscription.usage?.employees || 0} {t("of")} {userLimit} {t("Users")}
                        </span>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-0 min-w-0 sm:min-w-[12rem]">
                        <span className="!text-cell-secondary text-sm">
                            {t("Storage Limit")}
                        </span>
                        <span className="!text-table-title text-sm font-bold">
                            {storageLabel}
                        </span>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-0 min-w-0 sm:min-w-[12rem]">
                        <span className="!text-cell-secondary text-sm">
                            {t("Subscription end date")}
                        </span>
                        <span className="!text-table-title text-sm font-bold">
                            {subscription.expires_at ? format(new Date(subscription.expires_at), "MMMM dd, yyyy") : t("N/A")}
                        </span>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-0 min-w-0 sm:min-w-[12rem]">
                        <span className="!text-cell-secondary text-sm">
                            {t("Price estimate")}
                        </span>
                        <span className="!text-table-title text-lg font-bold">
                            ${price}
                        </span>
                    </div>
                </div>


                {/* actions */}
                <div className="flex items-start justify-center gap-4">
                    {subscription.auto_renew ? (
                        <button
                            type="button"
                            onClick={() => setShowCancelAlert(true)}
                            disabled={isCancelling}
                            className="text-sm bg-surface !text-red-600 px-4 py-2 w-96 rounded-lg hover:bg-status-bg transition-colors border border-status-border disabled:opacity-50"
                        >
                            {isCancelling ? t("Cancelling...") : t("Cancel subscription renewal")}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowReactivateAlert(true)}
                            disabled={isReactivating}
                            className="text-sm bg-surface !text-green-600 px-4 py-2 w-96 rounded-lg hover:bg-green-50 transition-colors border border-green-200 disabled:opacity-50"
                        >
                            {isReactivating ? t("Reactivating...") : t("Reactivate subscription renewal")}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onUpgradeClick}
                        className="text-sm bg-primary-100 !text-primary-base px-4 py-2 w-96 rounded-lg hover:bg-primary-base hover:!text-white transition-colors"
                    >
                        {t("Upgrade")}
                    </button>
                </div>
            </div>

            <CheckAlert
                isOpen={showCancelAlert}
                onClose={() => setShowCancelAlert(false)}
                type="cancel"
                title={t("Cancel Renewal Confirmation")}
                confirmBtnText={t("Yes, Stop")}
                description={
                    <p>
                        {t("Are you sure you want to")} <span className="font-bold text-black dark:text-gray-100">{t("cancel renewal")}</span> {t("of the")}
                        <span className="font-bold text-black dark:text-gray-100"> {plan.name}</span> {t("with")} <span className="font-bold text-black dark:text-gray-100">${price}/mth</span>?
                    </p>
                }
                onSubmit={async () => {
                    try {
                        await cancelRenewal(subscription._id).unwrap();
                        toast.success(t("Subscription renewal cancelled successfully"));
                        setShowCancelAlert(false);
                    } catch (err) {
                        toast.error(err?.data?.message || t("Failed to cancel renewal"));
                    }
                }}
            />

            <CheckAlert
                isOpen={showReactivateAlert}
                onClose={() => setShowReactivateAlert(false)}
                type="confirm"
                title={t("Reactivate Renewal Confirmation")}
                confirmBtnText={t("Yes, Reactivate")}
                description={
                    <p>
                        {t("Do you want to")} <span className="font-bold text-black dark:text-gray-100">{t("reactivate renewal")}</span> {t("for")}
                        <span className="font-bold text-black dark:text-gray-100"> {plan.name}</span>?
                    </p>
                }
                onSubmit={async () => {
                    try {
                        await reactivateRenewal(subscription._id).unwrap();
                        toast.success(t("Subscription renewal reactivated successfully"));
                        setShowReactivateAlert(false);
                    } catch (err) {
                        toast.error(err?.data?.message || t("Failed to reactivate renewal"));
                    }
                }}
            />
        </div>
    );
}

export default Details;