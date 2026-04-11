"use client";

import ContentCard from "@/components/containers/ContentCard";
import { RiCircleFill } from "@remixicon/react";
import BarChartDraw from "../../drawers/BarChartDraw";

const BarChartComponent = ({
    title,
    subtitle,
    toolbar,
    barGab,
    monthlyData,
    bars,
    yaxisTitle = '',
    domain,
    ticks
}) => {

    return (
        <ContentCard
            title={title}
            subtitle={subtitle ?? null}
            toolbar={toolbar}
            main={
                <div className="flex justify-center mb-6 w-full">
                    <BarChartDraw barGab={barGab} monthlyData={monthlyData} bars={bars} yaxisTitle={yaxisTitle} domain={domain} ticks={ticks} />
                </div>
            }
            footer={
                <div className="flex flex-wrap items-start gap-4 justify-center w-100">
                    {
                        bars.map(bar => {
                            return (
                                <div key={bar.name} className="flex gap-1 items-center">
                                    <RiCircleFill size={10} style={{ color: bar.fill }} />
                                    <span className="text-sm text-cell-secondary">
                                        {bar.name}
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

export default BarChartComponent;