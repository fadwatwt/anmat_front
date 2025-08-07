const HalfDonutChart = ({ data, total }) => {
    let cumulativePercent = 0;

    const createCoordinatesForPercent = (percent) => {
        const angle = Math.PI * (1 - percent); // تعديل الزاوية لتبدأ من اليسار وتتحرك باتجاه عقارب الساعة
        const x = Math.cos(angle);
        const y = -Math.sin(angle); // استخدام سالب sin لجعل القوس علويًا
        return [x, y];
    };

    const paths = data.map((segment) => {
        const percent = segment.value / total;
        const [startX, startY] = createCoordinatesForPercent(cumulativePercent);
        cumulativePercent += percent;
        const [endX, endY] = createCoordinatesForPercent(cumulativePercent);
        const largeArcFlag = 0;

        return (
            <path
                key={segment.color}
                d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                stroke={segment.color}
                strokeWidth="0.2"
                fill="none"
            />
        );
    });

    // Background semicircle
    const [startXbg, startYbg] = createCoordinatesForPercent(0);
    const [endXbg, endYbg] = createCoordinatesForPercent(1);
    const backgroundPath = `M ${startXbg} ${startYbg} A 1 1 0 0 1 ${endXbg} ${endYbg}`;
    const theme = typeof window !== "undefined" ? localStorage.getItem("theme") : null

    return (
        <svg viewBox="-1.1 -1.1 2.2 2.2">
            <path
                d={backgroundPath}
                stroke={theme === "dark" ? "#31353F" : "#E5E7EB"}
                strokeWidth="0.2"
                fill="none"
            />
            {paths}
        </svg>
    );
};

export default HalfDonutChart;