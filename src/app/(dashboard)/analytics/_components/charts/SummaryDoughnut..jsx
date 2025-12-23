
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Tooltip } from 'recharts';
import PropTypes from 'prop-types';

const DynamicDoughnut = ({ data, centerTitle, centerValue }) => {
    // حساب الإجمالي في حال لم يتم تمريره
    const totalValue = centerValue || data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="h-full flex flex-col items-center justify-between">
            <div className="w-full h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip wrapperStyle={{ zIndex: 10 }} cursor={{ fill: 'transparent' }} />
                        <Pie
                            data={data}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                // استخدام اللون الممرر في البيانات، أو لون افتراضي
                                <Cell key={`cell-${index}`} fill={entry.color || '#e5e7eb'} strokeWidth={0} />
                            ))}
                            {/* النصوص في المنتصف */}
                            <Label
                                value={totalValue}
                                position="center"
                                className="text-3xl font-bold fill-gray-800"
                            />
                            <Label
                                value={centerTitle}
                                position="center"
                                dy={25}
                                className="text-xs uppercase font-semibold fill-gray-400"
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>


            {/* مفتاح الرسم (Legend) الديناميكي */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 w-full px-4">
                {data.map((item, index) => (
                    <div key={`legend-${index}`} className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-gray-500">{item.name}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-700">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// تعريف أنواع البيانات المتوقعة لضمان عمل المكون بشكل صحيح
DynamicDoughnut.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
    })).isRequired,
    centerTitle: PropTypes.string,
    centerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DynamicDoughnut.defaultProps = {
    centerTitle: "TOTAL",
};

export default DynamicDoughnut;