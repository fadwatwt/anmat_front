"use client";

import DonutChartComponent from "@/app/_components/containers/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const TasksSummaryChart = () => {

    const chartData = {
        total: 300,
        records: [

            {
                title: "Active",
                value: 50,
                color: "#375DFB"
            },
            {
                title: "Completed",
                value: 75,
                color: "#38C793"
            },
            {
                title: "Late-Completed",
                value: 100,
                color: "#F17B2C"
            },
            {
                title: "Overdue",
                value: 75,
                color: "#DF1C41"
            }
        ]
    };

    return (
        <DonutChartComponent
            title={"Tasks Summary"}
            toolbar={
                <div className="w-32">
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            subtitle={"TASKS"}
            data={chartData}
        />
    );
};

export default TasksSummaryChart;