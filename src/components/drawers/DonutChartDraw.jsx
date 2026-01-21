"use client";
import React from 'react'
import PropTypes from "prop-types";

const DonutChartDraw = ({ data, total }) => {
    let cumulativePercent = 0;

    const createCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };


    const paths = total > 0 ? data.filter(s => s.value > 0).map((segment) => {
        const percent = segment.value / total;
        const [startX, startY] = createCoordinatesForPercent(cumulativePercent);
        cumulativePercent += percent;
        const [endX, endY] = createCoordinatesForPercent(cumulativePercent);
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        return (
            <path
                key={segment.color}
                d={`
          M ${startX} ${startY}
          A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}
        `}
                stroke={segment.color}
                strokeWidth="0.2"
                fill="none"
            />
        );
    }) : [];

    return (
        <svg viewBox="-1.1 -1.1 2.2 2.2" style={{ transform: "rotate(-90deg)" }}>
            <circle
                cx="0"
                cy="0"
                r="1"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="0.1"
            />
            {paths}
        </svg>
    );
};

DonutChartDraw.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            color: PropTypes.string.isRequired
        })
    ).isRequired,
    total: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};

export default DonutChartDraw;