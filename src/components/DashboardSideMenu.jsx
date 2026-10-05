"use client";

import PropTypes from 'prop-types';
import SearchInput from "./Form/SearchInput.jsx";
import MenuItem from "./Menu/MenuItem.jsx";
import { useTranslation } from "react-i18next";
import React, { useState, useMemo } from "react"
import { HambergerMenu, ArrowDown2 } from 'iconsax-react';
import { dashboardSideMenuItems } from '@/config/menuItems.js';
import { useSelector } from 'react-redux';
import { selectUserType, selectPermissions, selectPermissionsLoaded, selectSocialMediaGrants } from '@/redux/auth/authSlice';

const STORAGE_KEY = 'sidebar-collapsed-sections';

const loadCollapsedSections = () => {
    if (typeof window === 'undefined') return {};
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; } // eslint-disable-line no-unused-vars
};

const saveCollapsedSections = (state) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* empty */ } // eslint-disable-line no-unused-vars
};

const sectionTourMap = {
    'Overview': 'menu-overview',
    'Work Management': 'menu-work',
    'Team & Communication': 'menu-team',
    'Insights & AI': 'menu-analytics',
    'Administration & Settings': 'menu-ai',
};

// دمج الأقسام العشرة في 5 مجموعات لتقليل الحمل المعرفي
const SECTION_GROUP_MAP = {
    'Overview': 'Overview',
    'My Work': 'Work Management',
    'Work Management': 'Work Management',
    'Team Management': 'Team & Communication',
    'Internal Communication': 'Team & Communication',
    'Content Management': 'Team & Communication',
    'Reports & Analytics': 'Insights & AI',
    'Smart Tools': 'Insights & AI',
    'System Administration': 'Administration & Settings',
    'Subscriptions & Payments': 'Administration & Settings',
    'Administration': 'Administration & Settings',
    'Support': 'Administration & Settings',
    'Settings': 'Administration & Settings',
};

