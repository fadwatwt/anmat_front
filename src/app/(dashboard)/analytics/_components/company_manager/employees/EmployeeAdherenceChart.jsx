"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const FALLBACK = {
    total: 0,
    records: [
        { title: "On Time", value: 0, color: "#375DFB" },
        { title: "Late", value: 0, color: "#F2AE40" },
    ],
};

const EmployeeAdherenceChart = ({ data }) => {
    const chartData = data && data.records ? data : FALLBACK;

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
