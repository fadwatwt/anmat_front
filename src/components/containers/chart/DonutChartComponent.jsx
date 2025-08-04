"use client";

import ContentCard from "@/components/containers/ContentCard";
import DonutChartDraw from "@/components/drawers/DonutChartDraw";
import { RiCircleFill } from "@remixicon/react";

const DonutChartComponent = ({title, toolbar, subtitle, data}) => {

    return (
        <ContentCard
            title={title}
            toolbar={toolbar}
            main={
                <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                        <DonutChartDraw data={data.records} total={data.total} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-200">{subtitle}</div>
                                <div className="text-3xl font-bold dark:text-white">
                                    {data.total}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            footer={
                <div className="flex flex-wrap items-start gap-4 justify-center w-100">
                    {
                        data.records.map(record => {
                            return (
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="flex gap-1 items-center">
                                        <RiCircleFill size={10} className={`text-[${record.color}]`} />
                                        <span className="text-sm text-gray-500">
                                            {record.title}
                                        </span>
                                    </div>
                                    <span className="block text-gray-900">
                                        {record.value}
                                    </span>
                                </div>
                            );
                        })
                    }
                </div>
            }
        />
    );
};

export default DonutChartComponent;