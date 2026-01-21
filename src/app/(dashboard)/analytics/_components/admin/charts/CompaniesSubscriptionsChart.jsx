"use client";

import { useMemo } from "react";
import { format, subMonths, startOfMonth, isWithinInterval, endOfMonth } from "date-fns";
import { useGetSubscriptionsQuery } from "@/redux/subscriptions/subscriptionsApi";
import DefaultSelect from "@/components/Form/DefaultSelect";
import BarChartComponent from "@/components/containers/chart/BarChartComponent";

const CompaniesSubscriptionsChart = () => {
    const { data: subscriptions, isLoading, error } = useGetSubscriptionsQuery();

    const chartData = useMemo(() => {
        if (!subscriptions) return [];

        const last12Months = Array.from({ length: 12 }, (_, i) => {
            const date = subMonths(new Date(), 11 - i);
            return {
                name: format(date, "MMM"),
                start: startOfMonth(date),
                end: endOfMonth(date),
                count: 0
            };
        });

        subscriptions.forEach(sub => {
            const subDate = new Date(sub.createdAt);
            last12Months.forEach(month => {
                if (isWithinInterval(subDate, { start: month.start, end: month.end })) {
                    month.count++;
                }
            });
        });

        return last12Months.map(month => ({
            name: month.name,
            total: month.count
        }));
    }, [subscriptions]);

    const bars = [
        {
            dataKey: 'total',
            fill: '#38C793',
            name: 'Subscriptions',
            radius: [4, 4, 0, 0],
            barSize: 25
        }
    ];

    if (isLoading) return <div className="h-[300px] flex items-center justify-center bg-white rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">Loading chart...</div>;
    if (error) return <div className="h-[300px] flex items-center justify-center bg-white rounded-2xl border border-gray-100 text-red-500 dark:bg-gray-800 dark:border-gray-700">Error loading chart data</div>;

    return (
        <BarChartComponent
            title={"Monthly Subscriptions"}
            toolbar={
                <div className="w-40 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect
                        placeholder="Year"
                        options={[{ id: 1, value: format(new Date(), "yyyy") }]}
                        value={[{ id: 1, value: format(new Date(), "yyyy") }]}
                        multi={false}
                    />
                </div>
            }
            barGab={4}
            monthlyData={chartData}
            bars={bars}
            yaxisTitle="Number of subscriptions"
        />
    );
};

export default CompaniesSubscriptionsChart;