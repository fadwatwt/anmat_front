
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const data = [
    { name: '0', expected: 4, actual: 2 },
    { name: '5', expected: 7, actual: 5 },
    { name: '10', expected: 5, actual: 6 },
    { name: '15', expected: 9, actual: 8 },
    { name: '20', expected: 6, actual: 4 },
    { name: '25', expected: 11, actual: 9 },
    { name: '30', expected: 13, actual: 10 },
];

const TimelineLine = () => {
    return (
        <div className="h-full w-full">
            <p className="text-[10px] text-gray-400 mb-2 absolute top-0 left-0">Hours</p>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                    />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        domain={[0, 15]}
                        ticks={[0, 5, 10, 15]}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px' }}
                    />

                    {/* الخط المتقطع - الوقت المتوقع */}
                    <Line
                        type="monotone"
                        dataKey="expected"
                        name="Expected Time"
                        stroke="#10B981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        activeDot={{ r: 4 }}
                    />

                    {/* الخط المتصل - الوقت الفعلي */}
                    <Line
                        type="monotone"
                        dataKey="actual"
                        name="Actual Time"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TimelineLine;