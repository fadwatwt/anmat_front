"use client";
import React from 'react'
import { Line } from "recharts/es6/cartesian/Line"
import { LineChart } from "recharts/es6/chart/LineChart";
import { YAxis } from "recharts/es6/cartesian/YAxis";

const LineChartDrawer = ({
    data,
    lines
}) => {
    const theme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;

    return (
        <div className="w-full">
            <LineChart width={500} height={300} data={data}>
                <YAxis ticks={[1, 5, 10, 15]} axisLine={false}
                    tickLine={false} tick={theme === "dark" ? { fill: "#d1d2d3", fontSize: 12 } : {
                        fill: "#6B7280",
                        fontSize: 12
                    }} />
                {lines.map((line, index) => (
                    <Line
                        key={index}
                        {...line}
                    />
                ))}
            </LineChart>
        </div>
    );
};

export default LineChartDrawer;