import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

const GaugeChart = ({
    percentage = 0,
    compact = false,
    primaryColor = "#F59E0B", // تعيين القيم الافتراضية هنا مباشرة
    secondaryColor = "#E5E7EB",
    label,
    footerData = [],
    breakdownData = []
}) => {
    const { t } = useTranslation();
    const resolvedLabel = label ?? t("DELAY");

    const boundedPercentage = Math.min(100, Math.max(0, Number(percentage) || 0));
    if (compact) return (
        <div className="space-y-4">
            <p className="text-2xl font-bold text-page-title">{percentage}%</p>
            <div role="progressbar" aria-label={label} aria-valuenow={boundedPercentage} aria-valuemin={0} aria-valuemax={100} className="h-3 rounded-full overflow-hidden bg-status-bg">
                <div className="h-full rounded-full" style={{ width: `${boundedPercentage}%`, backgroundColor: boundedPercentage >= 90 ? '#EF4444' : primaryColor }} />
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-cell-secondary">
                {breakdownData.map(item => <span key={item.name}>{item.name}: <strong>{item.value}</strong></span>)}
                {footerData.map(item => <p key={item.text} className="w-full">{item.text}</p>)}
            </div>
        </div>
    );
    // بيانات الرسم البياني
    const data = [
        { name: 'Value', value: boundedPercentage, color: primaryColor },
        { name: 'Remaining', value: 100 - boundedPercentage, color: secondaryColor },
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
                                className="text-4xl font-bold fill-table-title"
                            />
                            <Label
                                value={resolvedLabel}
                                position="center"
                                dy={-65}
                                className="text-sm uppercase font-semibold fill-cell-secondary"
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {breakdownData.length > 0 && (
                <div className="mt-4 w-full px-4" aria-label={t("Employees Status") }>
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
                        {breakdownData.map((item) => {
                            const total = breakdownData.reduce((sum, entry) => sum + entry.value, 0);
                            const width = total > 0 ? (item.value / total) * 100 : 0;
                            return (
                                <div
                                    key={item.name}
                                    className="h-full transition-all"
                                    style={{ width: `${width}%`, backgroundColor: item.color }}
                                    title={`${item.name}: ${item.value}`}
                                />
                            );
                        })}
                    </div>
                    <div className={`mt-3 grid gap-3 ${breakdownData.length > 2 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
                        {breakdownData.map((item) => (
                            <div key={item.name} className="rounded-xl bg-status-bg px-3 py-2 text-center">
                                <div className="flex items-center justify-center gap-2 text-xs text-cell-secondary">
                                    <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span>{item.name}</span>
                                </div>
                                <p className="mt-1 text-xl font-bold text-page-title">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* النصوص التوضيحية في الأسفل */}
            <div className="flex flex-col gap-2 mt-4 w-full text-sm text-cell-secondary px-4">
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
