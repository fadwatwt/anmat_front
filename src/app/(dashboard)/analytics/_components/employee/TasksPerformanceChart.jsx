"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import BarChartComponent from "@/components/containers/chart/BarChartComponent";

const TasksPerformanceChart = () => {

    const barGab = 4;
    const monthlyData = [
        { name: "Jan", onTime: 45, late: 35 },
        { name: "Feb", onTime: 65, late: 55 },
        { name: "Mar", onTime: 35, late: 30 },
        { name: "Apr", onTime: 60, late: 85 },
        { name: "May", onTime: 55, late: 30 },
        { name: "Jun", onTime: 50, late: 45 },
    ];
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
            title={"Tasks Performance"}
            subtitle={"Number of Tasks"}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Last 6 Months" }]} />
                </div>
            }
            barGab={barGab}
            monthlyData={monthlyData}
            bars={bars}
        />
    );
};

export default TasksPerformanceChart;