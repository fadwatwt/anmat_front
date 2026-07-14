"use client";
import Tabs from "@/components/Tabs.jsx";
import GeneralSettingsTab from "./Tabs/GeneralSettings.tab.jsx";
import { FiPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import AttendanceTab from "./Tabs/Attendance.tab.jsx";
import ConversationsTab from "./Tabs/Conversations.tab.jsx";
import TasksTab from "./Tabs/TasksTab/Tasks.tab.jsx";
import ProfileSecurityTab from "./Tabs/Profile&SecurityTab/ProfileSecurity.tab.jsx";
import NotificationsTab from "./Tabs/NotificationsTab/NotificationsTab.jsx";
import AiSettingsTab from "./Tabs/AiSettings.tab.jsx";
import { RiSettings3Line } from "@remixicon/react";
import { useSelector } from "react-redux";

function SettingPage() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  const tabsData = [
    {
      title: t("General Settings"),
      content: <GeneralSettingsTab />,
    },
    {
      title: t("Notifications"),
      content: <NotificationsTab />,
    },
    {
      title: t("Attendance"),
      content: <AttendanceTab />,
    },
    {
      title: t("Conversations"),
      content: <ConversationsTab />,
    },
    {
      title: t("Tasks"),
      content: <TasksTab />,
    },
    {
      title: t("Privacy & Security"),
      content: <ProfileSecurityTab />,
    },

  ];

  if (user?.type === "Admin") {
    tabsData.push({
      title: t("AI Assistant"),
      content: <AiSettingsTab />,
    });
  }

  return (
    <>
      <div
        className={"flex flex-col gap-2 justify-start dark:bg-gray-900 h-full"}
      >
        <div
          className={
            "flex justify-between md:flex-row flex-col items-center bg-white dark:bg-gray-800 p-2 px-4"
          }
        >
          <div className="title-page flex items-center gap-2 bg-none text-start w-full md:py-4 py-3 text-base sm:text-lg md:text-xl text-gray-600">
            <div className={"p-2 rounded-full bg-gray-100 dark:bg-gray-900"}>
              <RiSettings3Line
                size="20"
                className={"group-hover:text-primary-500  dark:text-gray-100"}
              />
            </div>
            <div>
              <h3 className={"text-black dark:text-gray-200 text-lg"}>
                {t("Settings Page")}
              </h3>
              <p className={"dark:text-gray-400 text-sm"}>
                {t("Manage your preferences and configure various options.")}
              </p>
            </div>
          </div>
        </div>
        <div className="max-h-screen md:px-10 px-5  box-border flex flex-col gap-4">
          <Tabs tabs={tabsData} />
        </div>
      </div>
    </>
  );
}

export default SettingPage;
