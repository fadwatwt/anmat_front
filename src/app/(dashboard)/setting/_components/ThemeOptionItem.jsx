import React from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";


function ThemeOptionItem({title,description,icon,isActive,onClick}) {
    const {t} = useTranslation()
    return (
        <div onClick={onClick} className={`bg-status-bg flex rounded-xl gap-4 items-center cursor-pointer border ${isActive ? "border-primary-base" : "border-status-border"} p-3`}>
            <div className={"rounded-full p-2 border border-status-border text-cell-primary"}>
                {icon && React.cloneElement(icon, {
                    size: 20,
                    className:"text-cell-primary"
                })}
            </div>
            <div className={"flex flex-col text-start items-center w-full pr-2"}>
                <div className={"flex justify-between w-full items-center"}>
                    <p className={"text-cell-primary"}>{t(title)}</p>
                    {
                        isActive ? (
                            <div
                                className={"rounded-full w-4 h-4 bg-primary-500  flex items-center justify-center"}>
                                <div className={"w-2 h-2 bg-white rounded-full"}></div>
                            </div>
                        ) : <div className={"rounded-full w-4 h-4 bg-surface border-2 border-status-border flex items-center justify-center"}></div>
                    }

                </div>
                <p className={"text-sm text-cell-secondary text-start w-full"}>{t(description)}</p>
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
