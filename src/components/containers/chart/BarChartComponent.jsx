"use client";

import ContentCard from "@/components/containers/ContentCard";
import { RiCircleFill } from "@remixicon/react";
import BarChartDraw from "../../drawers/BarChartDraw";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

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
    const { t } = useTranslation();
    const hasData = Array.isArray(monthlyData) && monthlyData.length > 0;

    return (
        <ContentCard
            title={title}
            subtitle={subtitle ?? null}
            toolbar={toolbar}
            main={
                <div className="flex justify-center mb-6 w-full min-h-[300px]">
                    {hasData ? (
                        <BarChartDraw barGab={barGab} monthlyData={monthlyData} bars={bars} yaxisTitle={yaxisTitle} domain={domain} ticks={ticks} />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-center text-cell-secondary">
                            <span className="text-sm font-medium">{t("No data available")}</span>
                            <span className="text-xs opacity-70">{t("Data will appear here when activity is recorded")}</span>
                        </div>
                    )}
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

BarChartComponent.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    toolbar: PropTypes.node,
    barGab: PropTypes.number,
    monthlyData: PropTypes.arrayOf(PropTypes.object),
    bars: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        fill: PropTypes.string.isRequired,
    })).isRequired,
    yaxisTitle: PropTypes.string,
    domain: PropTypes.arrayOf(PropTypes.number),
    ticks: PropTypes.arrayOf(PropTypes.number),
};

export default BarChartComponent;
