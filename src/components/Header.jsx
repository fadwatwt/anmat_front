"use client"

import SearchInput from "./Form/SearchInput.jsx";

import { FiSun, FiMoon } from "react-icons/fi";
import React from "react";

import PropTypes from "prop-types";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useSelector } from "react-redux";
import { selectNotifications, selectUnreadCount } from "@/redux/notifications/notificationsSlice";
import NotificationsDropdown from "./Dropdowns/NotificationsDropdown.jsx";
import MessagesDropdown from "./Dropdowns/MessagesDropdown.jsx";
import HeaderUserMenu from "./Dropdowns/HeaderUserMenu.jsx";
import { useTheme } from "@/app/providers";
import { useTranslation } from "react-i18next";

const Header = React.memo(({ taggleSlidebarOpen, className }) => {
  const { t, i18n } = useTranslation();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <div
      className={
        "header bg-surface max-w-full h-[72px] flex px-3 sm:px-4 md:px-8 items-center justify-between relative border-b dark:border-gray-700 z-50 " +
        className
      }
    >
      <button
        onClick={taggleSlidebarOpen}
        className="inline-flex items-center p-2 text-sm h-8 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <HiOutlineMenuAlt2 />
      </button>
      <div className="hidden md:block">
        <SearchInput />
      </div>
      <div className={"flex gap-2 sm:gap-5"}>
        <div className={"icons flex gap-1 sm:gap-2 items-center relative w-auto justify-end"}>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-cell-secondary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={theme === "dark" ? t("Switch to Light Mode") : t("Switch to Dark Mode")}
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg text-cell-secondary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            title={i18n.language === "ar" ? t("English") : t("Arabic")}
          >
            {i18n.language === "ar" ? t("EN") : t("AR")}
          </button>
          <NotificationsDropdown notifications={notifications} unreadCount={unreadCount} />
          <MessagesDropdown />
        </div>

        {/* User Profile Section */}
        <HeaderUserMenu />
      </div>
    </div>
  );
});

Header.displayName = "HeaderComponent"

Header.propTypes = {
  taggleSlidebarOpen: PropTypes.func,
  className: PropTypes.string,
};

export default Header;
