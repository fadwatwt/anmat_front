import Table from "@/components/Tables/Table";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { RiInformationLine, RiCloseLine } from "@remixicon/react";

const DepartmentsRankingTable = ({ rows: rowsProp = [] }) => {
    const { t } = useTranslation();
    const [showInfo, setShowInfo] = useState(false);

    const headersDeparmentsRanking = [
        { label: t("Department"), width: "400px" },
        { label: t("Rank"), width: "" },
        { label: t("Rating"), width: "" },
        { label: t("Head Points"), width: "" },
        { label: t("Performance"), width: "" },
        { label: t("Attendance"), width: "" },
    ];

    const departmentRowTable = () => {
        return rowsProp.map((dept) => [
            <React.Fragment key={dept.rank + dept.name}>
                <div className={"flex justify-start items-center gap-2"}>
                    <div className={"flex justify-center items-center rounded-full w-9 h-9 border border-gray-400 dark:border-gray-700"}>
                        <img src="/images/Department Brands/departmentBrand1.png" alt={t("")} className={"w-6 h-6 rounded-full"} />
                    </div>
                    <div className={"flex flex-col items-start gap-1"}>
                        <p className={"text-sm dark:text-gray-200"}>{dept.name}</p>
                        <p className={"text-sm text-gray-500"}>{t("Manager:")} {dept.manager}</p>
                    </div>
                </div>
            </React.Fragment>,
            String(dept.rank),
            String(dept.rating ?? 0),
            String(dept.headPoints ?? 0),
            `${dept.performance ?? 0}%`,
            `${dept.attendance ?? 0}%`,
        ]);
    };

    const rows = departmentRowTable();

    const scoringItems = [
        { icon: "🏅", label: t("Rank"), text: t("scoring.rank_explanation") },
        { icon: "⭐", label: t("Rating"), text: t("scoring.rating_explanation") },
        { icon: "👤", label: t("Head Points"), text: t("scoring.head_points_explanation") },
        { icon: "📈", label: t("Performance"), text: t("scoring.performance_explanation") },
        { icon: "✅", label: t("Attendance"), text: t("scoring.attendance_explanation") },
    ];

    return (
        <div className={"w-full"}>
            <div className="flex items-center gap-2 mb-2">
                <Table isTitle={true} title={t("Departments Ranking")}
                    headers={headersDeparmentsRanking} rows={rows}
                    isActions={false} />
                <button
                    onClick={() => setShowInfo(true)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                    title={t("How scoring works")}
                >
                    <RiInformationLine size={20} className="text-gray-400" />
                </button>
            </div>

            {showInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowInfo(false)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("How scoring works")}</h3>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <RiCloseLine size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {scoringItems.map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{item.label}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={() => setShowInfo(false)}
                                className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                            >
                                {t("Close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DepartmentsRankingTable;
