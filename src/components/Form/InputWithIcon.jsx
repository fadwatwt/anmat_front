import React from 'react';
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function InputWithIcon({title,icon,id,name,type,onChange,value,placeholder,isRequired=false}) {
    const {t,i18n} = useTranslation()
    return (
        <div className={"flex flex-col items-start gap-2 w-full"}>
            <p className={"text-sm dark:text-white text-black"}> {t(title)} {isRequired && <span className={"text-red-500"}>*</span>}</p>
            <label
                className={"flex bg-white pl-2 px-2 w-full items-center text-xs dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl  focus:outline-none focus:border-blue-500 dark:text-gray-200 "}
                htmlFor={id && ""}>
                {
                    icon && React.cloneElement(icon, {
                        size: 18,
                        className:  "text-gray-500 w-10"
                    })
                }
                <input
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={" custom-date-input dark:bg-white-0 w-full py-3 px-2 outline-none appearance-none focus:outline-none peer " + (i18n.language === 'ar' && "text-end")}
                    name={name}
                />
            </label>

        </div>
    );
}

InputWithIcon.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    id: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool
}

export default InputWithIcon;