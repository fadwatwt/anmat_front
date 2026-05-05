"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const FALLBACK = {
    total: 0,
    records: [
        { title: "Approached", value: 0, color: "#2D9F75" },
        { title: "Failed", value: 0, color: "#DF1C41" },
    ],
};

const CompaniesContactedChart = ({ data }) => {
    const chartData = data && data.records ? data : FALLBACK;

    return (
        <DonutChartComponent
            title={"Companies Contacted"}
            toolbar={
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <div className="w-full sm:w-32">
                        <DefaultSelect options={[{ id: 1, value: "Employee" }]} />
                    </div>
                    <div className="w-full sm:w-36">
                        <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                    </div>
                </div>
            }
            subtitle={"COMPANIES"}
            data={chartData}
        />
    );
};

export default CompaniesContactedChart;
