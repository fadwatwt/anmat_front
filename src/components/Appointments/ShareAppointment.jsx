"use client";

import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  RiWhatsappLine,
  RiMailLine,
  RiFileCopyLine,
  RiShareForwardLine,
  RiCloseLine,
} from "react-icons/ri";

function ShareAppointment({ appointment, isOpen, onClose }) {
  const { t } = useTranslation();

  if (!isOpen || !appointment) return null;

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "م" : "ص";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd MMMM, yyyy", { locale: ar });
    } catch {
      return dateStr;
    }
  };

  const shareText = `📅 موعد: ${appointment.title}
${appointment.location ? `📍 المكان: ${appointment.location}` : ""}
📆 التاريخ: ${formatDate(appointment.date)}
🕐 الوقت: ${formatTime(appointment.start_time)}${appointment.end_time ? ` - ${formatTime(appointment.end_time)}` : ""}
${appointment.description ? `📝 ملاحظات: ${appointment.description}` : ""}`.trim();

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`موعد: ${appointment.title}`);
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert(t("Copied to clipboard!"));
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `موعد: ${appointment.title}`,
          text: shareText,
        });
      } catch (error) {
        console.error("Failed to share:", error);
      }
    }
  };

  const shareOptions = [
    {
      name: t("WhatsApp"),
      icon: RiWhatsappLine,
      color: "#25D366",
      onClick: handleShareWhatsApp,
    },
    {
      name: t("Email"),
      icon: RiMailLine,
      color: "#EA4335",
      onClick: handleShareEmail,
    },
    {
      name: t("Copy"),
      icon: RiFileCopyLine,
      color: "#666",
      onClick: handleCopyToClipboard,
    },
  ];

  if (navigator.share) {
    shareOptions.push({
      name: t("Share"),
      icon: RiShareForwardLine,
      color: "#1877F2",
      onClick: handleNativeShare,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {t("Share Appointment")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
            <p className="font-medium text-gray-900 dark:text-white">
              {appointment.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              📆 {formatDate(appointment.date)} • 🕐{" "}
              {formatTime(appointment.start_time)}
            </p>
          </div>

          <div className="space-y-2">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.onClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <option.icon size={20} style={{ color: option.color }} />
                <span className="font-medium text-gray-900 dark:text-white">
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareAppointment;
