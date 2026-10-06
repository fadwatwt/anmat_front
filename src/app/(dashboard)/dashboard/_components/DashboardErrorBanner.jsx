"use client";

import PropTypes from "prop-types";
import { RiErrorWarningLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";

const DashboardErrorBanner = ({ onRetry }) => {
    const { t } = useTranslation();

    return (
        <div role="alert" className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <div className="flex items-center gap-2">
                <RiErrorWarningLine size={20} />
                <span className="text-sm font-medium">{t("Some dashboard data could not be loaded")}</span>
            </div>
            <button
                type="button"
                onClick={onRetry}
                className="self-start sm:self-auto rounded-xl border border-current px-4 py-2 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40"
            >
                {t("Try Again")}
            </button>
        </div>
    );
};

DashboardErrorBanner.propTypes = {
    onRetry: PropTypes.func.isRequired,
};

export default DashboardErrorBanner;
