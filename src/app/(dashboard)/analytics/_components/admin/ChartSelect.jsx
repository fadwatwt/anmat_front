
import { RiArrowDownSLine } from '@remixicon/react';

const ChartSelect = ({ options = [], defaultValue, placeholder = "Select", className = "" }) => {
    return (
        <div className={`relative flex items-center ${className}`}>
            <select 
                className="appearance-none text-xs bg-status-bg border border-status-border rounded-lg pl-3 pr-8 py-1.5 outline-none text-cell-secondary font-medium cursor-pointer w-full hover:border-primary-400 transition-colors"
                defaultValue={defaultValue || (options.length > 0 ? options[0].value : placeholder)}
            >
                {options.length > 0 ? (
                    options.map((opt, i) => (
                        <option key={i} value={opt.value}>{opt.value}</option>
                    ))
                ) : (
                    <option>{placeholder}</option>
                )}
            </select>
            <RiArrowDownSLine className="size-4 absolute right-2 text-cell-secondary pointer-events-none" />
        </div>
    );
};

export default ChartSelect;
