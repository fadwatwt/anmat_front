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
    <div className={`flex flex-col gap-1.5 w-full items-start ${className}`}>
      <label className="text-cell-primary text-sm font-medium">
        {t(title)}{isRequired && <span className={"text-red-500"} aria-hidden="true"> *</span>}
      </label>
      <input
        type={type}
        disabled={disabled}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        placeholder={placeholder ? t(placeholder) : undefined}
        aria-invalid={Boolean(error)}
        className={`py-2.5 px-3 text-sm bg-surface border border-status-border rounded-xl w-full focus:outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/20 text-cell-primary placeholder:text-cell-secondary/60 disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          }`}
        {...rest}
      />
      {error && <p role="alert" className="text-red-500 text-xs mt-0.5">{error}</p>}
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