import { useTranslation } from "react-i18next";
import { RiArrowDownSLine } from '@remixicon/react';
import { ImSpinner2 } from "react-icons/im";

const AnalyticsCard = ({
    title,
    compact = false,
    children,
    showDropdowns = false,
    dropdown1Label = "Filter",
    dropdown1Options = [],
    selectedFilter = "",
    onFilterChange,
    timeRangeOptions = [],
    selectedTimeRange = "",
    onTimeRangeChange,
    isFetching = false,
}) => {
    const { t } = useTranslation();

    return (
        <div className={`bg-surface p-4 sm:p-6 rounded-2xl shadow-sm border border-status-border flex flex-col min-w-0 relative ${compact ? "" : "min-h-[340px]"}`}>
            <div className="flex flex-col xl:flex-row justify-between items-start gap-3 mb-5">
                <h3 className="font-bold text-table-title text-lg">{t(title)}</h3>
                <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
                    {showDropdowns && (
                        <div className="relative flex items-center">
                            <select
                                className="appearance-none text-xs bg-status-bg border border-status-border rounded-lg ps-3 pe-8 max-w-full py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-cell-secondary font-medium cursor-pointer"
                                aria-label={t(dropdown1Label)}
                                value={selectedFilter}
                                onChange={(e) => onFilterChange?.(e.target.value)}
                            >
                                <option value="">{t(dropdown1Label)}</option>
                                {dropdown1Options.map((opt, i) => (
                                    <option key={i} value={opt.id}>{opt.value}</option>
                                ))}
                            </select>
                            <RiArrowDownSLine className="size-4 absolute end-2 text-cell-secondary pointer-events-none" />
                        </div>
                    )}
                    {timeRangeOptions.length > 0 && (
                        <div className="relative flex items-center">
                            <select
                                className="appearance-none text-xs bg-status-bg border border-status-border rounded-lg ps-3 pe-8 max-w-full py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-cell-secondary font-medium cursor-pointer"
                                aria-label={t("Time Range")}
                                value={selectedTimeRange}
                                onChange={(e) => onTimeRangeChange?.(e.target.value)}
                            >
                                {timeRangeOptions.map((opt, i) => (
                                    <option key={i} value={opt.value}>{t(opt.label)}</option>
                                ))}
                            </select>
                            <RiArrowDownSLine className="size-4 absolute end-2 text-cell-secondary pointer-events-none" />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 w-full relative flex flex-col">
                {children}
            </div>
            {isFetching && (
                <div className="absolute inset-0 bg-surface/70 rounded-[24px] flex items-center justify-center z-10">
                    <ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={28} />
                </div>
            )}
        </div>
    );
};

export default AnalyticsCard;
