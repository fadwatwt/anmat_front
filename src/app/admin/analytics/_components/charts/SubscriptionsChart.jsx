"use client";

import DonutChartComponent from "@/app/_components/containers/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const SubscriptionsChart = () => {

    const chartData = {
        total: 125,
        records: [

            {
                title: "Companies",
                value: 50,
                color: "#375DFB"
            },
            {
                title: "Users",
                value: 75,
                color: "#F2AE40"
            }
        ]
    };

    return (
        <DonutChartComponent
            title={"Subscriptions"}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Monthly" }]} />
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            subtitle={"SUBSCRIPTIONS"}
            data={chartData}
        />
    );
};

export default SubscriptionsChart;