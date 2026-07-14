"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";
import { useTranslation } from "react-i18next";

const EmployeeAttendanceChart = ({ data }) => {
    const { t } = useTranslation();
    const chartData = data && data.records ? data : {
        total: 0,
        records: [
            { title: t("Attended"), value: 0, color: "#375DFB" },
            { title: t("Absent"), value: 0, color: "#F2AE40" },
        ],
    };

    return (
        <DonutChartComponent
            title={t("Employee Attendance")}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: t("Employee") }]} />
                    <DefaultSelect options={[{ id: 1, value: t("Last Month") }]} />
                </div>
            }
            subtitle={t("DAYS")}
            data={chartData}
        />
    );
};

export default EmployeeAttendanceChart;
