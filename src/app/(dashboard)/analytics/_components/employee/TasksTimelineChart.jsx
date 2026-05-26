"use client";
import { useTranslation } from "react-i18next";

import DefaultSelect from "@/components/Form/DefaultSelect";
import LineChartComponent from "@/components/containers/chart/LineChartComponent";

const TasksTimelineChart = ({ data = [] }) => {
    const { t } = useTranslation();

    const lines = [
        {
            type: "monotone", dataKey: "Expected Time", stroke: "#38C793", allowReorder: "no", dot: false, name: t("Expected Time")
        },
        {
            type: "monotone", strokeDasharray: "5 5", dataKey: "Actual Time", dot: "false", stroke: "#35B9E9", name: t("Actual Time")
        }
    ];

    return (
        <LineChartComponent
            title={t("Tasks Timeline")}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: t("Last Months") }]} />
                </div>
            }
            data={data}
            lines={lines}
            yaxisTitle={t("Hours")}
        />
    );
};

export default TasksTimelineChart;
