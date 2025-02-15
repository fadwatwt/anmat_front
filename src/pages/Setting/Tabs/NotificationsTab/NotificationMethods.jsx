import { FiInfo } from "react-icons/fi";
import DefaultButton from "../../../../components/Form/DefaultButton";
import { useTranslation } from "react-i18next";

function NotificationMethods() {
  const { t } = useTranslation();

  const notificationMethods = [
    {
      key: "email",
      label: "Email Notifications",
      description: "Receive notifications via email",
    },
    {
      key: "push",
      label: "Push Notifications",
      description: "Get real-time updates and alerts directly on your device",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 items-start">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col text-start gap-1">
          <h2 className="text-lg md:text-xl font-semibold dark:text-gray-200">
            {t("Notification Methods")}
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            {t("Choose how you want to receive notifications")}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {notificationMethods.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center gap-3 p-3 dark:bg-gray-700 rounded-lg w-full"
            >
              <input type="checkbox" className="w-4 h-4 accent-primary-600" />
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
      <div className="flex items-center justify-between w-full  h-9 bg-[#EBF1FF] rounded-lg px-3 mx-auto">
        <div className="flex items-center gap-2">
          <FiInfo className="text-blue-500 w-4 h-4" />
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Maximize your app usage by leaving notification settings active.
          </p>
        </div>
      </div>
      <div className="flex gap-3 mt-4 w-full">
        <DefaultButton
          type="button"
          title={t("Cancel")}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
        />
        <DefaultButton
          type="button"
          title={t("Save Changes")}
          className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-200 dark:text-gray-900"
        />
      </div>
    </div>
  );
}

export default NotificationMethods;
