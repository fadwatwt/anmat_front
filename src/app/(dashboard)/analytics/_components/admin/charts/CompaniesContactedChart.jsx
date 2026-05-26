"use client";
import { useTranslation } from "react-i18next";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import ChartSelect from "@/app/(dashboard)/analytics/_components/admin/ChartSelect";

const CompaniesContactedChart = ({ data }) => {
    const { t } = useTranslation();
    const FALLBACK = {
        total: 0,
        records: [
            { title: t("Approached"), value: 0, color: "#2D9F75" },
            { title: t("Failed"), value: 0, color: "#DF1C41" },
        ],
    };
    // Check efficiency: ensures data is present
    const chartData = data && data.records ? data : FALLBACK;

    return (
        <DonutChartComponent
            title={t("Companies Contacted")}
            toolbar={
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <ChartSelect 
                        options={[{ id: 1, value: t("Employee") }]} 
                        defaultValue={t("Employee")}
                        className="w-full sm:w-32"
                    />
                    <ChartSelect 
                        options={[{ id: 1, value: t("Last Month") }]} 
                        defaultValue={t("Last Month")}
                        className="w-full sm:w-36"
                    />
                </div>
            }
            subtitle={t("COMPANIES")}
            data={chartData}
        />
    );
};

export default CompaniesContactedChart;
