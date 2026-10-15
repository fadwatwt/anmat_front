
import PropTypes from "prop-types";
import { TfiCalendar } from "react-icons/tfi";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

function DateInput({ className, id, classNameLabel, classNameInput, onChange, onBlur, title, name, value, isRequired, error }) {
    const { t, i18n } = useTranslation()
    const inputDateRef = useRef(null)
    const handelOpenPicker = () => {
        inputDateRef.current.showPicker()
    }
    return (
        <div className={`${title && "flex flex-col items-start gap-1 "} ` + className}>
            {title && (
                <p className={"text-sm text-cell-primary font-medium"}>
                    {t(title)}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </p>
            )}
            <label
                className={`flex w-full items-center text-sm bg-status-bg border-2 rounded-xl focus-within:border-primary-400 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-500 text-cell-primary ${error ? "border-red-500" : "border-status-border"} ` + (classNameLabel ? classNameLabel : "pl-2 px-2")}
                htmlFor={id}>
                <TfiCalendar className={"cursor-pointer text-cell-secondary"} onClick={handelOpenPicker} size={18} />
                <input ref={inputDateRef} type={"date"} className={`custom-date-input bg-transparent w-full ${classNameInput ? classNameInput : "py-3 px-2"} outline-none appearance-none focus:outline-none peer text-cell-primary ` + (i18n.language === 'ar' && "text-end")} name={name} value={value}
                    onChange={onChange} onBlur={onBlur} aria-invalid={Boolean(error)} />
            </label>
            {error && <p role="alert" className="text-red-500 text-xs mt-1">{error}</p>}

        </div>
    );
}

DateInput.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    classNameLabel: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    title: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    classNameInput: PropTypes.string,
    isRequired: PropTypes.bool,
    error: PropTypes.string,
}

export default DateInput;
