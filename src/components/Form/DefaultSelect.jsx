import PropTypes from "prop-types";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { FaCircleInfo } from "react-icons/fa6";

function DefaultSelect({
  title,
  options,
  onChange,
  classNameContainer = "",
  classNameSelect = "",
  isOption = false,
  value = "",
  placeholder = "Select",
  error,
  multi = false, // NEW: Multi-select support
}) {
  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    const selectedValues = multi
      ? Array.from(e.target.selectedOptions, (option) => option.value) // Multi-select handling
      : e.target.value;

    onChange(selectedValues);
  };

  return (
    <div className={`w-full ${classNameContainer}`}>
      {title && (
        <label
          htmlFor={`select-${title}`}
          className="text-sm text-start text-gray-700 flex items-center gap-1 mb-2 dark:text-gray-200"
        >
          <span>{t(title)}</span>
          {isOption && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              ({t("Option")}){" "}
              <FaCircleInfo className="text-gray-400" size={15} />
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          multiple={multi} // NEW: Enables multi-selection when needed
          onChange={handleChange}
          id={`select-${title}`}
          aria-label={title || "select-input"}
          className={`appearance-none box-border dark:bg-gray-800 dark:text-gray-100 w-full border border-gray-300 dark:border-gray-500 rounded-lg bg-white ${
            classNameSelect
              ? classNameSelect
              : "text-gray-600 py-2 px-3 text-sm"
          } shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          value={multi ? value || [] : value} // Ensure correct value binding
        >
          {!multi && (
            <option disabled value="">
              {t(placeholder)}
            </option>
          )}
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {t(option.value)}
            </option>
          ))}
        </select>
        <div
          className={`absolute inset-y-0 ${
            i18n.language === "ar" ? "left-3" : "right-3"
          } flex items-center pointer-events-none`}
        >
          <IoIosArrowDown className="text-gray-500" />
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

DefaultSelect.propTypes = {
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
    PropTypes.array, // NEW: Support for multi-select values
  ]),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  multi: PropTypes.bool, // NEW: Prop for enabling multi-select
};

export default DefaultSelect;
