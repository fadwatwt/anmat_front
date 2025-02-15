import { useState, useMemo } from "react";
import Sidebar from "../../../components/Subcomponents/Sidebar.jsx";
import { FiBell, FiMail, FiSmartphone, FiInfo } from "react-icons/fi";
import TabModal from "../../../components/Modal/TabsContener/TabModal.jsx";
import DefaultButton from "../../../components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";

function NotificationsTab() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("notification-preferences");

  // Sidebar Items
  const listSideBar = useMemo(
    () => [
      {
        id: "notification-preferences",
        title: t("Notification Preferences"),
        icon: <FiBell />,
      },
      {
        id: "notification-methods",
        title: t("Notification Methods"),
        icon: <FiMail />,
      },
    ],
    [t]
  );

  // Tab Data
  const tabsData = useMemo(
    () => [
      {
        id: "notification-preferences",
        title: t("Notification Preferences"),
        content: <NotificationPreferences />,
        icon: <FiBell />,
      },
      {
        id: "notification-methods",
        title: t("Notification Methods"),
        content: <NotificationMethods />,
        icon: <FiMail />,
      },
    ],
    [t]
  );

  return (
    <div className="flex md:gap-32 gap-10 w-full md:flex-row flex-col">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <div className="bg-white dark:bg-gray-800 py-3 px-2 w-64 flex flex-col gap-2 rounded-lg">
          <p className="uppercase text-sm px-3 text-start dark:text-gray-200">
            {t("Select Menu")}
          </p>
          <Sidebar
            activeItem={activeTab}
            onClick={setActiveTab}
            list={listSideBar}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="md:p-5 p-2 rounded-2xl bg-white dark:bg-gray-800 lg:w-[39%]">
        {/* Tab Modal for Mobile View */}
        <div className="md:hidden block">
          <TabModal
            classNameItem="justify-start mx-1"
            classNameContent="h-[30rem]"
            tabs={tabsData}
          />
        </div>

        {/* Content for Desktop */}
        <div className="hidden md:block">
          {tabsData.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}

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
      description: "Stay informed about the latest news, updates .",
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
      description: "Receive timely reminders before approaching deadlines.",
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
            {" "}
            {t("Choose what notifications you want to receive")}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {notificationOptions.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-center justify-start gap-3 p-3  dark:bg-gray-700 rounded-lg w-full"
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

function Switch({ isOn, handleToggle }) {
  return (
    <button
      onClick={handleToggle}
      className={`w-10 h-5 sm:w-12 sm:h-6 md:w-14 md:h-7 flex items-center rounded-full p-0.5 transition-colors ${
        isOn
          ? "bg-primary-500 dark:bg-primary-200"
          : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <div
        className={`bg-white w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full shadow-md transform transition-transform ${
          isOn
            ? "translate-x-5 sm:translate-x-6 md:translate-x-7"
            : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default NotificationsTab;
