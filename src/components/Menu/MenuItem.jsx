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
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window !== 'undefined' && children) {
            const saved = localStorage.getItem(`sidebar-menu-${title}`);
            if (saved !== null) return JSON.parse(saved);
        }
        return isChildActive;
    });

    const isActive = pathname === path || isChildActive;

    const handleToggle = (e) => {
        if (children) {
            e.preventDefault();
            const newState = !isOpen;
            setIsOpen(newState);
            try {
                localStorage.setItem(`sidebar-menu-${title}`, JSON.stringify(newState));
            } catch (e) { /* empty */ } // eslint-disable-line no-unused-vars
        }
    };

    const ItemContent = (
        <div className={`flex gap-2.5 w-full items-center px-3 py-2.5 rounded-xl transition-colors
            ${isActive ? 'bg-menu-active-bg' : 'hover:bg-status-bg'} focus-visible:outline-none`}>
            {icon && React.cloneElement(icon, {
                size: 20,
                color: `${isActive ? 'var(--menu-active-text)' : 'var(--menu-icon)'}`,
            })}
            <p className={`text-sm flex-1 truncate ${isActive ? 'text-menu-active-text font-semibold' : 'text-cell-secondary'}`}>
                {t(title)}
            </p>
            {children && (
                <ArrowDown2
                    size={16}
                    className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            )}
        </div>
    );

    return (
        <div className="w-full px-2">
            <div className={`menu-item flex gap-2 items-center group w-full rounded-xl ${isActive ? 'active' : ''}`}>
                <div className={`w-1 h-6 rounded-full shrink-0 transition-colors ${isActive ? 'bg-primary-base' : 'bg-transparent'}`}></div>

                {children ? (
                    <div onClick={handleToggle} className="flex-1 text-cell-primary cursor-pointer">
                        {ItemContent}
                    </div>
                ) : (
                    <Link href={path} className="flex-1">
                        {ItemContent}
                    </Link>
                )}
            </div>

            {children && (
                <div className={`ms-4 mt-1 flex flex-col gap-1 overflow-hidden transition-all duration-300 
                    ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-status-bg border border-status-border rounded-xl p-1.5 me-2">
                        {children.map((child, index) => {
                            const isSubActive = pathname === child.path;
                            return (
                                <Link
                                    key={index}
                                    href={child.path}
                                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${isSubActive
                                            ? 'bg-surface text-primary-600 dark:text-primary-200 shadow-sm font-semibold'
                                            : 'text-cell-secondary hover:bg-surface hover:text-cell-primary'}`}
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