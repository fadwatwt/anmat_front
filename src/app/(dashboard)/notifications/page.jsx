"use client";
import { useState, useMemo } from "react";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getNotificationRoute } from "@/functions/notificationRouting";
import { useGetMyNotificationsQuery } from "@/redux/api/notificationsApi";
import {
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "@/redux/api/notificationsApi";
import {
  markRead as markReadAction,
  markAllAsRead as markAllAsReadAction,
} from "@/redux/notifications/notificationsSlice";
import NotificationDetailsModal from "./_components/modals/NotificationDetails.modal.jsx";
import {
  RiNotification4Line,
  RiCheckLine,
  RiCheckDoubleLine,
  RiLoader4Line,
  RiNotificationOffLine,
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

const PRIORITY_CONFIG = {
  high: {
    bar: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-950/20",
    badge: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    label: "High Priority",
  },
  normal: {
    bar: "bg-orange-400",
    bg: "bg-orange-50/50 dark:bg-orange-950/10",
    badge: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    label: "Normal Priority",
  },
  low: {
    bar: "bg-blue-400",
    bg: "bg-blue-50/50 dark:bg-blue-950/10",
    badge: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    label: "Low Priority",
  },
};

const STATUS_CONFIG = {
  pending: {
    badge: "bg-status-bg text-cell-secondary",
    label: "Pending",
  },
  delivered: {
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    label: "Delivered",
  },
  read: {
    badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    label: "Read",
  },
  failed: {
    badge: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    label: "Failed",
  },
};

const MODEL_TYPE_CONFIG = {
  Task: {
    icon: RiTaskLine,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/40",
  },
  Project: {
    icon: RiProjector2Line,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/40",
  },
  Leave: {
    icon: RiCalendarEventLine,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/40",
  },
  Attendance: {
    icon: RiCalendarCheckLine,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  SalaryTransaction: {
    icon: RiMoneyDollarCircleLine,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/40",
  },
  Employee: {
    icon: RiTeamLine,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
  EmployeeRequest: {
    icon: RiFileListLine,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-100 dark:bg-cyan-900/40",
  },
  EmployeeDetail: {
    icon: RiUserLine,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
  Department: {
    icon: RiBuildingLine,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-100 dark:bg-teal-900/40",
  },
  Subscription: {
    icon: RiSubtractLine,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-900/40",
  },
  SubscriptionPlan: {
    icon: RiSettings3Line,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-900/40",
  },
  User: {
    icon: RiUserLine,
    color: "text-cell-secondary",
    bg: "bg-status-bg",
  },
  EmailVerification: {
    icon: RiMailLine,
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/40",
  },
  Organization: {
    icon: RiBuildingLine,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/40",
  },
  Appointment: {
    icon: RiCalendarEventLine,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/40",
  },
  support_tickets: {
    icon: RiTicketLine,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-900/40",
  },
  EscalationRequest: {
    icon: RiArrowGoForwardLine,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/40",
  },
  Custom: {
    icon: RiNotification4Line,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
  default: {
    icon: RiFolderLine,
    color: "text-cell-secondary",
    bg: "bg-status-bg",
  },
};

import { translateMessage } from "@/functions/notificationTranslation";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

function NotificationCard({ notification, onMarkAsRead, onOpen }) {
  const { t, i18n } = useTranslation();
  const priority = PRIORITY_CONFIG[notification.priority] || PRIORITY_CONFIG.normal;
  const status = STATUS_CONFIG[notification.status] || STATUS_CONFIG.pending;
  const isUnread = notification.status !== "read";
  const modelConfig = MODEL_TYPE_CONFIG[notification.model_type] || MODEL_TYPE_CONFIG.default;
  const TypeIcon = modelConfig.icon;

  const title = notification.title_key
    ? t(notification.title_key, notification.meta || {})
    : t(notification.title || notification.title);

  const rawContent = notification.message_key
    ? t(notification.message_key, notification.meta || {})
    : notification.content || notification.message || "";
  const content = translateMessage(rawContent, i18n.language);

  const timeAgo = useMemo(() => {
    if (!notification.created_at) return "";
    const now = new Date();
    const created = new Date(notification.created_at);
    const diffMs = now - created;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return t("Just now");
    if (diffMin < 60) return `${diffMin} ${t("min ago")}`;
    if (diffHr < 24) return `${diffHr} ${t("h ago")}`;
    if (diffDay < 7) return `${diffDay} ${t("d ago")}`;
    return created.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [notification.created_at, t]);

  return (
    <div
      onClick={() => onOpen(notification)}
      className={`relative flex items-stretch rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
        isUnread
          ? "border-blue-200 dark:border-blue-800 bg-surface"
          : "border-status-border bg-surface dark:bg-[#20232D]/60"
      }`}
    >
      <div className={`w-1.5 shrink-0 rounded-l-2xl ${priority.bar}`} />

      <div className="flex-1 p-4 flex items-center gap-4">
        <div
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${modelConfig.bg}`}
        >
          <TypeIcon
            size={22}
            className={modelConfig.color}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm leading-5 truncate ${
                isUnread
                  ? "font-bold text-cell-primary"
                  : "font-medium text-cell-secondary"
              }`}
            >
              {title}
            </h3>
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            )}
          </div>
          <p className="text-xs text-cell-secondary truncate mt-0.5">
            {content}
          </p>
          {notification.model_type && notification.model_type !== "Custom" && (
            <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded ${modelConfig.bg} ${modelConfig.color}`}>
              <TypeIcon size={10} />
              {t(notification.model_type)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${status.badge}`}
          >
            {t(status.label)}
          </span>
        </div>

        <span className="text-[11px] text-cell-secondary whitespace-nowrap shrink-0">
          {timeAgo}
        </span>

        {isUnread && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            className="shrink-0 p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-500 transition-colors"
            title={t("Mark as read")}
          >
            <RiCheckLine size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

const NotificationsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: notificationsResponse, isLoading } = useGetMyNotificationsQuery({
    page: currentPage,
    limit: 20,
  });

  const [markAsReadApi] = useMarkNotificationAsReadMutation();
  const [markAllAsReadApi] = useMarkAllNotificationsAsReadMutation();

  const notifications = useMemo(() => {
    return (notificationsResponse?.data || []).filter(
      (n) => n.model_type !== "Chat"
    );
  }, [notificationsResponse]);

  const totalUnread = notificationsResponse?.meta?.unreadCount || 0;
  const pagination = notificationsResponse?.pagination;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") return notifications.filter((n) => n.status !== "read");
    if (activeFilter === "read") return notifications.filter((n) => n.status === "read");
    return notifications;
  }, [notifications, activeFilter]);

  const handleMarkAsRead = async (nId) => {
    try {
      await markAsReadApi(nId).unwrap();
      dispatch(markReadAction(nId));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadApi().unwrap();
      dispatch(markAllAsReadAction());
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleOpenNotification = async (notification) => {
    const route = getNotificationRoute(notification);
    if (route) {
      if (notification.status !== "read") {
        await handleMarkAsRead(notification.id || notification._id);
      }
      router.push(route);
      return;
    }
    setSelectedNotification(notification);
    setIsDetailsModalOpen(true);
  };

  const path = [
    { title: "Dashboard", path: "/" },
    { title: "Notifications", path: "/notifications" },
  ];

  const HeaderActions = (
    <div className="flex items-center gap-3">
      <div className="flex items-center bg-status-bg rounded-xl p-1">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === filter.value
                ? "bg-surface text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-cell-secondary hover:text-cell-secondary dark:hover:text-gray-300"
            }`}
          >
            {t(filter.label)}
            {filter.value === "unread" && totalUnread > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </button>
        ))}
      </div>

      {totalUnread > 0 && (
        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-800 transition-colors"
        >
          <RiCheckDoubleLine size={16} />
          {t("Mark all as read")}
        </button>
      )}
    </div>
  );

  return (
    <Page title={"Notifications"} isBreadcrumbs={true} breadcrumbs={path}>
      <div className="w-full">
        <div className="mb-4">
          <TableHeader
            title={t("All Notifications")}
            count={notifications.length}
            actions={HeaderActions}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RiLoader4Line className="animate-spin text-blue-500" size={40} />
            <span className="text-cell-secondary text-sm">
              {t("Loading notifications...")}
            </span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full bg-status-bg flex items-center justify-center">
              <RiNotificationOffLine
                className="text-gray-300"
                size={36}
              />
            </div>
            <h3 className="text-cell-secondary text-base font-medium">
              {t("No notifications")}
            </h3>
            <p className="text-cell-secondary text-sm text-center max-w-xs">
              {t("You're all caught up! Notifications will appear here when you receive them.")}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id || notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onOpen={handleOpenNotification}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm border border-status-border disabled:opacity-40 hover:bg-status-bg transition-colors"
                >
                  {t("Previous")}
                </button>
                <span className="text-sm text-cell-secondary px-3">
                  {t("Page")} {currentPage} {t("of")} {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm border border-status-border disabled:opacity-40 hover:bg-status-bg transition-colors"
                >
                  {t("Next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <NotificationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
        onMarkAsRead={handleMarkAsRead}
      />
    </Page>
  );
};

function TableHeader({ title, count, actions }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
      <div className="flex items-center gap-3">
        <p className="text-table-title text-start text-lg">{title}</p>
        {count > 0 && (
          <span className="bg-status-bg text-cell-secondary text-xs font-medium px-2.5 py-1 rounded-lg">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}

export default NotificationsPage;

