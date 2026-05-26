"use client";
import { useTranslation } from "react-i18next";

import DefaultSelect from "@/components/Form/DefaultSelect";
import BarChartComponent from "@/components/containers/chart/BarChartComponent";

const TasksPerformanceChart = ({ monthlyData = [] }) => {
    const { t } = useTranslation();

    const barGab = 4;
    const bars = [
        {
            dataKey: 'onTime',
            fill: '#38C793',
            name: t('On-Time Completed'),
            radius: [15, 15, 0, 0],
            barSize: 15
        },
        {
            dataKey: 'late',
            fill: '#F17B2C',
            name: t('Late Completed'),
            radius: [15, 15, 0, 0],
            barSize: 15
        }
    ];

    return (
        <BarChartComponent
            title={t("Tasks Performance")}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: t("Last 6 Months") }]} />
                </div>
            }
            barGab={barGab}
            monthlyData={monthlyData}
            bars={bars}
            yaxisTitle={t("Number of tasks")}
        />
    );
};

export default TasksPerformanceChart;
