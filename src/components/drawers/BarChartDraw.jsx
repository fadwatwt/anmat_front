"use client";
import React from 'react'
import { Bar } from "recharts/es6/cartesian/Bar"
import { BarChart } from "recharts/es6/chart/BarChart";
import { CartesianGrid } from "recharts/es6/cartesian/CartesianGrid";
import { ResponsiveContainer } from "recharts/es6/component/ResponsiveContainer";
import { XAxis } from "recharts/es6/cartesian/XAxis";
import { YAxis } from "recharts/es6/cartesian/YAxis";

const BarChartDraw = ({
    barGab = 4,
    monthlyData,
    bars,
    yaxisTitle = '',
    domain = [0, 125],
    ticks = [0, 25, 50, 75, 100, 125]
}) => {
    const theme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;

    return (
        <div className="flex flex-col items-start justify-start gap-0 w-full">
            {yaxisTitle && <span
                className='text-md text-gray-500 dark:text-gray-200 ps-4'
            >
                {yaxisTitle}
            </span>}
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barGap={barGab}>
                        {" "}

                        {/* Reduce barGap */}
                        <CartesianGrid className={"bg-gary-800 text-gray-800"}
                            stroke={theme === "dark" ? "rgb(78,90,110)" : "rgb(166,167,169)"}
                            strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            className={"text-gray-700 dark:text-gray-400"}
                            axisLine={false}
                            tickLine={false}
                            tick={theme === "dark" ? { fill: "#d1d2d3", fontSize: 12 } : {
                                fill: "#6B7280",
                                fontSize: 12
                            }}
                        />
                        <YAxis
                            domain={domain}
                            ticks={ticks}
                            axisLine={false}
                            tickLine={false}
                            tick={theme === "dark" ? { fill: "#d1d2d3", fontSize: 12 } : {
                                fill: "#6B7280",
                                fontSize: 12
                            }}
                        />

                        {
                            bars.map(bar => {
                                return (
                                    <Bar
                                        dataKey={bar.dataKey}
                                        fill={bar.fill}
                                        name={bar.name}
                                        radius={bar.radius}
                                        barSize={bar.barSize}
                                    />
                                );
                            })
                        }

                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BarChartDraw;