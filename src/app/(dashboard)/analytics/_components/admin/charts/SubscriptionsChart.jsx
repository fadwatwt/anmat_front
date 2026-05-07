"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import ChartSelect from "@/app/(dashboard)/analytics/_components/admin/ChartSelect";

const SubscriptionsChart = ({ totalCompanies = 0, totalUsers = 0 }) => {
    const chartData = {
        total: totalCompanies + totalUsers,
        records: [
            {
                title: "Companies",
                value: totalCompanies,
                color: "#375DFB"
            },
            {
                title: "Users",
                value: totalUsers,
                color: "#F2AE40"
            }
        ]
    };

    return (
        <DonutChartComponent
            title={"Subscriptions"}
            toolbar={
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <ChartSelect 
                        options={[{ id: 1, value: "Monthly" }]} 
                        defaultValue="Monthly"
                        className="w-full sm:w-32"
                    />
                    <ChartSelect 
                        options={[{ id: 1, value: "Last Month" }]} 
                        defaultValue="Last Month"
                        className="w-full sm:w-36"
                    />
                </div>
            }
            subtitle={"SUBSCRIPTIONS"}
            data={chartData}
        />
    );
};

export default SubscriptionsChart;