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
      t("ar") === "ar" ? "ar-EG" : "en-US",
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
      onMarkAsRead(notification.id);
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
              : "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
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
    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-sm text-gray-900 dark:text-gray-200 font-medium">{value}</div>
    </div>
  );
}

NotificationDetailsModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  notification: PropTypes.object,
  onMarkAsRead: PropTypes.func,
};

export default NotificationDetailsModal;