const SectionHeader = ({ title, isCollapsed, onToggle }) => {
    const { t } = useTranslation();
    if (!title) return null;
    const tourAttr = sectionTourMap[title] ? { 'data-tour': sectionTourMap[title] } : {};
    return (
        <button
            type="button"
            {...tourAttr}
            onClick={onToggle}
            aria-expanded={!isCollapsed}
            className="w-[calc(100%-16px)] px-4 pt-4 pb-1.5 mx-2 flex items-center justify-between cursor-pointer select-none group/section hover:bg-status-bg rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
        >
            <span className="text-xs font-semibold text-cell-secondary">
                {t(title)}
            </span>
            <ArrowDown2
                size={14}
                className={`text-cell-secondary transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
            />
        </button>
    );
};

SectionHeader.propTypes = {
    title: PropTypes.string,
    isCollapsed: PropTypes.bool,
    onToggle: PropTypes.func,
};

const Menu = React.memo(({ isSlidebarOpen, toggleSlidebarOpen }) => {

    const authUserType = useSelector(selectUserType);
    const userPermissions = useSelector(selectPermissions);
    const permissionsLoaded = useSelector(selectPermissionsLoaded);
    const socialMediaGrants = useSelector(selectSocialMediaGrants);
    const hasWildcard = Array.isArray(userPermissions) && userPermissions.includes('*');

    const [collapsedSections, setCollapsedSections] = useState(loadCollapsedSections);

    const userHasPermission = (perm) =>
        Array.isArray(userPermissions) && userPermissions.includes(perm);

    // A menu item targets social media management when it declares any
    // social_media_* permission.
    const isSocialMediaItem = (item) =>
        (Array.isArray(item.permission_any_of) &&
            item.permission_any_of.some((p) => String(p).startsWith('social_media_'))) ||
        (item.permission && String(item.permission).startsWith('social_media_'));

    // Twitter is the only platform currently implemented; subscribers are
    // blocked from social media features until an admin grants them access.
    const hasSocialMediaGrant = () => {
        if (authUserType !== 'Subscriber' && authUserType !== 'Employee') return true;
        return Array.isArray(socialMediaGrants) && socialMediaGrants.includes('twitter');
    };

    const isItemAllowed = (item) => {
        if (!item.allowed_to || !item.allowed_to.includes(authUserType)) return false;
        if (isSocialMediaItem(item) && !hasSocialMediaGrant()) return false;
        if (hasWildcard) return true;

        const hasSingle = item.permission ? userHasPermission(item.permission) : null;
        const hasAny = Array.isArray(item.permission_any_of) && item.permission_any_of.length > 0
            ? item.permission_any_of.some(userHasPermission)
            : null;

        // No permission constraint declared → allowed for the user type.
        if (hasSingle === null && hasAny === null) return true;
        // Either constraint is enough.
        return Boolean(hasSingle) || Boolean(hasAny);
    };

    const filterItem = (item) => {
        if (!isItemAllowed(item)) return null;
        if (!Array.isArray(item.children) || item.children.length === 0) return item;

        const visibleChildren = item.children.filter((child) => {
            // Children inherit allowed_to from parent unless overridden.
            const merged = { allowed_to: item.allowed_to, ...child };
            return isItemAllowed(merged);
        });

        // Hide a parent that ends up with no visible children once it had some.
        if (item.children.length > 0 && visibleChildren.length === 0) return null;
        return { ...item, children: visibleChildren };
    };

    const toggleSection = (sectionName) => {
        setCollapsedSections((prev) => {
            const next = { ...prev, [sectionName]: !prev[sectionName] };
            saveCollapsedSections(next);
            return next;
        });
    };

    const sections = useMemo(() => {
        if (!permissionsLoaded) return [];

        const filteredItems = dashboardSideMenuItems
            .map(filterItem)
            .filter(Boolean);

        // Group items by consolidated section (10 raw sections -> 5 groups)
        const grouped = [];
        let currentSection = null;

        for (const item of filteredItems) {
            const sectionName = SECTION_GROUP_MAP[item.section] || item.section || '';
            if (sectionName !== currentSection) {
                currentSection = sectionName;
                grouped.push({ name: sectionName, items: [] });
            }
            grouped[grouped.length - 1].items.push(item);
        }

        return grouped;
    }, [permissionsLoaded, authUserType, userPermissions, socialMediaGrants]);

    const { t, i18n } = useTranslation()

    return (
        <div
            data-tour="sidebar"
            className={`fixed md:relative top-0 bottom-0 z-[60] md:z-[20] flex flex-col w-[280px] md:w-[272px] max-w-[280px] md:max-w-[272px] h-screen bg-surface border-e transition-transform duration-300 ease-in-out gap-5 ${i18n.language === "ar" ? "right-0" : "left-0"} 
        ${isSlidebarOpen ? "translate-x-0" : (i18n.language === "ar" ? "translate-x-full" : "-translate-x-full")} 
        md:translate-x-0`}
        >
            <div className={" h-32 flex p-5 gap-2 border-b-2 items-center border-status-border"}>
                <div className={"profile-image"}>
                    <img src="/images/logo.png" alt={t("img")}
                        className={" w-10 h-10 rounded-full m-0 p-0"} />
                </div>
                <div className={"flex flex-col  gap-2 justify-center  "}>
                    <p className={"text-sm text-start truncate w-28 md:w-full"}>{t("Anmaat")}</p>
                    <p className={"text-xs text-cell-secondary truncate w-28 md:w-full"}>{t("Enterprise Management System")}</p>
                </div>
                {
                    isSlidebarOpen && (
                        <button className="inline-flex h-8 w-8 items-center p-2 text-sm text-cell-secondary rounded-lg md:hidden hover:bg-status-bg focus:outline-none focus:ring-2 focus:ring-status-border"
                            onClick={toggleSlidebarOpen}>
                            <HambergerMenu />
                        </button>
                    )
                }

            </div>
            <div className={"overflow-y-auto flex flex-col  tab-content justify-between"}>
                <div className="md:hidden px-5 pt-5">
                    <SearchInput />
                </div>
                <div className={"flex  flex-col gap-2"}>
                    <div className={"py-5 menu-list sm:py-0 flex flex-col gap-2 text-cell-secondary"}>
                        {sections.map((section) => {
                            const isCollapsed = !!collapsedSections[section.name];
                            return (
                                <div key={section.name}>
                                    {section.name && (
                                        <SectionHeader
                                            title={section.name}
                                            isCollapsed={isCollapsed}
                                            onToggle={() => toggleSection(section.name)}
                                        />
                                    )}
                                    {!isCollapsed && section.items.map((item, index) => (
                                        <MenuItem
                                            key={index}
                                            path={item.path}
                                            icon={item.icon}
                                            title={item.title}
                                            children={item.children}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
});

Menu.propTypes = {
    isSlidebarOpen: PropTypes.bool,
    toggleSlidebarOpen: PropTypes.func,
};

Menu.displayName = "MenuComponent"

export default React.memo(Menu);
