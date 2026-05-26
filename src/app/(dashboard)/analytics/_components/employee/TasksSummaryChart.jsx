"use client";
import { useTranslation } from "react-i18next";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const TasksSummaryChart = ({ data }) => {
    const { t } = useTranslation();

    const defaultChartData = {
        total: 0,
        records: []
    };

    const displayData = data || defaultChartData;

    return (
        <DonutChartComponent
            title={t("Tasks Summary")}
            toolbar={
                <div className="w-32">
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: t("Last Month") }]} />
                </div>
            }
            subtitle={t("TASKS")}
            data={displayData}
        />
    );
};

export default TasksSummaryChart;