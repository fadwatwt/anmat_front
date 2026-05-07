"use client";

import ChartSelect from "@/app/(dashboard)/analytics/_components/admin/ChartSelect";
import BarChartComponent from "@/components/containers/chart/BarChartComponent";

const ProjectsPerformanceChart = ({ monthlyData = [] }) => {
    // Check efficiency: ensures data is present
    const chartData = monthlyData.length > 0 ? monthlyData : [];

    const barGab = 4;
    const bars = [
        {
            dataKey: 'onTime',
            fill: '#38C793',
            name: 'On-Time Completed',
            radius: [15, 15, 0, 0],
            barSize: 15
        },
        {
            dataKey: 'late',
            fill: '#F17B2C',
            name: 'Late Completed',
            radius: [15, 15, 0, 0],
            barSize: 15
        }
    ];

    return (
        <BarChartComponent
            title={"Projects Performance"}
            toolbar={
                <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <ChartSelect 
                        options={[{ id: 1, value: "Last 6 Months" }]} 
                        defaultValue="Last 6 Months"
                        className="w-full sm:w-32"
                    />
                </div>
            }
            barGab={barGab}
            monthlyData={monthlyData}
            bars={bars}
        />
    );
};

export default ProjectsPerformanceChart;
