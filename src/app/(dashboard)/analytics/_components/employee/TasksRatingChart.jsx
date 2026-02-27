"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const TasksRatingChart = () => {

    const chartData = {
        total: 200,
        records: [
            {
                title: "High Rating",
                value: 150,
                color: "#375DFB"
            },
            {
                title: "Low Rating",
                value: 50,
                color: "#F2AE40"
            }
        ]
    };

    return (
        <DonutChartComponent
            title={"Tasks Rating"}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: "Art & Design" }]} />
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            subtitle={"TASKS"}
            data={chartData}
        />
    );
};

export default TasksRatingChart;