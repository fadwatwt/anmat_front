"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import LineChartComponent from "@/components/containers/chart/LineChartComponent";

const ProjectTimelineChart = () => {

    const data = [
        { name: '', "Expected Time": 1, "Actual Time": 3 },
        { name: '', "Expected Time": 4, "Actual Time": 2 },
        { name: '', "Expected Time": 6, "Actual Time": 5 },
        { name: '', "Expected Time": 8, "Actual Time": 7 },
        { name: '', "Expected Time": 10, "Actual Time": 12 },
        { name: '', "Expected Time": 5, "Actual Time": 9 },
        { name: '', "Expected Time": 3, "Actual Time": 10 },
        { name: '', "Expected Time": 7, "Actual Time": 11 },
        { name: '', "Expected Time": 12, "Actual Time": 8 },
        { name: '', "Expected Time": 15, "Actual Time": 10 }
    ];
    const lines = [
        {
            type: "monotone", dataKey: "Expected Time", stroke: "#C2D6FF", allowReorder: "no", dot: false
        },
        {
            type: "monotone", strokeDasharray: "5 5", dataKey: "Actual Time", dot: "false", stroke: "#38C793"
        }
    ];

    return (
        <LineChartComponent
            title={"Project Timeline"}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: "Last 6 Months" }]} />
                </div>
            }
            data={data}
            lines={lines}
            yaxisTitle="Hours"
        />
    );
};

export default ProjectTimelineChart;