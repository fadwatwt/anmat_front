"use client";

import ChartSelect from "@/app/(dashboard)/analytics/_components/admin/ChartSelect";
import { useMemo } from 'react'
import ContentCard from "@/components/containers/ContentCard";
import { RiCircleFill } from "@remixicon/react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const RevenuesChart = ({ data = [] }) => {
    // Check efficiency: ensures data is present
    const chartData = data.length > 0 ? data : [];

    const summary = useMemo(() => {
        if (chartData.length < 2) return null;
        const last = chartData[chartData.length - 1].value;
        const prev = chartData[chartData.length - 2].value;
        if (prev === 0 && last === 0) return null;
        const direction = last >= prev ? "improved" : "decreased";
        return `Revenues has ${direction} from ${prev} to ${last} this month`;
    }, [chartData]);

    return (
        <ContentCard
            title={"Revenues"}
            toolbar={
                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <ChartSelect 
                        options={[{ id: 1, value: "Last 6 Months" }]} 
                        defaultValue="Last 6 Months"
                        className="w-full sm:w-32"
                    />
                </div>
            }
            main={
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 14, fill: '#A3A3A3' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 16, fill: '#A3A3A3' }}
                            />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#FCAA0B"
                                strokeWidth={3}
                                dot={{ r: 5, stroke: '#FCAA0B' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }
            footer={
                summary ? (
                    <div className="flex gap-1 items-center justify-center">
                        <RiCircleFill size={10} className={`text-[#FCAA0B]`} />
                        <span className="text-sm text-cell-secondary">{summary}</span>
                    </div>
                ) : null
            }
        />
    );
};

export default RevenuesChart;
