import Table from "@/components/Tables/Table";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { RiInformationLine } from "@remixicon/react";

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

    return (
        <div className={"w-full"}>
            <div className="flex items-center gap-2 mb-2">
                <Table isTitle={true} title={t("Departments Ranking")}
                    headers={headersDeparmentsRanking} rows={rows}
                    isActions={false} />
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                    title={t("How scoring works")}
                >
                    <RiInformationLine size={20} className="text-gray-400" />
                </button>
            </div>
            {showInfo && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 text-sm">
                    <p className="font-semibold mb-2">{t("How scoring works")}</p>
                    <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                        <li>{t("scoring.rank_explanation")}</li>
                        <li>{t("scoring.rating_explanation")}</li>
                        <li>{t("scoring.head_points_explanation")}</li>
                        <li>{t("scoring.performance_explanation")}</li>
                        <li>{t("scoring.attendance_explanation")}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default DepartmentsRankingTable;
