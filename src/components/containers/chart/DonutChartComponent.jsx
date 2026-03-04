"use client";

import ContentCard from "@/components/containers/ContentCard";
import DonutChartDraw from "@/components/drawers/DonutChartDraw";
import { RiCircleFill } from "@remixicon/react";

const DonutChartComponent = ({ title, toolbar, subtitle, data }) => {

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
                                <div className="text-sm text-cell-secondary">{subtitle}</div>
                                <div className="text-3xl font-bold text-table-title">
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
                                <div key={record.title} className="flex flex-col items-center justify-center gap-2">
                                    <div className="flex gap-1 items-center">
                                        <RiCircleFill size={10} style={{ color: record.color }} />
                                        <span className="text-sm text-cell-secondary">
                                            {record.title}
                                        </span>
                                    </div>
                                    <span className="block text-cell-primary">
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