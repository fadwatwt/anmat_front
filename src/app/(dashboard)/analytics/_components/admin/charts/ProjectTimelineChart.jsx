"use client";

import ChartSelect from "@/app/(dashboard)/analytics/_components/admin/ChartSelect";
import LineChartComponent from "@/components/containers/chart/LineChartComponent";

const ProjectTimelineChart = ({ data = [] }) => {
    // Check efficiency: ensures data is present
    const chartData = data.length > 0 ? data : [];

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
                <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <ChartSelect 
                        options={[{ id: 1, value: "Last 6 Months" }]} 
                        defaultValue="Last 6 Months"
                        className="w-full sm:w-32"
                    />
                </div>
            }
            data={chartData}
            lines={lines}
        />
    );
};

export default ProjectTimelineChart;
