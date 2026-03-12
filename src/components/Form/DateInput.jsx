
import PropTypes from "prop-types";
import { TfiCalendar } from "react-icons/tfi";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

function DateInput({ className, id, classNameLabel, classNameInput, onChange, title, name, value, isRequired }) {
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
                className={"flex w-full items-center text-sm bg-status-bg border-status-border border-2 rounded-xl focus-within:border-primary-400 text-cell-primary " + (classNameLabel ? classNameLabel : "pl-2 px-2")}
                htmlFor={id}>
                <TfiCalendar className={"cursor-pointer text-cell-secondary"} onClick={handelOpenPicker} size={18} />
                <input ref={inputDateRef} type={"date"} className={`custom-date-input bg-transparent w-full ${classNameInput ? classNameInput : "py-3 px-2"} outline-none appearance-none focus:outline-none peer text-cell-primary ` + (i18n.language === 'ar' && "text-end")} name={name} value={value}
                    onChange={onChange} />
            </label>

        </div>
    );
}

DateInput.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    classNameLabel: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    classNameInput: PropTypes.string,
    isRequired: PropTypes.bool,
}

export default DateInput;