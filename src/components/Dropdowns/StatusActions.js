
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import React from "react";

function StatusActions({states,className}) {
    const {t} = useTranslation()
    return (
        <div
            className={`absolute z-100 flex flex-col  mt-2 w-40 bg-white dark:bg-white-0 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
            {
                states?.map((status,index) => (
                    <button
                        key={index}
                        onClick={status.onClick}
                        className="w-full px-3 py-3 text-sm border-b dark:border-gray-700 dark:text-gray-200 flex gap-2 items-center text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
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