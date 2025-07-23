import Link from 'next/link'
import React from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import { usePathname } from 'next/navigation';

function MenuItem({path,icon,title}) {
    const {t} = useTranslation()
    const pathname = usePathname()
    const isActive = pathname === path;
    const [isHovered, setIsHovered] = React.useState(false);
    const iconElement = typeof icon === 'function'
      ? icon({ active: isActive, hover: isHovered && !isActive })
      : icon && React.cloneElement(icon, {
          size: 25,
          color:`${isActive ? '#375DFB' : '#504e4e'}`,
        });
    return (
        <Link href={path} className={"menu-item flex gap-2 items-center group w-full" + `${isActive ? ' active' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
            <div className={"group-hover:bg-primary-500 w-1 h-6 rounded-br-lg rounded-tr-lg group-[.active]:bg-primary-500"}></div>
            <div
                className={"flex gap-1 w-11/12 items-center p-3 group-hover:bg-[#EBF1FF] dark:group-hover:bg-primary-700 cursor-pointer hover:text-black rounded-lg group-[.active]:bg-primary-100"}>
                {iconElement}
                <p
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: isActive ? '#23272F' : '#525866',
                  }}
                >{t(title)}</p>
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