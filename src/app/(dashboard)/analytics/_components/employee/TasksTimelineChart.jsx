"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import LineChartComponent from "@/components/containers/chart/LineChartComponent";

const TasksTimelineChart = ({ data = [] }) => {

    const lines = [
        {
            type: "monotone", dataKey: "Expected Time", stroke: "#38C793", allowReorder: "no", dot: false
        },
        {
            type: "monotone", strokeDasharray: "5 5", dataKey: "Actual Time", dot: "false", stroke: "#35B9E9"
        }
    ];

    return (
        <LineChartComponent
            title={"Tasks Timeline"}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: "Last Months" }]} />
                </div>
            }
            data={data}
            lines={lines}
            yaxisTitle="Hours"
        />
    );
};

export default TasksTimelineChart;
