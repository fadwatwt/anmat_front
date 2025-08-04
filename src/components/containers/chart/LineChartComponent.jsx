"use client";

import ContentCard from "@/components/containers/ContentCard";
import { RiCircleFill } from "@remixicon/react";
import LineChartDrawer from "@/components/drawers/LineChartDrawer";

const LineChartComponent = ({
    title,
    toolbar,
    data,
    lines,
    yaxisTitle = ''
}) => {

    return (
        <ContentCard
            title={title}
            toolbar={toolbar}
            main={
                <div className="flex justify-center mb-6 w-full">
                    <LineChartDrawer data={data} lines={lines} yaxisTitle={yaxisTitle} />
                </div>
            }
            footer={
                <div className="flex flex-wrap items-start gap-4 justify-center w-100">
                    {
                        lines.map(line => {
                            return (
                                <div className="flex gap-1 items-center">
                                    <RiCircleFill size={10} className={`text-[${line.stroke}]`} />
                                    <span className="text-sm text-gray-500">
                                        {line.dataKey}
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

export default LineChartComponent;