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
  User: { icon: RiUserLine, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700" },
  EmailVerification: { icon: RiMailLine, color: "text-red-500 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  Organization: { icon: RiBuildingLine, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/40" },
  Appointment: { icon: RiCalendarEventLine, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40" },
  support_tickets: { icon: RiTicketLine, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/40" },
  EscalationRequest: { icon: RiArrowGoForwardLine, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  Custom: { icon: RiNotification4Line, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  default: { icon: RiFolderLine, color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700" },
};

const MESSAGE_PATTERNS = [
  { regex: /^(.+?) has logged in to the system\.?$/, ar: (m) => `${m[1]} قام بتسجيل الدخول إلى النظام.` },
  { regex: /^(.+?) has logged out of the system\.?$/, ar: (m) => `${m[1]} قام بتسجيل الخروج من النظام.` },
  { regex: /^(.+?) requested a short leave on (.+?) from (.+?) to (.+?)$/, ar: (m) => `${m[1]} طلب إجازة قصيرة في ${m[2]} من ${m[3]} إلى ${m[4]}` },
  { regex: /^(.+?) updated their leave request for (.+?) from (.+?) to (.+?)$/, ar: (m) => `${m[1]} قام بتعديل طلب إجازته ليوم ${m[2]} من ${m[3]} إلى ${m[4]}` },
  { regex: /^(.+?) cancelled their leave request for (.+?)$/, ar: (m) => `${m[1]} قام بإلغاء طلب إجازته ليوم ${m[2]}` },
  { regex: /^(.+?) has checked in at (.+?)$/, ar: (m) => `${m[1]} قام بتسجيل الحضور في ${m[2]}` },
  { regex: /^(.+?) checked in (\d+) minutes late at (.+?)$/, ar: (m) => `${m[1]} قام بتسجيل الحضور متأخراً ${m[2]} دقيقة في ${m[3]}` },
  { regex: /^(.+?) has checked out at (.+?) \((.+?)h worked\)$/, ar: (m) => `${m[1]} قام بتسجيل الانصراف في ${m[2]} (${m[3]} ساعة عمل)` },
  { regex: /^(.+?) has submitted a new (.+?) request\.?$/, ar: (m) => `${m[1]} قدم طلب ${m[2]} جديد.` },
  { regex: /^(.+?) tokens added to your account$/, ar: (m) => `تمت إضافة ${m[1]} رمز إلى حسابك` },
  { regex: /^You have been assigned a new task: "(.+?)"\.?$/, ar: (m) => `تم تعيين مهمة جديدة لك: "${m[1]}".` },
  { regex: /^A new task "(.+?)" has been added to project "(.+?)"\.?$/, ar: (m) => `تمت إضافة مهمة جديدة "${m[1]}" إلى مشروع "${m[2]}".` },
  { regex: /^You have been unassigned from task: "(.+?)"\.?$/, ar: (m) => `تم إلغاء تعيينك من المهمة: "${m[1]}".` },
  { regex: /^An employee has updated task: "(.+?)"\.?$/, ar: (m) => `قام موظف بتحديث المهمة: "${m[1]}".` },
  { regex: /^Your task "(.+?)" has been updated\.?$/, ar: (m) => `تم تحديث مهمتك "${m[1]}".` },
  { regex: /^Your task "(.+?)" has been evaluated with a score of (.+?)\/5\.?$/, ar: (m) => `تم تقييم مهمتك "${m[1]}" بدرجة ${m[2]}/5.` },
  { regex: /^You have been assigned as manager for new project: "(.+?)"\.?$/, ar: (m) => `تم تعيينك كمدير لمشروع جديد: "${m[1]}".` },
  { regex: /^You have been assigned to new project: "(.+?)"\.?$/, ar: (m) => `تم تعيينك في مشروع جديد: "${m[1]}".` },
  { regex: /^You are no longer the manager for project: "(.+?)"\.?$/, ar: (m) => `لم تعد مديراً لمشروع: "${m[1]}".` },
  { regex: /^You have been assigned as manager for project: "(.+?)"\.?$/, ar: (m) => `تم تعيينك كمدير لمشروع: "${m[1]}".` },
  { regex: /^You have been unassigned from project: "(.+?)"\.?$/, ar: (m) => `تم إلغاء تعيينك من مشروع: "${m[1]}".` },
  { regex: /^You have been assigned to project: "(.+?)"\.?$/, ar: (m) => `تم تعيينك في مشروع: "${m[1]}".` },
  { regex: /^Your project "(.+?)" has been updated\.?$/, ar: (m) => `تم تحديث مشروعك "${m[1]}".` },
  { regex: /^"(.+?)": leaved from (.+?) to (.+?) in (.+?)$/, ar: (m) => `${m[1]}: مغادرة من ${m[2]} إلى ${m[3]} في ${m[4]}` },
  { regex: /^Your leave for (.+?) has been deleted by the administrator\.?$/, ar: (m) => `تم حذف إجازتك ليوم ${m[1]} من قِبَل المسؤول.` },
  { regex: /^An attendance record for (.+?) \((.+?) - (.+?)\) has been created by the administrator\.?$/, ar: (m) => `تم إنشاء سجل حضور ليوم ${m[1]} (${m[2]} - ${m[3]}) من قِبَل المسؤول.` },
  { regex: /^Your attendance record for (.+?) has been deleted by the administrator\.?$/, ar: (m) => `تم حذف سجل حضورك ليوم ${m[1]} من قِبَل المسؤول.` },
  { regex: /^Your (.+?) request status has been updated to "(.+?)"\.\s*Reason:\s*(.+?)$/, ar: (m) => `تم تحديث حالة طلبك ${m[1]} إلى "${m[2]}". السبب: ${m[3]}` },
  { regex: /^Your (.+?) request status has been updated to "(.+?)"\.?\s*$/, ar: (m) => `تم تحديث حالة طلبك ${m[1]} إلى "${m[2]}".` },
  { regex: /^Your (.+?) request has been deleted by the administrator\.?$/, ar: (m) => `تم حذف طلبك ${m[1]} من قِبَل المسؤول.` },
  { regex: /^Your department "(.+?)" information has been updated\.?$/, ar: (m) => `تم تحديث معلومات قسمك "${m[1]}".` },
  { regex: /^You have been assigned to the department "(.+?)"\.?$/, ar: (m) => `تم تعيينك في قسم "${m[1]}".` },
  { regex: /^You have been removed from the department "(.+?)"\.?$/, ar: (m) => `تم إزالتك من قسم "${m[1]}".` },
  { regex: /^Your profile information has been updated by the administrator\.?$/, ar: () => `تم تحديث معلومات ملفك الشخصي من قِبَل المسؤول.` },
  { regex: /^A salary transaction for (.+?) has been deleted from your account\.?$/, ar: (m) => `تم حذف معاملة راتب بقيمة ${m[1]} من حسابك.` },
  { regex: /^A salary transaction for (.+?) has been updated\.?$/, ar: (m) => `تم تحديث معاملة راتب بقيمة ${m[1]}.` },
  { regex: /^A new salary transaction of (.+?) has been added to your account\.?$/, ar: (m) => `تمت إضافة معاملة راتب جديدة بقيمة ${m[1]} إلى حسابك.` },
];

function translateMessage(text, lang) {
  if (!text || lang !== "ar") return text;
  for (const pattern of MESSAGE_PATTERNS) {
    const match = text.match(pattern.regex);
    if (match) return pattern.ar(match);
  }
  return text;
}

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
          <RiNotification4Line className="dark:text-gray-100 text-gray-600" size={20} />
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
                notifications.map((notification) => {
                  const modelConfig = MODEL_TYPE_CONFIG[notification.model_type] || MODEL_TYPE_CONFIG.default;
                  const TypeIcon = modelConfig.icon;
                  const content = translateMessage(notification.content || notification.message || "", i18n.language);
                  return (
                  <div
                    key={notification.id}
                    className={`flex items-center gap-3 p-3 border-b dark:border-gray-700 last:border-0 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${modelConfig.bg}`}>
                      <TypeIcon size={20} className={modelConfig.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-sm truncate ${!notification.isRead ? 'font-bold dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                          {notification.title_key
                            ? t(notification.title_key, notification.meta || {})
                            : t(notification.title)}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap shrink-0">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
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

            <div className="w-full h-[56px] px-5 py-4 border-t dark:border-gray-700 flex justify-center items-center">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/notifications");
                }}
                className="text-[#375DFB] font-[Almarai] font-[400] text-[14px] leading-[20px] tracking-[-0.6%] text-center hover:underline"
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
