"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const EmployeeAdherenceChart = () => {

    const chartData = {
        total: 30,
        records: [
            {
                title: "On Time",
                value: 20,
                color: "#375DFB"
            },
            {
                title: "Late",
                value: 10,
                color: "#F2AE40"
            }
        ]
    };

    return (
        <DonutChartComponent
            title={"Employee Adherence"}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Employee" }]} />
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            subtitle={"DAYS"}
            data={chartData}
        />
    );
};

export default EmployeeAdherenceChart;