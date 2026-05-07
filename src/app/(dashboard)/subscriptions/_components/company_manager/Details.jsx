"use client"
import { useTranslation } from "react-i18next";
import { RiVipDiamondLine } from "react-icons/ri";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import { useGetMySubscriptionQuery } from "@/redux/subscriptions/subscriptionsApi";
import { format } from "date-fns";

function Details({ onUpgradeClick }) {
    const { t } = useTranslation();
    const { data: subscription, isLoading, error } = useGetMySubscriptionQuery();

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
                            <RiVipDiamondLine size={25} className="rounded-full text-primary-500 stroke-[2px] border-2 border-primary-500 p-1" />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1">
                        <span className="!text-cell-secondary text-md">
                            {t("You're subscribed on")}
                        </span>
                        <span className="!text-primary-base text-lg font-bold">
                            {plan.name || t("Unknown Plan")}
                        </span>
                    </div>
                </div>

                {/* info */}
                <div className="flex items-start gap-8 justify-between w-full flex-wrap">
                    <div className="flex flex-col items-start justify-start gap-0 min-w-[12rem]">
                        <span className="!text-cell-secondary text-sm">
                            {t("Users")}
                        </span>
                        <span className="!text-table-title text-sm font-bold">
                            {subscription.usage?.employees || 0} {t("of")} {userLimit} {t("Users")}
                        </span>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-0 min-w-[12rem]">
                        <span className="!text-cell-secondary text-sm">
                            {t("Storage Limit")}
                        </span>
                        <span className="!text-table-title text-sm font-bold">
                            {storageLabel}
                        </span>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-0 min-w-[12rem]">
                        <span className="!text-cell-secondary text-sm">
                            {t("Subscription end date")}
                        </span>
                        <span className="!text-table-title text-sm font-bold">
                            {subscription.expires_at ? format(new Date(subscription.expires_at), "MMMM dd, yyyy") : t("N/A")}
                        </span>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-0 min-w-[12rem]">
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
                    <button
                        type="button"
                        className="text-sm bg-surface !text-red-600 px-4 py-2 w-96 rounded-lg hover:bg-status-bg transition-colors border border-status-border"
                    >
                        {t("Cancel subscription renewal")}
                    </button>
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
                isOpen={false}
                onClose={() => {}}
                type="cancel"
                title="Cancel Renewal Confirmation"
                confirmBtnText="Yes, Stop"
                description={
                    <p>
                        Are you sure you want to <span className="font-bold text-black">cancel renewal</span> of the
                        <span className="font-bold text-black"> {plan.name}</span> with <span className="font-bold text-black">${price}/mth</span>?
                    </p>
                }
                onSubmit={() => {}}
            />
        </div>
    );
}

export default Details;