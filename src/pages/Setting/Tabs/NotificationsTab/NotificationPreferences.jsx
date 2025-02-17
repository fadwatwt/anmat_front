import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import Switch from "./Switch.jsx";
import DefaultButton from "../../../../components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";

function NotificationPreferences() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState({
    newsUpdates: true,
    remindersEvents: true,
    leaveAttendance: false,
    deadlineNotification: true,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationOptions = [
    {
      key: "newsUpdates",
      label: "News and Updates",
      description: "Stay informed about the latest news, updates.",
    },
    {
      key: "remindersEvents",
      label: "Reminders and Events",
      description: "Get reminders for upcoming events, deadlines.",
    },
    {
      key: "leaveAttendance",
      label: "Leave and Attendance",
      description: "Updates on approved leaves, attendance records",
    },
    {
      key: "deadlineNotification",
      label: "Deadline Notification",
      description: "Receive timely reminders before ",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 items-start">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col text-start gap-1">
          <h2 className="text-lg md:text-xl font-semibold dark:text-gray-200">
            {t("Notification Preferences")}
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            {t("Choose what notifications you want to receive")}
          </p>
        </div>
        <div className="w-full border-t-[1px] border-[#E2E4E9] dark:border-gray-700 my-2" />

        <div className="flex flex-col gap-3 w-full">
          {notificationOptions.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-start gap-3 p-3 dark:bg-gray-700 rounded-lg w-full"
            >
              <Switch
                isOn={notifications[key]}
                handleToggle={() => handleToggle(key)}
              />
              <div className="text-start">
                <p className="text-sm md:text-base font-medium dark:text-gray-200">
                  {t(label)}
                </p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {t(description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between w-full h-9 bg-[#EBF1FF] rounded-lg px-1 mx-auto overflow-hidden">
        <div className="flex items-center gap-2">
          <FiInfo className="text-blue-500 w-4 h-4" />
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
            Maximize your app usage by leaving notification settings active.
          </p>
        </div>
      </div>
      <div className="flex gap-3 mt-4 w-full">
        <DefaultButton
          type="button"
          title={t("Cancel")}
          className="font-medium dark:text-gray-200"
        />
        <DefaultButton
          type="button"
          title={t("Save Changes")}
          className="bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"
        />
      </div>
    </div>
  );
}

export default NotificationPreferences;
