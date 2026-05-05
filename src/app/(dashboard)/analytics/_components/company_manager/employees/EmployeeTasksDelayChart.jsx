"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import React from 'react';
import ContentCard from "@/components/containers/ContentCard";
import { RiCircleFill } from "@remixicon/react";
import { t } from "i18next";
import HalfDonutChart from "@/components/drawers/HalfDonutChartDrawer";

const EmployeeTasksDelayChart = ({ completed = 0, total = 0 }) => {
    const remaining = Math.max(0, total - completed);
    const data = [
        { value: completed, color: '#F17B2C', label: "Completed Tasks" },
        { value: remaining, color: '#E2E4E9', label: "Not-Completed Tasks" }
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
                <div className="h-64 w-full flex items-center justify-center">
                    <div className="relative w-48 h-32 ">
                        <HalfDonutChart
                            data={data}
                            total={total}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-200">{t("TASKS")}</div>
                                <div className="text-3xl font-bold dark:text-white">
                                    {total}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            footer={
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {data.map((record, idx) => (
                        <div key={idx} className="flex gap-1 items-center justify-center text-center">
                            <RiCircleFill size={10} style={{ color: record.color }} />
                            <span className="text-sm text-gray-500">
                                {`${record.label} (${record.value}/${total})`}
                            </span>
                        </div>
                    ))}
                </div>
            }
        />
    );
};

export default EmployeeTasksDelayChart;
