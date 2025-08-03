"use client";

import PropTypes from 'prop-types';
import SearchInput from "./Form/SearchInput.jsx";
import MenuItem from "./Menu/MenuItem.jsx";
import { useTranslation } from "react-i18next";
import React from "react"
import {  HambergerMenu } from 'iconsax-react';
import { dashboardSideMenuItems } from '@/config/menuItems.js';
import useAuthStore from '@/store/authStore.js';

const Menu = React.memo(({ isSlidebarOpen, toggleSlidebarOpen }) => {

    const { authUserType } = useAuthStore();

    // const [authUserType, setAuthUserType] = useState('admin');
    const { t, i18n } = useTranslation()
    // Try to change user type to see the effect of dynamic reload elements
    // allowed user types: ['Admin', 'Company-Manager', 'Employee']

    return (
        <div
            className={`md:relative md:translate-x-0 min-h--[100vh] bg-white dark:bg-gray-800 w-[272px] max-w-[272px] 
        h-screen fixed flex flex-col gap-5 top-0 z-40 transition-transform 
        ${i18n.language === "ar" ? "right-0" : "left-0"} 
        ${isSlidebarOpen ? "translate-x-0" : (i18n.language === "ar" ? "translate-x-full" : "-translate-x-full")}`}
        >
            <div className={" h-32 flex p-5 gap-2 border-b-2 dark:border-gray-600 items-center"}>
                <div className={"profile-image"}>
                    <img src="/images/logo.png" alt={"img"}
                        className={" w-10 h-10 rounded-full m-0 p-0"} />
                </div>
                <div className={"flex flex-col  gap-2 justify-center  "}>
                    <p className={"text-sm dark:text-white text-start truncate w-28 md:w-full"}>{t("Employees Management")}</p>
                    <p className={"text-xs dark:text-white text-gray-500 truncate w-28 md:w-full"}>{t("Employees & HR Management")}</p>
                </div>
                {
                    isSlidebarOpen && (
                        <button className="inline-flex h-8 w-8 items-center p-2 text-sm text-gray-500
                            rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                    <div className={"py-5 menu-list sm:py-0 flex flex-col gap-2 text-gray-500"}>
                        {
                            dashboardSideMenuItems.filter(item => item.allowed_to.includes(authUserType)).map((item,index) => {
                                return (<MenuItem key={index} path={item.path} icon={item.icon} title={item.title} ></MenuItem>);
                            })
                        }
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