import { useState, useEffect } from "react";
import Switch from "./Switch.jsx";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";
import InlineAlert from "@/components/InlineAlert.jsx";
import { useGetUserPreferencesQuery, useUpdateUserPreferencesMutation } from "@/redux/api/settingsApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function NotificationPreferences() {
  const { t } = useTranslation();
  const { data: preferences, isLoading } = useGetUserPreferencesQuery();
  const [updatePreferences, { isLoading: isUpdating }] = useUpdateUserPreferencesMutation();

  const [notifications, setNotifications] = useState({
    newsUpdates: true,
    remindersEvents: true,
    leaveAttendance: false,
    deadlineNotification: true,
  });
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  useEffect(() => {
    if (preferences?.notifications) {
      setNotifications((prev) => ({ ...prev, ...preferences.notifications }));
    }
  }, [preferences]);

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApplyChanges = async () => {
    try {
      await updatePreferences({ notifications }).unwrap();
      setApiResponse({ isOpen: true, status: "success", message: t("Notification preferences updated successfully") });
    } catch (error) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: error?.data?.message || t("Failed to update notification preferences"),
      });
    }
  };

  const notificationOptions = [
    {
      key: "newsUpdates",
      label: "News and Updates",
      description: t("Stay informed about the latest news, updates."),
    },
    {
      key: "remindersEvents",
      label: "Reminders and Events",
      description: t("Get reminders for upcoming events, deadlines."),
    },
    {
      key: "leaveAttendance",
      label: "Leave and Attendance",
      description: t("Updates on approved leaves, attendance records"),
    },
    {
      key: "deadlineNotification",
      label: "Deadline Notification",
      description: t("Receive timely reminders before "),
    },
  ];

  if (isLoading) return <div className="p-4">{t("Loading...")}</div>;

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
              className="flex items-center justify-start gap-3 p-3 w-full"
            >
              <Switch
                isOn={notifications[key]}
                handleToggle={() => handleToggle(key)}
              />
              <div className="text-start">
                <p className="text-sm md:text-base font-medium dark:text-gray-200">
                  {t(label)}
                </p>
                <p className="text-xs md:text-sm text-gray-600 text-wrap dark:text-gray-400">
                  {t(description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InlineAlert type={"info"} text={"Maximize your app usage by leaving notification settings active."} />
      <div className="flex gap-3 mt-4 w-full">
        <DefaultButton
          type="button"
          title={t("Cancel")}
          className="font-medium dark:text-gray-200"
        />
        <DefaultButton
          type="button"
          disabled={isUpdating}
          onClick={handleApplyChanges}
          title={t("Apply Changes")}
          className="bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"
        />
      </div>
      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
      />
    </div>
  );
}

export default NotificationPreferences;
