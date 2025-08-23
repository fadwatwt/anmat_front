import PropTypes from "prop-types";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";

function SelectAndLabel({
  className,
  title,
  name,
  value,
  options,
  onChange,
  onBlur,
  error,
  placeholder,
  isRequired,
  isMultiple = false
}) {
  const { t,i18n } = useTranslation();

  return (
    <div className={`relative flex flex-col gap-1 w-full items-start ${className}`}>
      <label className="text-gray-900 dark:text-gray-200 text-sm">
        {t(title)}{isRequired && <span className={"text-red-500 ms-1"}>*</span>}
      </label>
      <div className="relative w-full">
        <select
          name={name}
          value={value} // Controlled component
          onChange={(e) => {
             options.find(
              (opt) => opt._id === e.target.value
            );
            onChange(e.target.value); // Send _id to backend
          }}
          onBlur={onBlur}
          className={`py-3 px-2 text-sm dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl w-full focus:outline-none focus:border-blue-500 dark:text-gray-200
            appearance-none transition-all
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-soft-200 dark:border-gray-600 focus:ring-primary"
            }`}
            multiple={isMultiple}
        >
          <option key="placeholder" value="" disabled>
            {placeholder ? t(placeholder) : t(title)}
          </option>
          {options?.map((option) => (
            <option key={option._id || option.id || option.value || option.name} value={option._id || option.id || option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <div className={`absolute inset-y-0 ${i18n.language === 'ar' ? "left-1 " :"right-3"}  flex items-center pointer-events-none`}>
          <IoIosArrowDown />
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

SelectAndLabel.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired, // Ensure it's controlled
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string, // New placeholder prop
  isRequired: PropTypes.bool,
  isMultiple: PropTypes.bool
};

export default SelectAndLabel;
