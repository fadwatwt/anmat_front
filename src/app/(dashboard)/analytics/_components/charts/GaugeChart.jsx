
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

const GaugeChart = ({
                        percentage = 0,
                        primaryColor = "#F59E0B", // تعيين القيم الافتراضية هنا مباشرة
                        secondaryColor = "#E5E7EB",
                        label = "DELAY",
                        footerData = []
                    }) => {

    // بيانات الرسم البياني
    const data = [
        { name: 'Value', value: percentage, color: primaryColor },
        { name: 'Remaining', value: 100 - percentage, color: secondaryColor },
    ];

    return (
        <div className="h-full flex flex-col items-center justify-between">
            <div className="w-full h-[200px] relative flex items-end justify-center overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={0}
                            dataKey="value"
                            cornerRadius={10}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                // التأكد من وجود لون قبل الرسم، وإلا نستخدم لوناً احتياطياً
                                <Cell key={`cell-${index}`} fill={entry.color || primaryColor} />
                            ))}

                            <Label
                                value={`${percentage}%`}
                                position="center"
                                dy={-30}
                                className="text-4xl font-bold fill-gray-800"
                            />
                            <Label
                                value={label}
                                position="center"
                                dy={-65}
                                className="text-sm uppercase font-semibold fill-gray-400"
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* النصوص التوضيحية في الأسفل */}
            <div className="flex flex-col gap-2 mt-4 w-full text-sm text-gray-600 px-4">
                {footerData && footerData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color || primaryColor }}
                        />
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GaugeChart;