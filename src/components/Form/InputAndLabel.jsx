'use client'
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function InputAndLabel({
  title,
  placeholder,
  disabled = false,
  type,
  className,
  value,
  name,
  onChange,
  onBlur,
  error,
  isRequired,
  ...rest
}) {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col gap-1 w-full items-start ${className}`}>
      <label className="text-gray-900 dark:text-gray-200 text-sm">
        {t(title)}{isRequired && <span className={"text-red-500"}>*</span>}
      </label>
      <input
        type={type}
        disabled={disabled}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        placeholder={`${t(placeholder)}...`}
        className={`py-3 px-2 text-sm dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl w-full focus:outline-none focus:border-blue-500 dark:text-gray-200 ${error ? "border-red-500" : ""
          }`}
        {...rest}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

InputAndLabel.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  onBlur: PropTypes.func,
  error: PropTypes.string,

}

export default InputAndLabel;