import { useState, useEffect } from "react";
import DefaultButton from "@/components/Form/DefaultButton";
import { useTranslation } from "react-i18next";
import InlineAlert from "@/components/InlineAlert.jsx";
import { useGetUserPreferencesQuery, useUpdateUserPreferencesMutation } from "@/redux/api/settingsApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function NotificationMethods() {
  const { t } = useTranslation();
  const { data: preferences, isLoading } = useGetUserPreferencesQuery();
  const [updatePreferences, { isLoading: isUpdating }] = useUpdateUserPreferencesMutation();

  const [methods, setMethods] = useState({ email: true, push: true });
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  useEffect(() => {
    if (preferences?.notification_methods) {
      setMethods((prev) => ({ ...prev, ...preferences.notification_methods }));
    }
  }, [preferences]);

  const handleToggle = (key) => {
    setMethods((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      await updatePreferences({ notification_methods: methods }).unwrap();
      setApiResponse({ isOpen: true, status: "success", message: t("Notification methods updated successfully") });
    } catch (error) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: error?.data?.message || t("Failed to update notification methods"),
      });
    }
  };

  const notificationMethods = [
    {
      key: "email",
      label: "Email Notifications",
      description: t("Receive notifications via email"),
    },
    {
      key: "push",
      label: "Push Notifications",
      description: t("Get real-time updates and alerts directly on your device"),
    },
  ];

  if (isLoading) return <div className="p-4">{t("Loading...")}</div>;

  return (
    <div className="w-full flex flex-col gap-6 items-start overflow-hidden">
      {/* Title & Description */}
      <div className="flex flex-col gap-4 w-full overflow-hidden">
        <div className="flex flex-col text-start gap-1">
          <h2 className="text-lg md:text-xl font-semibold dark:text-gray-200 overflow-hidden text-ellipsis">
            {t("Notification Methods")}
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis">
            {t("Choose how you want to receive notifications")}
          </p>
        </div>
        <div className="w-full border-t-[1px] border-[#E2E4E9] dark:border-gray-700 my-2" />

        {/* Notification Methods */}
        <div className="flex flex-col gap-3 w-full overflow-auto max-h-40">
          {notificationMethods.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center gap-3 p-3 rounded-lg w-full overflow-hidden"
            >
              <input
                type="checkbox"
                className="checkbox-custom"
                checked={methods[key]}
                onChange={() => handleToggle(key)}
              />
              <div className="text-start overflow-hidden">
                <p className="text-sm md:text-base font-medium dark:text-gray-200 overflow-hidden text-ellipsis whitespace-nowrap">
                  {t(label)}
                </p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis">
                  {t(description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

     <InlineAlert type={"info"} text={"Maximize your app usage by leaving notification settings active."} />

      {/* Buttons */}
      <div className="flex gap-3 mt-4 w-full overflow-hidden">
        <DefaultButton
          type="button"
          title={t("Cancel")}
          className="font-medium dark:text-gray-200"
        />
        <DefaultButton
          type="button"
          disabled={isUpdating}
          onClick={handleSave}
          title={t("Save Changes")}
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

export default NotificationMethods;
