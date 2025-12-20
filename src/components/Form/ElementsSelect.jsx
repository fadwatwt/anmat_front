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
                        }) {
  const [selectedOptions, setSelectedOptions] = useState(
      Array.isArray(defaultValue) ? defaultValue : []
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();
  const dropdownRef = useRef(null); // يستخدم للإغلاق عند النقر خارج الـ component
  const selectTriggerRef = useRef(null); // 👈 يستخدم لحساب موقع زر الفتح
  const [dropdownStyle, setDropdownStyle] = useState({});

  const toggleOptions = (option) => {
    const alreadySelected = selectedOptions.find((u) => u.id === option.id);
    const updatedSelection = alreadySelected
        ? selectedOptions.filter((u) => u.id !== option.id)
        : isMultiple
            ? [...selectedOptions, option]
            : [option];

    if (!isMultiple) {
      setIsDropdownOpen(false);
    }


    setSelectedOptions(updatedSelection);
    if (onChange) {
      onChange(updatedSelection);
    }
  };

  //
  const calculateDropdownPosition = () => {
    if (selectTriggerRef.current) {
      const rect = selectTriggerRef.current.getBoundingClientRect();

      setDropdownStyle({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      calculateDropdownPosition();
      window.addEventListener('resize', calculateDropdownPosition);
      window.addEventListener('scroll', calculateDropdownPosition);
    } else {
      window.removeEventListener('resize', calculateDropdownPosition);
      window.removeEventListener('scroll', calculateDropdownPosition);
    }

    return () => {
      window.removeEventListener('resize', calculateDropdownPosition);
      window.removeEventListener('scroll', calculateDropdownPosition);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <div className={classNameContainer}>
        {/* Label */}
        <label
            htmlFor="user-select"
            className="text-sm text-start text-gray-700 flex items-center gap-1 mb-2 dark:text-gray-200"
        >
          <span>{t(title)}</span>
          {isOption && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
            ({t("Option")}) <FaCircleInfo className="text-gray-400" size={15} />
          </span>
          )}
        </label>

        <div className=" max-w-full w-full relative">
          <div
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                calculateDropdownPosition();
              }}
              ref={selectTriggerRef}
              className="flex items-center gap-2 h-10 dark:bg-white-0 border border-gray-300 dark:border-gray-500 rounded-[10px] p-[10px] box-border text-xs cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
          >
            <div className="flex-1 flex gap-1 tab-content overflow-x-auto max-h-10">
              {selectedOptions.length > 0 ? (
                  selectedOptions?.map((option) => (
                      <div
                          key={option.id}
                          className={
                              isMultiple &&
                              `text-gray-800 rounded-md py-1 px-2 flex gap-1 items-center ` +
                              (classNameItemSelected ? classNameItemSelected : "border border-gray-200")
                          }
                      >
                        {option.element}
                        {isMultiple && isRemoveBtn && (
                            <FaTimes
                                className="ml-2 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleOptions(option);
                                }}
                            />
                        )}
                      </div>
                  ))
              ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                {t(placeholder)}...
              </span>
              )}
            </div>
            {/* Dropdown Arrow */}
            <IoIosArrowDown
                className="text-gray-500 dark:text-gray-400"
                size={16}
            />
          </div>

          {isDropdownOpen &&
              createPortal(
                  <div
                      ref={dropdownRef}
                      style={dropdownStyle}
                      className={`fixed z-[9999] overflow-auto bg-white dark:bg-white-0 border border-gray-300 dark:border-gray-500 p-2 rounded-2xl shadow-lg mt-1 max-h-60 overflow-y-auto ${dropDownClassName}`}
                  >
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="flex items-center text-sm p-2 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-900 cursor-pointer"
                            onClick={() => toggleOptions(option)}
                        >
                          {isMultiple && (
                              <input
                                  type="checkbox"
                                  checked={selectedOptions.some((u) => u.id === option.id)}
                                  readOnly
                                  className="mr-2 checkbox-custom"
                              />
                          )}
                          {option.element}
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
  // ... (نفس الـ propTypes كما كانت)
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
};

export default ElementsSelect;