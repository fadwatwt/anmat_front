"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import LineChartComponent from "@/components/containers/chart/LineChartComponent";

const ProjectTimelineChart = ({ data = [] }) => {

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
