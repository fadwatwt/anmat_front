"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const IndustriesChart = () => {

    const chartData = {
        total: 300,
        records: [

            {
                title: "Fintech",
                value: 50,
                color: "#375DFB"
            },
            {
                title: "E-Commerce",
                value: 75,
                color: "#38C793"
            },
            {
                title: "Ride-Sharing",
                value: 100,
                color: "#F17B2C"
            },
            {
                title: "Marketing Agencies",
                value: 75,
                color: "#DF1C41"
            }
        ]
    };

    return (
        <DonutChartComponent
            title={"Industries"}
            toolbar={
                <div className="w-32">
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            subtitle={"COMPANIES"}
            data={chartData}
        />
    );
};

export default IndustriesChart;