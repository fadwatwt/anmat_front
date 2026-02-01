"use client";
import { useTranslation } from "react-i18next";
import {
    RiBuilding2Line,
    RiGlobalLine,
    RiBankCardLine,
    RiMapPinLine,
    RiHomeOfficeLine,
    RiOrganizationChart,
    RiBriefcaseLine
} from "@remixicon/react";

function OrganizationCard({ organization }) {
    const { t } = useTranslation();

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col gap-6 mt-12">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-primary-500 font-bold text-2xl">
                        {organization?.logo ? (
                            <img src={organization.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            "C"
                        )}
                    </div>
                </div>
                <button className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    {t("Edit Organization")}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                {/* Column 1 */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <RiBuilding2Line size={18} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">{t("Company")}:</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">{organization?.name || "Catalog"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiGlobalLine size={18} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">{t("Website")}:</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">{organization?.website || "catalogapp.io"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiBriefcaseLine size={18} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">{t("Industry")}:</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">{organization?.industry || "E-Commerce"}</span>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <RiMapPinLine size={18} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">{t("Country")}:</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">{organization?.country || "Egypt"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiHomeOfficeLine size={18} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">{t("City")}:</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">{organization?.city || "Cairo"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiMapPin2Line size={18} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">{t("Address")}:</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">{organization?.address || "45 Cairo st., Cairo, Egypt"}</span>
                    </div>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <RiOrganizationChart size={18} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">{t("Departments")}:</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">{organization?.departments || "88"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiUserStarLine size={18} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">{t("Positions")}:</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium">{organization?.positions || "88"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Importing icons needed that might not be in the top import if I missed some names
import { RiMapPin2Line, RiUserStarLine } from "@remixicon/react";

export default OrganizationCard;
