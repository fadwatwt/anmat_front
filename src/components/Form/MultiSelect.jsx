import PropTypes from "prop-types";
import { IoIosArrowDown } from "react-icons/io";
import { FaCircleInfo } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import {useTranslation} from "react-i18next";

function MultiSelect({
  title,
  options,
  onChange,
  classNameContainer = "",
  classNameSelect = "",
  isOption = false,
  value = [],
  placeholder = "Select",
  error,
  multi = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const {t} = useTranslation()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (selectedValue) => {
    if (multi) {
      const newValue = value.includes(selectedValue)
        ? value.filter((v) => v !== selectedValue) // Remove ID
        : [...value, selectedValue]; // Add ID

      onChange([...newValue]); // Ensure it's an array
    } else {
      onChange(selectedValue);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${classNameContainer}`} ref={selectRef}>
      {title && (
        <label className="text-sm text-gray-700 flex items-center gap-1 mb-2 dark:text-gray-200">
          <span>{title}</span>
          {isOption && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              ({t("Option")}){" "}
              <FaCircleInfo className="text-gray-400" size={14} />
            </span>
          )}
        </label>
      )}

      {/* Select Box */}
      <div
        className={`flex justify-between items-center w-full border border-gray-300 dark:border-gray-500 rounded-lg bg-white text-gray-600 px-3 py-2 cursor-pointer shadow-sm dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${classNameSelect}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {multi
            ? value.length > 0
              ? options
                  .filter((opt) => value.includes(opt.id))
                  .map((opt) => opt.value)
                  .join(", ")
              : placeholder
            : options.find((opt) => opt.id === value)?.value || placeholder}
        </span>
        <IoIosArrowDown className="text-gray-500" />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleChange(option.id)}
            >
              {multi && (
                <input
                  type="checkbox"
                  checked={value.includes(option.id)}
                  onChange={() => handleChange(option.id)}
                  className="w-4 h-4 accent-blue-500"
                />
              )}
              <span className="text-sm">{option.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

MultiSelect.propTypes = {
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
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  multi: PropTypes.bool,
};

export default MultiSelect;
