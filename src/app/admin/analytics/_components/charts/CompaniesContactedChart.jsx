"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const CompaniesContactedChart = () => {

    const chartData = {
        total: 40,
        records: [

            {
                title: "Approached",
                value: 35,
                color: "#2D9F75"
            },
            {
                title: "Failed",
                value: 5,
                color: "#DF1C41"
            }
        ]
    };

    return (
        <DonutChartComponent
            title={"Companies Contacted"}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Employee" }]} />
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            subtitle={"COMPANIES"}
            data={chartData}
        />
    );
};

export default CompaniesContactedChart;