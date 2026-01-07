import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { RiTimeLine } from "@remixicon/react";

function TimeInput({ className, id, classNameLabel, classNameInput, onChange, title, name, value, isRequired = false, error }) {
    const { t, i18n } = useTranslation();
    const inputTimeRef = useRef(null);

    const handleOpenPicker = () => {
        if (inputTimeRef.current && inputTimeRef.current.showPicker) {
            inputTimeRef.current.showPicker();
        }
    };

    return (
        <div className={`${title && "flex flex-col items-start gap-2 "}${className || "w-full"}`}>
            {title && (
                <p className="text-sm dark:text-white text-gray-900">
                    {t(title)} {isRequired && <span className="text-red-500">*</span>}
                </p>
            )}
            <label
                className={`flex w-full items-center text-xs dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl focus-within:border-blue-500 dark:text-gray-200 ${
                    error ? "border-red-500" : ""
                } ${classNameLabel ? classNameLabel : "pl-2 px-2"}`}
                htmlFor={id}
            >
                <RiTimeLine 
                    className="cursor-pointer text-gray-500" 
                    onClick={handleOpenPicker} 
                    size={20} 
                />
                <input
                    ref={inputTimeRef}
                    type="time"
                    className={`custom-date-input dark:bg-white-0 w-full ${
                        classNameInput ? classNameInput : "py-3 px-2"
                    } outline-none appearance-none focus:outline-none peer ${
                        i18n.language === "ar" ? "text-end" : ""
                    }`}
                    name={name}
                    id={id}
                    value={value}
                    onChange={onChange}
                />
            </label>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

TimeInput.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    classNameLabel: PropTypes.string,
    classNameInput: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    isRequired: PropTypes.bool,
    error: PropTypes.string,
};

export default TimeInput;
