import Table from "@/components/Tables/Table";
import { t } from "i18next";
import React from "react";

const DepartmentsRankingTable = ({ rows: rowsProp = [] }) => {

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
                        <img src="/images/Department Brands/departmentBrand1.png" alt={""} className={"w-6 h-6 rounded-full"} />
                    </div>
                    <div className={"flex flex-col items-start gap-1"}>
                        <p className={"text-sm dark:text-gray-200"}>{dept.name}</p>
                        <p className={"text-sm text-gray-500"}>Manager: {dept.manager}</p>
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
            <Table isTitle={true} title={"Departments Ranking"}
                headers={headersDeparmentsRanking} rows={rows}
                isActions={false} />
        </div>
    );
}

export default DepartmentsRankingTable;
