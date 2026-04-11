"use client";
import { useTranslation } from "react-i18next";
import {
    RiBuilding2Line,
    RiGlobalLine,
    RiMapPinLine,
    RiHomeOfficeLine,
    RiOrganizationChart,
    RiBriefcaseLine,
    RiMailLine,
    RiPhoneLine,
    RiUserStarLine
} from "@remixicon/react";

function OrganizationCard({ organization, isLoading, onEdit }) {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="w-full bg-surface border border-status-border rounded-2xl p-6 flex flex-col gap-6 mt-12 animate-pulse">
                <div className="h-16 w-16 bg-status-bg rounded-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-4 bg-status-bg rounded w-3/4"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-surface border border-status-border rounded-2xl p-6 flex flex-col gap-6 mt-12">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-primary-500 font-bold text-2xl overflow-hidden">
                        {organization?.logo ? (
                            <img src={organization.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            organization?.name?.charAt(0).toUpperCase() || "C"
                        )}
                    </div>
                </div>
                <button 
                  onClick={onEdit}
                  className="px-4 py-2 text-sm border border-status-border rounded-lg text-cell-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {t("Edit Organization")}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                {/* Column 1 */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <RiBuilding2Line size={18} className="text-cell-secondary" />
                        <span className="text-cell-secondary text-sm">{t("Company")}:</span>
                        <span className="text-cell-primary text-sm font-medium">{organization?.name || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiGlobalLine size={18} className="text-cell-secondary" />
                        <span className="text-cell-secondary text-sm">{t("Website")}:</span>
                        <a href={organization?.website} target="_blank" rel="noopener noreferrer" className="text-cell-primary text-sm font-medium hover:underline">
                            {organization?.website || "N/A"}
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiMailLine size={18} className="text-cell-secondary" />
                        <span className="text-cell-secondary text-sm">{t("Email")}:</span>
                        <span className="text-cell-primary text-sm font-medium">{organization?.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiBriefcaseLine size={18} className="text-cell-secondary" />
                        <span className="text-cell-secondary text-sm">{t("Industry")}:</span>
                        <span className="text-cell-primary text-sm font-medium">{organization?.industry?.name || organization?.industry || "N/A"}</span>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <RiMapPinLine size={18} className="text-cell-secondary" />
                        <span className="text-cell-secondary text-sm">{t("Country")}:</span>
                        <span className="text-cell-primary text-sm font-medium">{organization?.country || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiHomeOfficeLine size={18} className="text-cell-secondary" />
                        <span className="text-cell-secondary text-sm">{t("City")}:</span>
                        <span className="text-cell-primary text-sm font-medium">{organization?.city || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiPhoneLine size={18} className="text-cell-secondary" />
                        <span className="text-cell-secondary text-sm">{t("Phone")}:</span>
                        <span className="text-cell-primary text-sm font-medium">{organization?.phone || "N/A"}</span>
                    </div>
                </div>

                {/* Column 3 */}
                {/* <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <RiOrganizationChart size={18} className="text-cell-secondary" />
                        <span className="text-cell-secondary text-sm">{t("Departments")}:</span>
                        <span className="text-cell-primary text-sm font-medium">{organization?.departments_count || "0"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RiUserStarLine size={18} className="text-cell-secondary" />
                        <span className="text-cell-secondary text-sm">{t("Positions")}:</span>
                        <span className="text-cell-primary text-sm font-medium">{organization?.positions_count || "0"}</span>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default OrganizationCard;
