"use client";
import { useTranslation } from "react-i18next";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const TasksRatingChart = ({ data }) => {
    const { t } = useTranslation();
    const FALLBACK = {
        total: 0,
        records: [
            { title: t("High Rating"), value: 0, color: "#375DFB" },
            { title: t("Low Rating"), value: 0, color: "#F2AE40" },
        ],
    };
    const chartData = data && data.records ? data : FALLBACK;

    return (
        <DonutChartComponent
            title={t("Tasks Rating")}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: t("Art & Design") }]} />
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: t("Last Month") }]} />
                </div>
            }
            subtitle={t("TASKS")}
            data={chartData}
        />
    );
};

export default TasksRatingChart;
