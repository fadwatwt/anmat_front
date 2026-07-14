"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import LineChartComponent from "@/components/containers/chart/LineChartComponent";
import { useTranslation } from "react-i18next";

const EmployeeAccomplishmentChart = ({ data = [] }) => {
    const { t } = useTranslation();
    const lines = [
        {
            type: "monotone", dataKey: t("Expected Time"), stroke: "#C2D6FF", allowReorder: "no", dot: false
        },
        {
            type: "monotone", strokeDasharray: "5 5", dataKey: t("Actual Time"), dot: "false", stroke: "#35B9E9"
        }
    ];

    return (
        <LineChartComponent
            title={t("Employee Accomplishment")}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: t("Employee") }]} />
                    <DefaultSelect options={[{ id: 1, value: t("Last Month") }]} />
                </div>
            }
            data={data}
            lines={lines}
            yaxisTitle={t("Hours")}
        />
    );
};

export default EmployeeAccomplishmentChart;
