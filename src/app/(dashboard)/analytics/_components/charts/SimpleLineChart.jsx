
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const SimpleLineChart = ({ data, dataKey, color, note }) => {
    return (
        <div className="h-full w-full flex flex-col">
            <p className="text-sm text-gray-500 mb-4">Rating</p>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            domain={[1, 5]} // تحديد نطاق التقييم من 1 إلى 5
                            ticks={[2, 3, 4, 5]} // الأرقام التي تظهر على المحور
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                        />
                        <Line
                            type="linear"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2.5}
                            dot={{ r: 4, strokeWidth: 2, fill: 'white' }} // شكل النقطة مفرغة من الداخل
                            activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {note && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: color}}></div>
                    <p>{note}</p>
                </div>
            )}
        </div>
    );
};

export default SimpleLineChart;