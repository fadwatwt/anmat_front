import {MdArrowForwardIos} from "react-icons/md";
import PropTypes from "prop-types";
import React from "react";
import * as propTypes from "prop-types";
import {useTranslation} from "react-i18next";

function Sidebar({list, onClick,activeItem}) {
    const {t} = useTranslation()
    return (
        <div className={"flex flex-col gap-2"}>
            {
                list.map((item, index) => (
                    <div key={index} onClick={() => onClick(item.id)}
                         className={`flex group dark:hover:bg-gray-900 ${activeItem === item.id ? "dark:bg-gray-900" :""} py-2 px-3 cursor-pointer rounded-lg justify-between items-end ${activeItem === item.title && "bg-gray-50" }`}>
                        <div className={"flex gap-2 items-center"}>
                            {item.icon && React.cloneElement(item.icon, {
                                size: 15,
                                className: activeItem === item.id ? "text-primary-500 dark:text-primary-200" : "text-gray-600"
                            })}
                            <p className={`text-sm ${activeItem === item.id ? "text-black dark:text-gray-200" :"dark:text-gray-400"}`}>{t(item.title)}</p>
                        </div>
                        {activeItem === item.id ?
                            <div className={"p-1 bg-white dark:bg-gray-800 rounded-full"}>
                                <MdArrowForwardIos size={10}/>
                            </div>
                            : null
                        }
                    </div>
                ))
            }
        </div>
    );
}


Sidebar.propTypes = {
    list: PropTypes.array.isRequired,
    activeItem: propTypes.bool,
    onClick: PropTypes.func,
}

export default Sidebar;