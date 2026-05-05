'use client'
import Switch2 from "./Switch2";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function SwitchWithLabel({ title, description, isOn, handleToggle, className = "" }) {
    const { t } = useTranslation();
    
    return (
        <div className={`flex items-center justify-between p-3 bg-status-bg rounded-xl border border-status-border ${className}`}>
            <div className="flex flex-col text-start">
                <span className="text-sm font-medium text-cell-primary">{t(title)}</span>
                {description && (
                    <p className="text-[10px] text-cell-secondary">{t(description)}</p>
                )}
            </div>
            <Switch2
                className="h-5 w-10"
                isOn={isOn}
                handleToggle={handleToggle}
            />
        </div>
    );
}

SwitchWithLabel.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    isOn: PropTypes.bool.isRequired,
    handleToggle: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default SwitchWithLabel;
