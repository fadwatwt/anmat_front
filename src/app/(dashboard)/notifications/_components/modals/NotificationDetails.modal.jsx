"use client";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  RiNotification4Line,
  RiCheckLine,
  RiCalendarLine,
  RiFlagLine,
  RiArrowRightLine,
} from "@remixicon/react";

import { translateMessage } from "@/functions/notificationTranslation";

const PRIORITY_CONFIG = {
  high: {
    bar: "bg-red-500",
    badge: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    label: "High Priority",
  },
  normal: {
    bar: "bg-orange-400",
    badge: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    label: "Normal Priority",
  },
  low: {
    bar: "bg-blue-400",
    badge: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    label: "Low Priority",
  },
};

const STATUS_CONFIG = {
  pending: {
    badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
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

function NotificationDetailsModal({ isOpen, onClose, notification, onMarkAsRead }) {
  const { t, i18n } = useTranslation();

  if (!notification) return null;

  const priority = PRIORITY_CONFIG[notification.priority] || PRIORITY_CONFIG.normal;
  const status = STATUS_CONFIG[notification.status] || STATUS_CONFIG.pending;
  const isUnread = notification.status !== "read";

  const title = notification.title_key
    ? t(notification.title_key, notification.meta || {})
    : t(notification.title || "");

  const content = translateMessage(
    notification.message_key
      ? t(notification.message_key, notification.meta || {})
      : notification.content || notification.message || "",
    i18n.language
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const handleMarkRead = () => {
    if (isUnread && onMarkAsRead) {
      onMarkAsRead(notification.id || notification._id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("Notification Details")}
      classNameBtns="mt-5"
      isBtns={false}
    >
      <div className="w-full flex flex-col gap-5">
        <div
          className={`flex items-start gap-3 p-4 rounded-xl ${
            isUnread
              ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
              : "bg-gray-50 dark:bg-[#20232D]/50 border border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
            <RiNotification4Line className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DetailRow
            icon={<RiFlagLine size={16} />}
            label={t("Priority")}
            value={
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${priority.badge}`}>
                {t(priority.label)}
              </span>
            }
          />
          <DetailRow
            icon={<RiCheckLine size={16} />}
            label={t("Status")}
            value={
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${status.badge}`}>
                {t(status.label)}
              </span>
            }
          />
          <DetailRow
            icon={<RiCalendarLine size={16} />}
            label={t("Created At")}
            value={formatDate(notification.created_at)}
          />
          {notification.delivered_at && (
            <DetailRow
              icon={<RiCalendarLine size={16} />}
              label={t("Delivered At")}
              value={formatDate(notification.delivered_at)}
            />
          )}
          {notification.read_at && (
            <DetailRow
              icon={<RiCalendarLine size={16} />}
              label={t("Read At")}
              value={formatDate(notification.read_at)}
            />
          )}
          {notification.model_type && (
            <DetailRow
              icon={<RiArrowRightLine size={16} />}
              label={t("Related To")}
              value={notification.model_type}
            />
          )}
        </div>

        {isUnread && (
          <button
            onClick={handleMarkRead}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 transition-colors"
          >
            <RiCheckLine size={16} />
            {t("Mark as read")}
          </button>
        )}
      </div>
    </Modal>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-[#20232D]/50 border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-sm text-gray-900 dark:text-gray-200 font-medium">{value}</div>
    </div>
  );
}

DetailRow.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

NotificationDetailsModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  notification: PropTypes.object,
  onMarkAsRead: PropTypes.func,
};

export default NotificationDetailsModal;

