"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import BarChartComponent from "@/components/containers/chart/BarChartComponent";

import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";

const DepartmentsAnalytics = () => {
    const { data: departments = [], isLoading } = useGetDepartmentsQuery();

    const barGab = 4;

    const chartData = departments.map(dept => ({
        name: dept.name,
        rate: parseFloat(((dept.rate || 0) * 5).toFixed(2))
    }));

    const bars = [
        {
            dataKey: 'rate',
            fill: '#375DFB',
            name: 'Department Rating',
            radius: [15, 15, 0, 0],
            barSize: 30
        }
    ];

    return (
        <BarChartComponent
            title={"Departments Analytics"}
            toolbar={
                <div className="w-64 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect
                        classNameContainer={"w-28"}
                        options={[{ id: "", value: "Department" }]}
                    />
                    <DefaultSelect
                        classNameContainer={"w-32"}
                        options={[{ id: "", value: "Last 6 months" }]}
                    />
                </div>
            }
            barGab={barGab}
            monthlyData={chartData}
            bars={bars}
            yaxisTitle="Rating"
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
        />
    );
};

export default DepartmentsAnalytics;