
import { RiMoreFill, RiArrowDownSLine } from '@remixicon/react';

const AnalyticsCard = ({ title, children, showDropdowns = false, dropdown1Label = "Filter" }) => {
    return (
        <div className="bg-white px-6 pt-6 pb-10 rounded-[24px] shadow-sm border border-gray-50 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-700 text-lg">{title}</h3>
                <div className="flex items-center gap-2">
                    {showDropdowns && (
                        <div className="relative flex items-center">
                            <select className="appearance-none text-xs bg-gray-50 border border-gray-100 rounded-lg pl-3 pr-8 py-1.5 outline-none text-gray-500 font-medium cursor-pointer">
                                <option>{dropdown1Label}</option>
                            </select>
                            <RiArrowDownSLine className="size-4 absolute right-2 text-gray-400 pointer-events-none" />
                        </div>
                    )}
                    <div className="relative flex items-center">
                        <select className="appearance-none text-xs bg-gray-50 border border-gray-100 rounded-lg pl-3 pr-8 py-1.5 outline-none text-gray-500 font-medium cursor-pointer">
                            <option>Last Month</option>
                        </select>
                        <RiArrowDownSLine className="size-4 absolute right-2 text-gray-400 pointer-events-none" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
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