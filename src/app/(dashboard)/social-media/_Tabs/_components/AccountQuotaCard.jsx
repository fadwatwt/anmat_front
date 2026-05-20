"use client";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ImSpinner2 } from "react-icons/im";
import { Profile2User, InfoCircle } from "iconsax-react";

function AccountQuotaCard({ used = 0, limit = 0, unlimited = false, isLoading, className = "" }) {
    const { t } = useTranslation();

    const pct = unlimited || limit <= 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
    const isFull = !unlimited && limit > 0 && used >= limit;
    const barColor = unlimited
        ? "bg-primary-500"
        : isFull
            ? "bg-red-500"
            : pct >= 80
                ? "bg-amber-500"
                : "bg-primary-500";

    return (
        <div className={`bg-surface border border-status-border rounded-2xl p-4 flex flex-col gap-3 ${className}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Profile2User size={18} className="text-primary-500" />
                    <h3 className="text-cell-primary text-sm font-semibold">
                        {t("Twitter Accounts Quota")}
                    </h3>
                </div>
                {isLoading && <ImSpinner2 className="animate-spin text-primary-500" size={16} />}
            </div>

            {isLoading ? (
                <div className="h-2 bg-status-bg rounded-full animate-pulse" />
            ) : (
                <>
                    <div className="flex justify-between items-baseline">
                        <p className="text-2xl font-bold text-cell-primary">
                            {used}
                            <span className="text-cell-secondary text-base font-normal mx-1">/</span>
                            <span className="text-cell-secondary text-base font-normal">
                                {unlimited ? "∞" : limit}
                            </span>
                        </p>
                        {isFull && (
                            <span className="text-xs text-red-500 font-medium">
                                {t("Limit reached")}
                            </span>
                        )}
                    </div>

                    <div className="w-full h-2 bg-status-bg rounded-full overflow-hidden">
                        <div
                            className={`h-full ${barColor} transition-all duration-300`}
                            style={{ width: unlimited ? "100%" : `${pct}%` }}
                        />
                    </div>

                    {isFull && (
                        <div className="flex items-start gap-2 text-xs text-cell-secondary bg-status-bg rounded-lg p-2">
                            <InfoCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            <p>
                                {t(
                                    "You have reached your account quota. Contact your administrator to increase it.",
                                )}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

AccountQuotaCard.propTypes = {
    used: PropTypes.number,
    limit: PropTypes.number,
    unlimited: PropTypes.bool,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
};

export default AccountQuotaCard;
