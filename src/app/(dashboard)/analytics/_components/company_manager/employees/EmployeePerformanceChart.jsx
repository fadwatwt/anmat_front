"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import React from 'react'
import ContentCard from "@/components/containers/ContentCard";
import { RiCircleFill } from "@remixicon/react";
import { ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { ZAxis } from "recharts/es6/cartesian/ZAxis";
import { ScatterChart } from "recharts/es6/chart/ScatterChart";
import { Tooltip as EPCT } from "recharts/es6/component/Tooltip";
import { Scatter } from "recharts/es6/cartesian/Scatter";


const EmployeePerformanceChart = () => {

    const data = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 3 },
        { x: 4, y: 5 },
        { x: 5, y: 3.5 },
        { x: 6, y: 4 },
    ];

    return (
        <ContentCard
            title={"Employee Performance"}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Employee" }]} />
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            main={
                <div className="h-64 w-full">
                    <div className="flex flex-col items-start justify-start gap-0 w-full h-full">
                        <span
                            className='text-md text-gray-500 dark:text-gray-200 ps-4'
                        >
                            Rating
                        </span>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart
                                margin={{
                                    top: 80,
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                }}
                            >
                                <YAxis ticks={[0, 2, 3, 4, 5, 6]} type="number" dataKey="y" name="weight" />
                                <ZAxis type="number" range={[50]} />
                                <EPCT cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter symbolSize={5}
                                    name="Employee has improved from 2 points to 4 points this month"
                                    data={data} fill="#FCAA0B" line shape="circle" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            }
            footer={
                <div className="flex gap-1 items-center justify-center">
                    <RiCircleFill size={10} className={`text-[#FCAA0B]`} />
                    <span className="text-sm text-gray-500">
                        {"Employee performance has improved from 2 points to 4 points this month"}
                    </span>
                </div>
            }
        />
    );
};

export default EmployeePerformanceChart;