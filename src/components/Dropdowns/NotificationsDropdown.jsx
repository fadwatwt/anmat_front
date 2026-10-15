"use client";

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";
import {
  RiNotification4Line,
  RiCheckLine,
  RiTaskLine,
  RiProjector2Line,
  RiCalendarEventLine,
  RiMoneyDollarCircleLine,
  RiUserLine,
  RiMailLine,
  RiTeamLine,
  RiFileListLine,
  RiCalendarCheckLine,
  RiTicketLine,
  RiArrowGoForwardLine,
  RiSubtractLine,
  RiSettings3Line,
  RiFolderLine,
  RiBuildingLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId, selectUserType } from "@/redux/auth/authSlice";
import { useMarkAllNotificationsAsReadMutation, useMarkNotificationAsReadMutation } from "@/redux/api/notificationsApi";
import { markAllAsRead as markAllAsReadAction, markRead as markReadAction } from "@/redux/notifications/notificationsSlice";
import { getNotificationRoute } from "@/functions/notificationRouting";

const MODEL_TYPE_CONFIG = {
  Task: { icon: RiTaskLine, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/40" },
  Project: { icon: RiProjector2Line, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
  Leave: { icon: RiCalendarEventLine, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  Attendance: { icon: RiCalendarCheckLine, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  SalaryTransaction: { icon: RiMoneyDollarCircleLine, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40" },
  Employee: { icon: RiTeamLine, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  EmployeeRequest: { icon: RiFileListLine, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/40" },
  EmployeeDetail: { icon: RiUserLine, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  Department: { icon: RiBuildingLine, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/40" },
  Subscription: { icon: RiSubtractLine, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-900/40" },
  SubscriptionPlan: { icon: RiSettings3Line, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-900/40" },
  User: { icon: RiUserLine, color: "text-cell-secondary", bg: "bg-status-bg" },
  EmailVerification: { icon: RiMailLine, color: "text-red-500 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  Organization: { icon: RiBuildingLine, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/40" },
  Appointment: { icon: RiCalendarEventLine, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
  support_tickets: { icon: RiTicketLine, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/40" },
  EscalationRequest: { icon: RiArrowGoForwardLine, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  Custom: { icon: RiNotification4Line, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  default: { icon: RiFolderLine, color: "text-cell-secondary", bg: "bg-status-bg" },
};

import { translateMessage } from "@/functions/notificationTranslation";

const NotificationsDropdown = ({ notifications, unreadCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const { t, i18n } = useTranslation();
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);

  const [markAllAsReadApi] = useMarkAllNotificationsAsReadMutation();
  const [markAsReadApi] = useMarkNotificationAsReadMutation();

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

  useEffect(() => {
    if (isMenuOpen && unreadCount > 0) {
      handleMarkAllAsRead();
    }
  }, [isMenuOpen]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadApi().unwrap();
      dispatch(markAllAsReadAction());
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleMarkAsRead = async (e, nId) => {
    e.stopPropagation();
    try {
      await markAsReadApi(nId).unwrap();
      dispatch(markReadAction(nId));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleOpenNotification = async (notification) => {
    setIsMenuOpen(false);
    const route = getNotificationRoute(notification);
    const nId = notification.id || notification._id;
    if (!notification.isRead && nId) {
      try {
        await markAsReadApi(nId).unwrap();
        dispatch(markReadAction(nId));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
    router.push(route || "/notifications");
  };

  return (
    <div className="w-10 relative" ref={notificationRef}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`icon-notification flex items-center h-10 ${isMenuOpen
          ? "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300"
          : "bg-status-bg"
          } rounded-lg py-1 px-3 text-center cursor-pointer`}
      >
        <div className="relative">
          <RiNotification4Line className="text-cell-secondary" size={20} />
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
            className={`fixed sm:absolute top-[72px] sm:top-full left-0 right-0 sm:left-auto sm:right-0 sm:mt-2 w-full sm:w-[480px] max-w-[300px] mx-auto sm:mx-0 h-auto max-h-[calc(100vh-80px)] sm:max-h-[75vh] bg-surface border border-status-border rounded-b-[20px] sm:rounded-[20px] shadow-xl z-[100] flex flex-col overflow-hidden`}
            style={{ borderWidth: "0.5px" }}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="font-[Almarai] font-[400] text-[16px] leading-[24px] tracking-[-1.1%]">
                {t("Notifications")} {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              <button 
                onClick={handleMarkAllAsRead}
                className="text-primary-base font-[Almarai] font-[400] dark:text-primary-200 text-[14px] leading-[20px] tracking-[-0.6%] text-center hover:underline"
              >
                {t("Mark all as read")}
              </button>
            </div>

            <div className="max-h-[calc(100%-120px)] sm:max-h-[calc(70vh-120px)] overflow-y-auto custom-scroll">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-cell-secondary font-[Almarai]">
                  {t("No new notifications")}
                </div>
              ) : (
                notifications.map((notification) => {
                  const modelConfig = MODEL_TYPE_CONFIG[notification.model_type] || MODEL_TYPE_CONFIG.default;
                  const TypeIcon = modelConfig.icon;
                  const content = translateMessage(notification.content || notification.message || "", i18n.language);
                  return (
                  <div
                    key={notification.id}
                    onClick={() => handleOpenNotification(notification)}
                    className={`flex items-center gap-3 p-3 border-b last:border-0 cursor-pointer transition-colors hover:bg-status-bg ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${modelConfig.bg}`}>
                      <TypeIcon size={20} className={modelConfig.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-sm truncate ${!notification.isRead ? 'font-bold dark:text-white' : 'font-medium text-cell-secondary'}`}>
                          {notification.title_key
                            ? t(notification.title_key, notification.meta || {})
                            : t(notification.title)}
                        </span>
                        <span className="text-[10px] text-cell-secondary whitespace-nowrap shrink-0">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs text-cell-secondary truncate mt-0.5">
                        {notification.message_key
                          ? t(notification.message_key, notification.meta || {})
                          : content}
                      </p>
                      {!notification.isRead && (
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span className="text-[10px] text-blue-500 font-medium">{t("New")}</span>
                          </div>
                          <button
                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded text-blue-500 transition-colors"
                            title={t("Mark as read")}
                          >
                            <RiCheckLine size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })
              )}
            </div>

            <div className="w-full h-[56px] px-5 py-4 border-t flex justify-center items-center">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/notifications");
                }}
                className="text-primary-base font-[Almarai] font-[400] text-[14px] leading-[20px] tracking-[-0.6%] text-center hover:underline"
              >
                {t("View all notifications")}
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

