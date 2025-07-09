import Link from 'next/link'
import React from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import { usePathname } from 'next/navigation';

function MenuItem({path,icon,title}) {
    const {t} = useTranslation()
    const pathname = usePathname()
    return (
        <Link href={path} className={"menu-item flex gap-2 items-center group w-full" + `${pathname === path ? ' active' : ''}`}>
            <div className={"group-hover:bg-primary-500 w-1 h-6 rounded-br-lg rounded-tr-lg group-[.active]:bg-primary-500"}></div>
            <div
                className={"flex gap-1 w-11/12 items-center p-3 group-hover:bg-[#EBF1FF] dark:group-hover:bg-primary-700 cursor-pointer hover:text-black rounded-lg group-[.active]:bg-primary-100"}>
                {icon && React.cloneElement(icon, {
                    size: 25,
                    className: "dark:text-white dark:group-hover:text-primary-200"
                })}
                <p className={"dark:text-gray-300 text-sm dark:group-[.active]:text-primary-500 dark:group-hover:text-primary-200"}>{t(title)}</p>
            </div>
        </Link>
    );
}

MenuItem.propTypes = {
    path: PropTypes.string,
    icon: PropTypes.element,
    title: PropTypes.string,
};

export default MenuItem;