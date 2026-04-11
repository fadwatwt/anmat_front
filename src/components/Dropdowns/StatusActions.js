
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import React from "react";

function StatusActions({ states, className }) {
    const { t } = useTranslation()
    return (
        <div
            className={`absolute z-100 flex flex-col mt-2 bg-surface shadow-lg rounded-lg border border-status-border ${className}`}>
            {
                states?.map((status, index) => (
                    <button
                        key={index}
                        onClick={status.onClick}
                        className="p-3 text-sm border-b border-status-border text-cell-primary flex items-center text-left hover:bg-status-bg transition-colors"
                    >
                        {
                            status?.icon && React.cloneElement(status.icon, {
                                size: 18,
                                className: `${status.icon.props.className || ""} text-gray-500 w-10`
                            })
                        }
                        {t(status.text)}
                    </button>
                ))
            }

        </div>
    );
}

StatusActions.propTypes = {
    states: PropTypes.array,
    className: PropTypes.string,
}

export default StatusActions;