"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const FALLBACK = {
    total: 0,
    records: [
        { title: "Completed on time", value: 0, color: "#38C793" },
        { title: "Overdue", value: 0, color: "#DF1C41" },
    ],
};

const DepartmentPerformanceChart = ({ data }) => {
    const chartData = data && data.records ? data : FALLBACK;

    return (
        <DonutChartComponent
            title={"Department Performance"}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Department" }]} />
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            subtitle={"TASKS"}
            data={chartData}
        />
    );
};

export default DepartmentPerformanceChart;
