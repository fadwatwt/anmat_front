"use client";
import { useTranslation } from "react-i18next";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import ChartSelect from "@/app/(dashboard)/analytics/_components/admin/ChartSelect";

const SubscriptionsChart = ({ totalCompanies = 0, totalUsers = 0 }) => {
    const { t } = useTranslation();
    const chartData = {
        total: totalCompanies + totalUsers,
        records: [
            {
                title: t("Companies"),
                value: totalCompanies,
                color: "#375DFB"
            },
            {
                title: t("Users"),
                value: totalUsers,
                color: "#F2AE40"
            }
        ]
    };

    return (
        <DonutChartComponent
            title={t("Subscriptions")}
            toolbar={
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <ChartSelect 
                        options={[{ id: 1, value: t("Monthly") }]} 
                        defaultValue={t("Monthly")}
                        className="w-full sm:w-32"
                    />
                    <ChartSelect 
                        options={[{ id: 1, value: t("Last Month") }]} 
                        defaultValue={t("Last Month")}
                        className="w-full sm:w-36"
                    />
                </div>
            }
            subtitle={t("SUBSCRIPTIONS")}
            data={chartData}
        />
    );
};

export default SubscriptionsChart;