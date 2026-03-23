"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
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
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <div className="w-full sm:w-32">
                        <DefaultSelect options={[{ id: 1, value: "Monthly" }]} />
                    </div>
                    <div className="w-full sm:w-36">
                        <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                    </div>
                </div>
            }
            subtitle={"SUBSCRIPTIONS"}
            data={chartData}
        />
    );
};

export default SubscriptionsChart;