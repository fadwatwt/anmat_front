"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import React from 'react'
import ContentCard from "@/components/containers/ContentCard";
import { RiCircleFill } from "@remixicon/react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const RevenuesChart = () => {

    const data = [
        { name: 'Jan', value: 20 },
        { name: 'Feb', value: 30 },
        { name: 'Mar', value: 45 },
        { name: 'Apr', value: 50 },
        { name: 'May', value: 40 },
        { name: 'Jun', value: 45 },
    ];

    return (
        <ContentCard
            title={"Revenues"}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Last 6 Months" }]} />
                </div>
            }
            main={
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
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
                                domain={[0, 50]}
                                ticks={[0, 20, 30, 40, 50]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 16, fill: '#A3A3A3' }}
                                unit="k"
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
                <div className="flex gap-1 items-center justify-center">
                    <RiCircleFill size={10} className={`text-[#FCAA0B]`} />
                    <span className="text-sm text-gray-500">
                        {"Revenues has improved from 2 points to 4 points this month"}
                    </span>
                </div>
            }
        />
    );
};

export default RevenuesChart;