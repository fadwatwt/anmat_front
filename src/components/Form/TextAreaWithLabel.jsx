import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function TextAreaWithLabel({ title, placeholder, className, value, name, onChange, rows = 6, maxLength, isOptional = false, error, onBlur }) {
    const { t } = useTranslation()

    return (
        <div className={`flex flex-col gap-1 w-full items-start  ${className}`}>
            <label className={"text-gray-900 dark:text-gray-200 text-sm font-medium"}>
                {t(title)}
                {isOptional && <span className="text-gray-400 font-normal mx-1">({t("Optional")})</span>}
            </label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                rows={rows}
                maxLength={maxLength}
                placeholder={`${t(placeholder)}...`}
                className={`py-3 px-2 text-sm dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl w-full focus:outline-none focus:border-blue-500 dark:text-gray-200 resize-none ${error ? 'border-red-500' : ''}`}
            >
            </textarea>
            <div className="w-full flex justify-between items-center">
                {error ? <p className="text-red-500 text-xs mt-1">{error}</p> : <div></div>}
                {maxLength && (
                    <span className="text-xs text-gray-400">
                        {value?.length || 0}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
}

TextAreaWithLabel.propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    rows: PropTypes.number,
    maxLength: PropTypes.number,
    isOptional: PropTypes.bool,
    error: PropTypes.string
}

export default TextAreaWithLabel;