"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import React from 'react';
import ContentCard from "@/components/containers/ContentCard";
import { RiCircleFill } from "@remixicon/react";
import { t } from "i18next";
import HalfDonutChart from "@/components/drawers/HalfDonutChartDrawer";

const EmployeeTasksDelayChart = () => {

    const data = [
        { value: 80, color: '#F17B2C', label: "Completed Tasks" },
        { value: 20, color: '#E2E4E9', label: "Not-Completed Tasks" }
    ];
    const total = 100; // Total tasks for the chart

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
                    {data.map(record => {
                        return (<div className="flex gap-1 items-center justify-center text-center">
                        <RiCircleFill size={10} className={`text-[${record.color}]`} />
                        <span className="text-sm text-gray-500">
                            {`${record.label} (${record.value}/${total})`}
                        </span>
                    </div>);
                    })}
                </div>
            }
        />
    );
};

export default EmployeeTasksDelayChart;