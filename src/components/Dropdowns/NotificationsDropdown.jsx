"use client";

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import { RiNotification3Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId, selectUserType } from "@/redux/auth/authSlice";
import { useMarkAllNotificationsAsReadMutation } from "@/redux/api/notificationsApi";
import { markAllAsRead as markAllAsReadAction } from "@/redux/notifications/notificationsSlice";

const NotificationsDropdown = ({ notifications, unreadCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const { t, i18n } = useTranslation();
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();

  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);

  const [markAllAsReadApi] = useMarkAllNotificationsAsReadMutation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMenuOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMenuOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 200); // 200ms delay to allow smooth transition
  };

  const handleMarkAllAsRead = async () => {
    if (!userId || !userType) return;
    try {
      await markAllAsReadApi({ recipientId: userId, recipientType: userType }).unwrap();
      dispatch(markAllAsReadAction());
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div className="w-10 relative" ref={notificationRef}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`icon-notification flex items-center h-10 ${isMenuOpen
          ? "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300"
          : "bg-gray-100 dark:bg-gray-900"
          } rounded-lg py-1 px-3 text-center cursor-pointer`}
      >
        <div className="relative">
          <RiNotification3Line className="dark:text-gray-100 text-gray-600" size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <>

          {/* Dropdown container */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`fixed sm:absolute top-[72px] sm:top-full left-0 right-0 sm:left-auto sm:right-0 sm:mt-2 w-full sm:w-[480px] max-w-[300px] mx-auto sm:mx-0 h-auto max-h-[calc(100vh-80px)] sm:max-h-[75vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-[20px] sm:rounded-[20px] shadow-xl z-[100] flex flex-col overflow-hidden`}
            style={{ borderWidth: "0.5px" }}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700">
              <h3 className="font-[Almarai] font-[400] text-[16px] leading-[24px] tracking-[-1.1%] dark:text-white">
                {t("Notifications")} {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              <button 
                onClick={handleMarkAllAsRead}
                className="text-[#375DFB] font-[Almarai] font-[400] dark:text-primary-200 text-[14px] leading-[20px] tracking-[-0.6%] text-center hover:underline"
              >
                {t("Mark all as read")}
              </button>
            </div>

            <div className="max-h-[calc(100%-120px)] sm:max-h-[calc(70vh-120px)] overflow-y-auto custom-scroll">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-[Almarai]">
                  {t("No new notifications")}
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex p-4 border-b dark:border-gray-700 last:border-0 sm:px-4 px-5 sm:py-3 py-4 ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="mr-3">
                      <div className={`w-2 h-10 rounded-full ${
                        notification.priority === 'high' ? 'bg-red-500' : 
                        notification.priority === 'normal' ? 'bg-orange-400' : 
                        'bg-blue-400'
                      }`} title={`Priority: ${notification.priority}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm dark:text-white truncate pr-2">
                          {notification.title}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {notification.content}
                      </div>
                      {!notification.isRead && (
                        <div className="mt-2 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          <span className="text-[10px] text-blue-500 font-medium">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="w-full h-[56px] px-5 py-4 border-t dark:border-gray-700 flex justify-center items-center">
              <button className="text-[#375DFB] font-[Almarai] font-[400] text-[14px] leading-[20px] tracking-[-0.6%] text-center hover:underline">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

NotificationsDropdown.propTypes = {
  notifications: PropTypes.array.isRequired,
  unreadCount: PropTypes.number.isRequired,
};

export default NotificationsDropdown;