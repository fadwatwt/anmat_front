import PropTypes from "prop-types";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { FaCircleInfo, FaXmark as FaTimes } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function CustomSelect({
    title,
    options,
    onChange,
    classNameContainer = "",
    classNameSelect = "",
    isOption = false,
    value = [],
    placeholder = "Select",
    multi = true,
    error,
    variant = "default",
}) {
    const { t, i18n } = useTranslation();

    const [selectedOptions, setSelectedOptions] = useState(Array.isArray(value) ? value : []);
    const [inputValue, setInputValue] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const inputContainerRef = useRef(null);
    const dropdownContentRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const [dropdownHeight, setDropdownHeight] = useState(250);

    // Sync internal state with prop value
    // This made the problem of navigation in Employee Dashboard
    // useEffect(() => {
    //     setSelectedOptions(Array.isArray(value) ? value : []);
    // }, [value]);

    // منطق إضافة/حذف الـ Tag
    const toggleOption = (option) => {
        // يجب أن يكون كائن الـ option كاملاً هنا
        const optionObject = options.find(opt => opt.id === option.id);
        if (!optionObject) return;

        let updatedSelection;
        if (multi) {
            const alreadySelected = selectedOptions.some((u) => u.id === option.id);
            updatedSelection = alreadySelected
                ? selectedOptions.filter((u) => u.id !== option.id)
                : [...selectedOptions, optionObject];
        } else {
            updatedSelection = [optionObject];
            setIsDropdownOpen(false);
        }

        setInputValue("");
        setSelectedOptions(updatedSelection);
        onChange(updatedSelection);
    };

    // منطق تصفية الخيارات
    const filteredSuggestions = () => {
        let results = options;
        if (inputValue) {
            results = results.filter((option) =>
                // نستخدم t(option.value) لأن هذا هو ما يُعرض للمستخدم للبحث
                t(option.value).toLowerCase().includes(inputValue.trim().toLowerCase())
            );
        }
        return results.filter(
            (option) => !selectedOptions.some((tag) => tag.id === option.id)
        );
    };

    // دالة التموضع الذكي وتصحيح الإحداثيات
    const calculateDropdownPosition = () => {
        if (inputContainerRef.current) {
            // قياس أبعاد وموقع عنصر الإدخال بالنسبة للـ Viewport
            const rect = inputContainerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // قياس الارتفاع الفعلي للقائمة المنسدلة
            let currentDropdownHeight = dropdownContentRef.current
                ? dropdownContentRef.current.offsetHeight
                : 240; // 240px هو ارتفاع max-h-60 في Tailwind

            setDropdownHeight(currentDropdownHeight);

            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            // منطق الفتح للأعلى (إذا لم تكن هناك مساحة كافية في الأسفل والمساحة كافية في الأعلى)
            const shouldOpenUpwards = spaceBelow < currentDropdownHeight + 10 && spaceAbove >= currentDropdownHeight + 10;

            // 👈 تطبيق التموضع بدقة باستخدام LEFT و WIDTH المقاسة:
            setDropdownStyle({
                // التموضع العمودي:
                top: shouldOpenUpwards ? rect.top - currentDropdownHeight - 8 : rect.bottom + 4,

                // التموضع الأفقي (LEFT) للحفاظ على المحاذاة الدقيقة
                left: rect.left,

                // العرض: يجب أن يتطابق مع عرض حقل الإدخال
                width: rect.width,
            });
        }
    };

    // معالجة فتح/إغلاق الـ Dropdown وحساب الموضع
    useEffect(() => {
        if (isDropdownOpen) {
            calculateDropdownPosition();
            // إعادة الحساب عند أي تغيير في التمرير أو حجم النافذة
            window.addEventListener('resize', calculateDropdownPosition);
            window.addEventListener('scroll', calculateDropdownPosition);
        } else {
            window.removeEventListener('resize', calculateDropdownPosition);
            window.removeEventListener('scroll', calculateDropdownPosition);
        }

        const handleClickOutside = (event) => {
            // نتحقق من النقر خارج عنصر الإدخال وخارج الـ dropdown نفسه
            if (
                inputContainerRef.current &&
                !inputContainerRef.current.contains(event.target) &&
                dropdownContentRef.current &&
                !dropdownContentRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener('resize', calculateDropdownPosition);
            window.removeEventListener('scroll', calculateDropdownPosition);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen, inputValue]);

    // محتوى القائمة المنسدلة (الـ Portal)
    const dropdownPortal = (isDropdownOpen && filteredSuggestions().length > 0) ? createPortal(
        <div
            ref={dropdownContentRef}
            style={dropdownStyle}
            className={`fixed z-[9999] bg-surface border border-status-border p-2 rounded-2xl shadow-lg mt-0 max-h-60 overflow-y-auto ${i18n.language === "ar" ? "text-right" : "text-left"
                }`}
        >
            {filteredSuggestions().map((option) => (
                <div
                    key={option.id}
                    onMouseDown={() => toggleOption(option)}
                    className="flex items-center text-sm p-2 hover:bg-status-bg text-cell-primary cursor-pointer rounded-lg transition-colors"
                >
                    {t(option.value)}
                </div>
            ))}
        </div>,
        document.body
    ) : null;

    return (
        <div className={`w-full ${classNameContainer}`}>
            {/* Label */}
            {title && (
                <label
                    htmlFor={`select-${title}`}
                    className="text-sm text-start text-cell-primary flex items-center gap-1 mb-2 font-medium"
                >
                    <span>{t(title)}</span>
                    {isOption && (
                        <span className="text-sm text-cell-secondary flex items-center gap-1">
                            ({t("Option")}) <FaCircleInfo className="text-cell-secondary" size={15} />
                        </span>
                    )}
                </label>
            )}

            {/* Custom Input/Tags Area */}
            <div className="relative">
                <div
                    ref={inputContainerRef} // Ref to calculate Portal position
                    onClick={() => setIsDropdownOpen(true)}
                    className={variant === "chart" 
                        ? `flex items-center justify-between gap-2 h-9 bg-status-bg text-cell-primary w-full border border-status-border rounded-xl hover:border-primary-400 transition-all shadow-sm cursor-pointer px-3 ${classNameSelect || "text-xs font-medium"}` 
                        : `flex flex-wrap items-center gap-2 h-auto bg-status-bg text-cell-primary w-full border border-status-border rounded-xl ${classNameSelect ? classNameSelect : "py-2.5 px-4 text-sm"} shadow-sm cursor-text focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all`}
                >
                    {/* Tags (Selected Options) */}
                    <div className={variant === "chart" ? "flex items-center gap-1 font-medium text-cell-secondary truncate flex-nowrap" : "flex flex-wrap gap-1"}>
                        {selectedOptions.map((option) => (
                            variant === "chart" || (!multi) ? (
                                <span key={option.id} className="truncate">
                                    {t(option.value)}
                                </span>
                            ) : (
                                <div
                                    key={option.id}
                                    className="flex items-center space-x-2 bg-badge-bg gap-2 border border-status-border rounded-full px-3 py-1 text-xs"
                                >
                                    <span className="text-badge-text">{t(option.value)}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOption(option);
                                        }}
                                        className="text-badge-text hover:text-red-500 transition-colors"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            )
                        ))}
                    </div>

                    {/* Input for Search */}
                    <input
                        type="text"
                        placeholder={selectedOptions.length === 0 ? t(placeholder) : ""}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => {
                            setIsDropdownOpen(true);
                            calculateDropdownPosition();
                        }}
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                        className={`flex-grow bg-transparent focus:outline-none ${variant === "chart" ? "hidden" : "text-sm p-1 min-w-[100px]"}`}
                    />

                    {/* Dropdown Arrow */}
                    <div className="flex items-center flex-shrink-0">
                        <IoIosArrowDown className={`text-cell-secondary transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} size={variant === "chart" ? 14 : 16} />
                    </div>
                </div>
            </div>

            {/* عرض الـ Portal */}
            {dropdownPortal}

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

CustomSelect.propTypes = {
    title: PropTypes.string,
    isOption: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            value: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    classNameContainer: PropTypes.string,
    classNameSelect: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        value: PropTypes.string.isRequired,
    })),
    placeholder: PropTypes.string,
    error: PropTypes.string,
    multi: PropTypes.bool,
    variant: PropTypes.string,
};

export default CustomSelect;