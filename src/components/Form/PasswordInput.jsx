import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { RiEyeLine, RiLock2Line } from "@remixicon/react";

function PasswordInput({ title, icon, id, name, onChange, onBlur, value, placeholder, isRequired = false, error }) {
    const { t, i18n } = useTranslation()
    const [showPassword, setShowPassword] = useState(false);
    const handelShowPassword = () => {
        setShowPassword(!showPassword)
    }
    return (
        <div className={"flex flex-col items-start gap-2 w-full"}>
            <p className={"text-sm font-medium text-cell-primary"}> {t(title)}{isRequired && <span className={"text-red-500"}>*</span>}</p>
            <label
                className={`flex bg-status-bg pl-2 px-2 w-full items-center text-xs border-2 border-status-border rounded-xl focus-within:border-primary-400 text-cell-primary ${error ? "border-red-500" : ""}`}
                htmlFor={id && ""}>
                {
                    icon ? React.cloneElement(icon, {
                        size: 18,
                        className: "text-cell-secondary w-10"
                    }) : <RiLock2Line className="text-cell-secondary" />
                }
                <input
                    placeholder={placeholder}
                    value={value}
                    type={showPassword ? "text" : "password"}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={" custom-date-input text-sm bg-transparent w-full py-3 px-2 outline-none appearance-none focus:outline-none peer placeholder:text-cell-secondary/50 " + (i18n.language === 'ar' && "text-start")}
                    name={name}
                />
                <RiEyeLine size={18} className="cursor-pointer text-cell-secondary hover:text-table-title transition-colors" onClick={handelShowPassword} />
            </label>
            {error && <span className="text-red-500 text-xs mt-1">{t(error)}</span>}
        </div>
    );
}

PasswordInput.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    id: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default PasswordInput;