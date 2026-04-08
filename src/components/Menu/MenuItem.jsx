import Link from 'next/link'
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { usePathname } from 'next/navigation';
import { ArrowDown2 } from 'iconsax-react';

function MenuItem({ path, icon, title, children }) {
    const { t } = useTranslation();
    const pathname = usePathname();

    const isChildActive = children?.some(child => pathname === child.path);
    const [isOpen, setIsOpen] = useState(isChildActive);

    const isActive = pathname === path || isChildActive;

    const handleToggle = (e) => {
        if (children) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    const ItemContent = (
        <div className={`flex gap-1 w-11/12 items-center p-3 rounded-lg transition-all duration-200
            ${isActive ? 'bg-menu-active-bg shadow-sm' : 'group-hover:bg-primary-100 dark:group-hover:bg-primary-100/10'} 
            hover:text-primary-600 dark:hover:text-primary-400`}>
            {icon && React.cloneElement(icon, {
                size: 25,
                color: `${isActive ? 'var(--menu-active-text)' : 'var(--menu-icon)'}`,
                className: `${!isActive ? 'group-hover:text-primary-600 dark:group-hover:text-primary-400' : ''}`
            })}
            <p className={`text-sm flex-1 ${isActive ? 'text-menu-active-text' : 'dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}>
                {t(title)}
            </p>
            {children && (
                <ArrowDown2
                    size={16}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-menu-active-text' : 'group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}
                />
            )}
        </div>
    );

    return (
        <div className="w-full">
            <div className={`menu-item flex gap-2 items-center group w-full ${isActive ? 'active' : ''}`}>
                <div className={`w-1 h-6 rounded-br-lg rounded-tr-lg transition-all duration-300 ${isActive ? 'bg-primary-500' : 'group-hover:bg-primary-500'}`}></div>

                {children ? (
                    <div onClick={handleToggle} className="flex-1 cursor-pointer">
                        {ItemContent}
                    </div>
                ) : (
                    <Link href={path} className="flex-1">
                        {ItemContent}
                    </Link>
                )}
            </div>

            {children && (
                <div className={`ml-3 mt-1 flex flex-col gap-1 overflow-hidden transition-all duration-300 
                    ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-primary-100 dark:bg-primary-100/10 rounded-lg p-2 mr-4">
                        {children.map((child, index) => {
                            const isSubActive = pathname === child.path;
                            return (
                                <Link
                                    key={index}
                                    href={child.path}
                                    className={`block p-2 text-sm rounded-md transition-all duration-200
                                        ${isSubActive
                                            ? 'bg-surface text-primary-600 shadow-sm font-medium'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 hover:text-primary-600 dark:hover:text-primary-400'}`}
                                >
                                    {t(child.title)}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

MenuItem.propTypes = {
    path: PropTypes.string,
    icon: PropTypes.element,
    title: PropTypes.string,
    children: PropTypes.array,
};

export default MenuItem;