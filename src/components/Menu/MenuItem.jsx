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
        <div className={`flex gap-1 w-11/12 items-center p-3 rounded-lg transition-all
            ${isActive ? 'bg-primary-100' : 'group-hover:bg-[#EBF1FF]'} 
            dark:group-hover:bg-primary-700 hover:text-black`}>
            {icon && React.cloneElement(icon, {
                size: 25,
                color: `${isActive ? '#375DFB' : '#504e4e'}`,
            })}
            <p className={`text-sm flex-1 dark:text-gray-300 ${isActive ? 'text-primary-600 ' : ''}`}>
                {t(title)}
            </p>
            {children && (
                <ArrowDown2
                    size={16}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            )}
        </div>
    );

    return (
        <div className="w-full">
            <div className={`menu-item flex gap-2 items-center group w-full ${isActive ? 'active' : ''}`}>
                <div className={`w-1 h-6 rounded-br-lg rounded-tr-lg ${isActive ? 'bg-primary-500' : 'group-hover:bg-primary-500'}`}></div>

                {children ? (
                    <div onClick={handleToggle} className="flex-1 text-black cursor-pointer">
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
                    <div className="bg-[#F4F7FF] dark:bg-gray-700 rounded-lg p-2 mr-4">
                        {children.map((child, index) => {
                            const isSubActive = pathname === child.path;
                            return (
                                <Link
                                    key={index}
                                    href={child.path}
                                    className={`block text-black p-2 text-sm rounded-md transition-colors
                                        ${isSubActive
                                        ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-300 hover:bg-blue-50'}`}
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