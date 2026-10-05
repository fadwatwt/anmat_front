"use client"

import SearchInput from "./Form/SearchInput.jsx";

import { FiSun, FiMoon, FiCompass } from "react-icons/fi";
import React from "react";

import PropTypes from "prop-types";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { selectNotifications, selectUnreadCount } from "@/redux/notifications/notificationsSlice";
import NotificationsDropdown from "./Dropdowns/NotificationsDropdown.jsx";
import MessagesDropdown from "./Dropdowns/MessagesDropdown.jsx";
import HeaderUserMenu from "./Dropdowns/HeaderUserMenu.jsx";
import { useTheme } from "@/app/providers";
import { useTranslation } from "react-i18next";
import Alert from "./Alerts/Alert.jsx";

const Header = React.memo(({ taggleSlidebarOpen, toggleSlidebarOpen, className }) => {
  const { t, i18n } = useTranslation();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const [theme, setTheme] = useTheme();
  const pathname = usePathname();
  const [isTourConfirmOpen, setIsTourConfirmOpen] = React.useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleMenuClick = taggleSlidebarOpen || toggleSlidebarOpen;

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const handleTourRestart = () => {
    setIsTourConfirmOpen(true);
  };

  const confirmTourRestart = (confirmed) => {
    if (!confirmed) return;
    localStorage.removeItem("subscriber_dashboard_tour_completed");
    // يجب الانتقال للصفحة الرئيسية قبل بدء الشرح — عناصر الجولة موجودة فقط في /dashboard
    if (pathname !== "/dashboard") {
      window.location.href = "/dashboard";
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      data-tour="header"
      className={
        "header bg-surface max-w-full h-[72px] flex px-3 sm:px-4 md:px-8 items-center justify-between relative border-b border-status-border z-50 " +
        className
      }
    >
      <button
        onClick={handleMenuClick}
        className="inline-flex items-center justify-center p-2.5 h-10 w-10 text-cell-secondary rounded-xl md:hidden hover:bg-status-bg focus-visible:outline-none focus:ring-2 focus:ring-primary-base"
        aria-label={t("Open menu")}
      >
        <HiOutlineMenuAlt2 size={20} />
      </button>
      <div className="hidden md:block">
        <SearchInput />
      </div>
      <div className={"flex gap-2 sm:gap-4 items-center"}>
        <div className={"icons flex gap-1.5 sm:gap-2 items-center relative w-auto justify-end"}>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-cell-secondary hover:bg-status-bg transition-colors border border-transparent hover:border-status-border"
            title={theme === "dark" ? t("Switch to Light Mode") : t("Switch to Dark Mode")}
            aria-label={theme === "dark" ? t("Switch to Light Mode") : t("Switch to Dark Mode")}
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            onClick={toggleLanguage}
            className="px-3 py-2 rounded-xl text-cell-secondary hover:bg-status-bg transition-colors text-sm font-semibold border border-status-border min-w-[64px]"
            title={i18n.language === "ar" ? t("Switch to English") : t("التبديل إلى العربية")}
            aria-label={i18n.language === "ar" ? t("Switch to English") : t("التبديل إلى العربية")}
          >
            {i18n.language === "ar" ? t("English") : t("العربية")}
          </button>
          <NotificationsDropdown notifications={notifications} unreadCount={unreadCount} />
          <MessagesDropdown />
          {/* Dashboard Tour button */}
          <button
            onClick={handleTourRestart}
            className="p-2.5 rounded-xl text-cell-secondary hover:bg-status-bg transition-colors border border-transparent hover:border-status-border"
            title={t("header.dashboard_tour")}
            aria-label={t("header.dashboard_tour")}
          >
            <FiCompass size={18} />
          </button>
        </div>

        {/* User Profile Section */}
        <HeaderUserMenu />
      </div>
      <Alert
        type="warning"
        isOpen={isTourConfirmOpen}
        onClose={() => setIsTourConfirmOpen(false)}
        onSubmit={confirmTourRestart}
        isBtns={true}
        autoClose={false}
        title={t("Restart guided tour?")}
        message={t("Restart the guided tour? The page will reload.")}
        titleSubmitBtn={t("Restart tour")}
        titleCancelBtn={t("Cancel")}
      />
    </div>
  );
});

Header.displayName = "HeaderComponent"

Header.propTypes = {
  taggleSlidebarOpen: PropTypes.func,
  toggleSlidebarOpen: PropTypes.func,
  className: PropTypes.string,
};

export default Header;
