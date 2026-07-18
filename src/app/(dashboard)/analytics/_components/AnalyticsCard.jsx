import { useTranslation } from "react-i18next";
import { RiMoreFill, RiArrowDownSLine } from '@remixicon/react';
import { ImSpinner2 } from "react-icons/im";

const AnalyticsCard = ({
    title,
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
        <div className="bg-surface px-6 pt-6 pb-10 rounded-[24px] shadow-sm border border-status-border flex flex-col min-h-[400px] relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-table-title text-lg">{t(title)}</h3>
                <div className="flex items-center gap-2">
                    {showDropdowns && (
                        <div className="relative flex items-center">
                            <select
                                className="appearance-none text-xs bg-status-bg border border-status-border rounded-lg pl-3 pr-8 py-1.5 outline-none text-cell-secondary font-medium cursor-pointer"
                                value={selectedFilter}
                                onChange={(e) => onFilterChange?.(e.target.value)}
                            >
                                <option value="">{t(dropdown1Label)}</option>
                                {dropdown1Options.map((opt, i) => (
                                    <option key={i} value={opt.id}>{opt.value}</option>
                                ))}
                            </select>
                            <RiArrowDownSLine className="size-4 absolute right-2 text-cell-secondary pointer-events-none" />
                        </div>
                    )}
                    {timeRangeOptions.length > 0 && (
                        <div className="relative flex items-center">
                            <select
                                className="appearance-none text-xs bg-status-bg border border-status-border rounded-lg pl-3 pr-8 py-1.5 outline-none text-cell-secondary font-medium cursor-pointer"
                                value={selectedTimeRange}
                                onChange={(e) => onTimeRangeChange?.(e.target.value)}
                            >
                                {timeRangeOptions.map((opt, i) => (
                                    <option key={i} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <RiArrowDownSLine className="size-4 absolute right-2 text-cell-secondary pointer-events-none" />
                        </div>
                    )}
                    <button className="text-cell-secondary hover:text-table-title p-1">
                        <RiMoreFill className="size-5" />
                    </button>
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
