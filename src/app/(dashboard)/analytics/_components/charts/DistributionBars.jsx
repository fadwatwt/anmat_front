import { useTranslation } from "react-i18next";

export default function DistributionBars({ data = [] }) {
    const { t } = useTranslation();
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (!total) return <p className="py-8 text-center text-sm text-cell-secondary">{t("No data available")}</p>;
    return <div className="space-y-5 py-3">
        {data.map(item => {
            const percent = Math.round(item.value / total * 100);
            return <div key={item.name}>
                <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
                    <span className="text-cell-secondary">{t(item.name)}</span>
                    <span className="font-semibold text-page-title">{item.value} · {percent}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-status-bg" role="img" aria-label={`${t(item.name)}: ${item.value} (${percent}%)`}>
                    <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: item.color }} />
                </div>
            </div>;
        })}
    </div>;
}
