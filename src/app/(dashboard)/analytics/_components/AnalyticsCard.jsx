
import { RiMoreFill, RiArrowDownSLine } from '@remixicon/react';

const AnalyticsCard = ({ title, children, showDropdowns = false, dropdown1Label = "Filter" }) => {
    return (
        <div className="bg-status-bg px-6 pt-6 pb-10 rounded-[24px] shadow-sm border border-status-border flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-table-title text-lg">{title}</h3>
                <div className="flex items-center gap-2">
                    {showDropdowns && (
                        <div className="relative flex items-center">
                            <select className="appearance-none text-xs bg-status-bg border border-status-border rounded-lg pl-3 pr-8 py-1.5 outline-none text-cell-secondary font-medium cursor-pointer">
                                <option>{dropdown1Label}</option>
                            </select>
                            <RiArrowDownSLine className="size-4 absolute right-2 text-cell-secondary pointer-events-none" />
                        </div>
                    )}
                    <div className="relative flex items-center">
                        <select className="appearance-none text-xs bg-status-bg border border-status-border rounded-lg pl-3 pr-8 py-1.5 outline-none text-cell-secondary font-medium cursor-pointer">
                            <option>Last Month</option>
                        </select>
                        <RiArrowDownSLine className="size-4 absolute right-2 text-cell-secondary pointer-events-none" />
                    </div>
                    <button className="text-cell-secondary hover:text-table-title p-1">
                        <RiMoreFill className="size-5" />
                    </button>
                </div>
            </div>
            <div className="flex-1 w-full relative flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default AnalyticsCard;