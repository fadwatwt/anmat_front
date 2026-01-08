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
    const [selectedOptions, setSelectedOptions] = useState(
        Array.isArray(defaultValue) ? defaultValue : []
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { t } = useTranslation();
    const dropdownRef = useRef(null);
    const selectTriggerRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const prevDefaultValueIdsRef = useRef('');

    // مزامنة selectedOptions مع defaultValue عند تغييره من الخارج
    useEffect(() => {
        if (!Array.isArray(defaultValue)) return;

        // Create a string representation of the IDs for comparison
        const currentIds = defaultValue.map(opt => opt.id).sort().join(',');
        const prevIds = prevDefaultValueIdsRef.current;

        // Only update if the IDs actually changed
        if (currentIds !== prevIds) {
            prevDefaultValueIdsRef.current = currentIds;
            setSelectedOptions(defaultValue);
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
            setDropdownStyle({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
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
            <label className="text-sm text-start text-gray-700 flex items-center gap-1 mb-2 dark:text-gray-200">
                <span>{t(title)}</span>
                {isOption && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        ({t("Option")}) <FaCircleInfo className="text-gray-400" size={14} />
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
                    className="flex items-center gap-2 min-h-[40px] dark:bg-white-0 border border-gray-300 dark:border-gray-500 rounded-[10px] p-[10px] box-border text-xs cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
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
                                                ? `text-gray-800 bg-gray-100 rounded-md py-1 px-2 flex gap-1 items-center ${classNameItemSelected || "border border-gray-200"
                                                }`
                                                : "text-gray-800 dark:text-gray-200"
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
                            <span className="text-gray-400 dark:text-gray-500">
                                {t(placeholder)}...
                            </span>
                        )}
                        {selectedOptions.some(opt => opt.isSelectAll) && selectedOptions.length > 1 && (
                            <span className="text-blue-600 ml-1 flex items-center">+{selectedOptions.length - 1}</span>
                        )}
                    </div>
                    <IoIosArrowDown className="text-gray-500 shrink-0" size={16} />
                </div>

                {isDropdownOpen &&
                    createPortal(
                        <div
                            ref={dropdownRef}
                            style={dropdownStyle}
                            className={`fixed z-[9999] bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl mt-1 max-h-64 overflow-y-auto ${dropDownClassName}`}
                        >
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer border-b last:border-none border-gray-100 dark:border-zinc-800"
                                    onClick={() => toggleOptions(option)}
                                >
                                    {isMultiple && (
                                        <input
                                            type="checkbox"
                                            checked={selectedOptions.some((u) => u.id === option.id)}
                                            readOnly
                                            className="mr-3 w-4 h-4 rounded border-gray-300 accent-blue-600 shrink-0 pointer-events-none"
                                        />
                                    )}

                                    <div className="flex-1">
                                        {renderOption ? (
                                            renderOption(option)
                                        ) : (
                                            <span className={`text-sm ${option.isSelectAll ? 'font-bold text-blue-600' : 'text-gray-700 dark:text-gray-200'}`}>
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