"use client";

import { useMemo } from "react";
import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";
import { useGetIndustriesOrganizationsCountQuery } from "@/redux/industries/industriesApi";

const COLORS = [
    "#375DFB", "#38C793", "#F17B2C", "#DF1C41", "#7E3AF2",
    "#FBBC05", "#0F9D58", "#4285F4", "#DB4437", "#673AB7"
];

const IndustriesChart = ({ industries: industriesProp }) => {
    const skip = Array.isArray(industriesProp) && industriesProp.length > 0;
    const { data: fallback, isLoading, error } = useGetIndustriesOrganizationsCountQuery(undefined, { skip });

    const chartData = useMemo(() => {
        const source = skip
            ? industriesProp.map((i) => ({ name: i.name, organizations_count: i.value ?? i.organizations_count ?? 0 }))
            : fallback;
        if (!source) return { total: 0, records: [] };

        const records = source.map((item, index) => ({
            title: item.name,
            value: item.organizations_count || item.value || 0,
            color: COLORS[index % COLORS.length]
        }));

        const total = records.reduce((acc, curr) => acc + curr.value, 0);

        return { total, records };
    }, [skip, industriesProp, fallback]);

    if (!skip && isLoading) return <div className="h-[400px] flex items-center justify-center bg-white rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">Loading chart...</div>;
    if (!skip && error) return <div className="h-[400px] flex items-center justify-center bg-white rounded-2xl border border-gray-100 text-red-500 dark:bg-gray-800 dark:border-gray-700">Error loading chart data</div>;

    return (
        <DonutChartComponent
            title={"Industries Organizations"}
            toolbar={
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <div className="w-full sm:w-32">
                        <DefaultSelect options={[{ id: 1, value: "All Time" }]} variant="chart" />
                    </div>
                </div>
            }
            subtitle={"ORGANIZATIONS"}
            data={chartData}
        />
    );
};

export default IndustriesChart;
