import { FaCircleInfo } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

function ElementsSelect({
    title,
    options,
    onChange,
    isOption = false,
    placeholder,
    classNameContainer,
    isMultiple = false,
    defaultValue = [],
    classNameItemSelected,
    isRemoveBtn = true,
    dropDownClassName,
    renderOption,
}) {
    const [selectedOptions, setSelectedOptions] = useState(() => {
        if (Array.isArray(defaultValue)) return defaultValue;
        if (defaultValue && typeof defaultValue === 'object') return [defaultValue];
        return [];
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { t } = useTranslation();
    const dropdownRef = useRef(null);
    const selectTriggerRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const prevDefaultValueIdsRef = useRef('');

    // مزامنة selectedOptions مع defaultValue عند تغييره من الخارج
    useEffect(() => {
        const normalizedDefault = Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : []);

        // Create a string representation of the IDs for comparison
        const currentIds = normalizedDefault.map(opt => opt.id).sort().join(',');
        const prevIds = prevDefaultValueIdsRef.current;

        // Only update if the IDs actually changed
        if (currentIds !== prevIds) {
            prevDefaultValueIdsRef.current = currentIds;
            setSelectedOptions(normalizedDefault);
        }
    }, [defaultValue]);
    const toggleOptions = (option) => {
        let updatedSelection = [];

        // 1. منطق "اختيار الجميع"
        if (option.isSelectAll) {
            const isCurrentlyAllSelected = selectedOptions.length === options.length;
            // إذا كان الكل مختاراً بالفعل -> نفرغ المصفوفة، وإلا -> نختار كل الـ options
            updatedSelection = isCurrentlyAllSelected ? [] : [...options];
        }
        else {
            // 2. منطق الاختيار العادي
            const isAlreadySelected = selectedOptions.find((u) => u.id === option.id);

            if (isAlreadySelected) {
                // حذف العنصر، وحذف خيار "الكل" أيضاً إذا كان موجوداً
                updatedSelection = selectedOptions.filter(
                    (u) => u.id !== option.id && !u.isSelectAll
                );
            } else {
                const newSelection = isMultiple ? [...selectedOptions, option] : [option];

                // فحص تلقائي: إذا اكتمل اختيار جميع العناصر العادية، نختار معهم زر "الكل"
                const regularOptions = options.filter(opt => !opt.isSelectAll);
                const allRegularSelected = regularOptions.every(regOpt =>
                    newSelection.some(sel => sel.id === regOpt.id)
                );

                if (allRegularSelected && options.some(opt => opt.isSelectAll)) {
                    updatedSelection = [...options];
                } else {
                    updatedSelection = newSelection;
                }
            }
        }

        if (!isMultiple) {
            setIsDropdownOpen(false);
        }

        setSelectedOptions(updatedSelection);
        if (onChange) {
            onChange(updatedSelection);
        }
    };

    const calculateDropdownPosition = () => {
        if (selectTriggerRef.current) {
            const rect = selectTriggerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const dropdownMaxHeight = 256; // Matching max-h-64 (16rem = 256px)
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow) {
                // Open Upwards
                setDropdownStyle({
                    bottom: viewportHeight - rect.top + 4,
                    left: rect.left,
                    width: rect.width,
                });
            } else {
                // Open Downwards
                setDropdownStyle({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                });
            }
        }
    };

    useEffect(() => {
        if (isDropdownOpen) {
            calculateDropdownPosition();
            window.addEventListener("resize", calculateDropdownPosition);
            window.addEventListener("scroll", calculateDropdownPosition);
        }
        return () => {
            window.removeEventListener("resize", calculateDropdownPosition);
            window.removeEventListener("scroll", calculateDropdownPosition);
        };
    }, [isDropdownOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                selectTriggerRef.current &&
                !selectTriggerRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={classNameContainer}>
            <label className="text-sm text-start text-cell-primary flex items-center gap-1 mb-2 font-medium">
                <span>{t(title)}</span>
                {isOption && (
                    <span className="text-xs text-cell-secondary flex items-center gap-1">
                        ({t("Option")}) <FaCircleInfo className="text-cell-secondary" size={14} />
                    </span>
                )}
            </label>

            <div className="max-w-full w-full relative">
                <div
                    onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                        calculateDropdownPosition();
                    }}
                    ref={selectTriggerRef}
                    className="flex items-center gap-2 min-h-[40px] bg-status-bg border border-status-border rounded-[10px] p-[10px] box-border text-xs cursor-pointer focus-within:ring-2 focus-within:ring-primary-500 transition-colors"
                >
                    <div className="flex-1 flex gap-1 overflow-x-auto whitespace-nowrap overflow-y-hidden custom-scrollbar">
                        {selectedOptions.length > 0 ? (
                            // عرض العناصر المختارة (تجنب عرض "الكل" كـ Tag إذا كنت تفضل ذلك)
                            selectedOptions
                                .filter(opt => !opt.isSelectAll)
                                .map((option) => (
                                    <div
                                        key={option.id}
                                        className={
                                            isMultiple
                                                ? `text-cell-primary bg-badge-bg rounded-md py-1 px-2 flex gap-1 items-center border border-status-border ${classNameItemSelected || ""
                                                }`
                                                : "text-cell-primary font-medium"
                                        }
                                    >
                                        {option.element}
                                        {isMultiple && isRemoveBtn && (
                                            <FaTimes
                                                className="ml-1 cursor-pointer text-gray-500 hover:text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleOptions(option);
                                                }}
                                            />
                                        )}
                                    </div>
                                ))
                        ) : (
                            <span className="text-cell-secondary">
                                {t(placeholder)}...
                            </span>
                        )}
                        {selectedOptions.some(opt => opt.isSelectAll) && selectedOptions.length > 1 && (
                            <span className="text-blue-600 ml-1 flex items-center">+{selectedOptions.length - 1}</span>
                        )}
                    </div>
                    <IoIosArrowDown className="text-cell-secondary shrink-0" size={16} />
                </div>

                {isDropdownOpen &&
                    createPortal(
                        <div
                            ref={dropdownRef}
                            style={dropdownStyle}
                            className={`fixed z-[9999] bg-surface border border-status-border rounded-xl shadow-2xl mt-1 max-h-64 overflow-y-auto ${dropDownClassName || ""}`}
                        >
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center p-3 hover:bg-status-bg cursor-pointer border-b last:border-none border-status-border transition-colors"
                                    onClick={() => toggleOptions(option)}
                                >
                                    {isMultiple && (
                                        <input
                                            type="checkbox"
                                            checked={selectedOptions.some((u) => u.id === option.id)}
                                            readOnly
                                            className="mr-3 w-4 h-4 rounded border-status-border accent-primary-500 shrink-0 pointer-events-none"
                                        />
                                    )}

                                    <div className="flex-1">
                                        {renderOption ? (
                                            renderOption(option)
                                        ) : (
                                            <span className={`text-sm ${option.isSelectAll ? 'font-bold text-primary-500' : 'text-cell-primary'}`}>
                                                {option.element}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>,
                        document.body
                    )}
            </div>
        </div>
    );
}

ElementsSelect.propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    isOption: PropTypes.bool,
    classNameContainer: PropTypes.string,
    placeholder: PropTypes.string,
    isMultiple: PropTypes.bool,
    defaultValue: PropTypes.array,
    classNameItemSelected: PropTypes.string,
    isRemoveBtn: PropTypes.bool,
    dropDownClassName: PropTypes.string,
    renderOption: PropTypes.func,
};

export default ElementsSelect;