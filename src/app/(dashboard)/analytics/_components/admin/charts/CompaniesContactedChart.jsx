"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import ChartSelect from "@/app/(dashboard)/analytics/_components/admin/ChartSelect";

const FALLBACK = {
    total: 0,
    records: [
        { title: "Approached", value: 0, color: "#2D9F75" },
        { title: "Failed", value: 0, color: "#DF1C41" },
    ],
};

const CompaniesContactedChart = ({ data }) => {
    // Check efficiency: ensures data is present
    const chartData = data && data.records ? data : FALLBACK;

    return (
        <DonutChartComponent
            title={"Companies Contacted"}
            toolbar={
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <ChartSelect 
                        options={[{ id: 1, value: "Employee" }]} 
                        defaultValue="Employee"
                        className="w-full sm:w-32"
                    />
                    <ChartSelect 
                        options={[{ id: 1, value: "Last Month" }]} 
                        defaultValue="Last Month"
                        className="w-full sm:w-36"
                    />
                </div>
            }
            subtitle={"COMPANIES"}
            data={chartData}
        />
    );
};

export default CompaniesContactedChart;
