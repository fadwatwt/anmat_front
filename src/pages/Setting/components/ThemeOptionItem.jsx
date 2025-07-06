import React from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";


function ThemeOptionItem({title,description,icon,isActive,onClick}) {
    const {t} = useTranslation()
    return (
        <div onClick={onClick} className={`bg-white shadow-md flex rounded-xl gap-4 items-center dark:bg-gray-800 cursor-pointer ${isActive && "border-2 border-primary-500" } p-3`}>
            <div className={"rounded-full p-2 border-2 border-gray-200 dark:border-gray-600"}>
                {icon && React.cloneElement(icon, {
                    size: 20,
                    className:"dark:text-gray-200"
                })}
            </div>
            <div className={"flex flex-col text-start items-center w-full pr-2"}>
                <div className={"flex justify-between w-full items-center"}>
                    <p className={"text-black dark:text-gray-200"}>{t(title)}</p>
                    {
                        isActive ? (
                            <div
                                className={"rounded-full w-4 h-4 bg-primary-500  flex items-center justify-center"}>
                                <div className={"w-2 h-2 bg-white rounded-full"}></div>
                            </div>
                        ) : <div className={"rounded-full w-4 h-4 bg-white dark:bg-gray-800 dark:border-gray-700 border-2 flex items-center justify-center shadow-md"}></div>
                    }

                </div>
                <p className={"text-sm text-gray-500 dark:text-gray-400 text-start w-full"}>{t(description)}</p>
            </div>
        </div>
    );
}

ThemeOptionItem.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.element,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
}

export default ThemeOptionItem;