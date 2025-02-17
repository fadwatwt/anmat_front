import PropTypes from "prop-types";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";

function SelectWithoutLabel({
  className,
  title,
  name,
  value,
  options,
  onChange,
  onBlur,
  error,
  placeholder,
}) {
  const { t } = useTranslation();

  return (
    <div className={`relative flex flex-col gap-1 ${className}`}>
      <div className="relative">
        <select
          name={name}
          value={value} // Controlled component
          onChange={(e) => {
            const selectedOption = options.find(
              (opt) => opt._id === e.target.value
            );
            onChange(e.target.value); // Send _id to backend
          }}
          onBlur={onBlur}
          className={`w-full p-2 text-sub-500 dark:text-gray-400 text-sm bg-transparent border rounded-lg appearance-none transition-all
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-soft-200 dark:border-gray-600 focus:ring-primary"
            }`}
        >
          <option value="" disabled>
            {placeholder ? t(placeholder) : t(title)}
          </option>
          {options?.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500">
          <IoIosArrowDown />
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

SelectWithoutLabel.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired, // Ensure it's controlled
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string, // New placeholder prop
};

export default SelectWithoutLabel;
