import Table from "@/components/Tables/Table";
import { t } from "i18next";
import React from "react";

const DepartmentsRankingTable = () => {

    const headersDeparmentsRanking = [
        { label: t("Department"), width: "400px" },
        { label: t("Rank"), width: "" },
        { label: t("Rating"), width: "" },
        { label: t("Head Points"), width: "" },
        { label: t("Performance"), width: "" },
        { label: t("Attendance"), width: "" },
    ];

    const departments = [1, 2, 3, 4]

    const departmentRowTable = () => {
        return departments.map((department) => [
            <React.Fragment key={department}>
                <div className={"flex justify-start items-center gap-2"}>
                    <div className={"flex justify-center items-center rounded-full w-9 h-9 border border-gray-400 dark:border-gray-700"}>
                        <img src="/images/Department Brands/departmentBrand1.png" alt={""} className={"w-6 h-6 rounded-full"} />
                    </div>
                    <div className={"flex flex-col items-start gap-1"}>
                        <p className={"text-sm dark:text-gray-200"}>Design</p>
                        <p className={"text-sm text-gray-500"}>Manager: Ahmed Ali</p>
                    </div>
                </div>
            </React.Fragment>,
            "1",
            "3.5",
            "4",
            "95%",
            "100%"
        ]);
    };

    const rows = departmentRowTable()

    return (
        <div className={"w-full"}>
            <Table isTitle={true} title={"Departments Ranking"}
                headers={headersDeparmentsRanking} rows={rows}
                isActions={false} />
        </div>
    );
}

export default DepartmentsRankingTable;