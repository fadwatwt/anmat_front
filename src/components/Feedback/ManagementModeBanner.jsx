"use client";

import PropTypes from "prop-types";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { RiShieldUserLine, RiArrowRightSLine } from "@remixicon/react";

/**
 * Banner shown on admin/HR pages to make it obvious the user is in
 * "management mode" rather than viewing their own personal data.
 * The link back lets an Employee with admin permissions return to
 * their personal route quickly.
 */
function ManagementModeBanner({ scope, backHref, backLabel }) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100">
            <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                    <RiShieldUserLine size={18} />
                </span>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                        {t("Management Mode")}
                    </span>
                    <span className="text-xs opacity-80">
                        {scope === "track_department"
                            ? t("You are viewing data for your department.")
                            : t("You are viewing data for the entire organization.")}
                    </span>
                </div>
            </div>
            {backHref && (
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-white/60 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white dark:border-amber-700 dark:bg-amber-900/40 dark:hover:bg-amber-900/60"
                >
                    {backLabel || t("Back to my view")}
                    <RiArrowRightSLine size={14} />
                </Link>
            )}
        </div>
    );
}

ManagementModeBanner.propTypes = {
    scope: PropTypes.oneOf(["track_all", "track_department"]),
    backHref: PropTypes.string,
    backLabel: PropTypes.string,
};

ManagementModeBanner.defaultProps = {
    scope: "track_all",
    backHref: null,
    backLabel: null,
};

export default ManagementModeBanner;
