"use client";

import ContentCard from "@/app/_components/ContentCard";
import { RiCircleFill } from "@remixicon/react";
import BarChartDraw from "../drawers/BarChartDraw";

const BarChartComponent = ({
    title,
    toolbar,
    barGab,
    monthlyData,
    bars
}) => {

    return (
        <ContentCard
            title={title}
            toolbar={toolbar}
            main={
                <div className="flex justify-center mb-6 w-full">
                    <BarChartDraw barGab={barGab} monthlyData={monthlyData} bars={bars} />
                </div>
            }
            footer={
                <div className="flex flex-wrap items-start gap-4 justify-center w-100">
                    {
                        bars.map(bar => {
                            return (
                                <div className="flex gap-1 items-center">
                                    <RiCircleFill size={10} className={`text-[${bar.fill}]`} />
                                    <span className="text-sm text-gray-500">
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