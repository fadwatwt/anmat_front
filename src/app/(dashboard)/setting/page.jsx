"use client";
import { useMemo, useState } from "react";
import Tabs from "@/components/Tabs.jsx";
import GeneralSettingsTab from "./Tabs/GeneralSettings.tab.jsx";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import AttendanceTab from "./Tabs/Attendance.tab.jsx";
import ConversationsTab from "./Tabs/Conversations.tab.jsx";
import TasksTab from "./Tabs/TasksTab/Tasks.tab.jsx";
import ProfileSecurityTab from "./Tabs/Profile&SecurityTab/ProfileSecurity.tab.jsx";
import NotificationsTab from "./Tabs/NotificationsTab/NotificationsTab.jsx";
import AiSettingsTab from "./Tabs/AiSettings.tab.jsx";
import { RiSettings3Line } from "@remixicon/react";
import { RiCloseLine } from "react-icons/ri";
import { useSelector } from "react-redux";

function SettingPage() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");

  const tabsData = useMemo(() => {
    const commonTabs = [
      {
        title: t("Notifications"),
        content: <NotificationsTab />,
      },
      {
        title: t("Privacy & Security"),
        content: <ProfileSecurityTab />,
      },
    ];

    if (user?.type === "Subscriber") {
      return [
        {
          title: t("General Settings"),
          content: <GeneralSettingsTab />,
        },
        commonTabs[0],
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
        commonTabs[1],
      ];
    }

    if (user?.type === "Admin") {
      return [
        ...commonTabs,
        {
          title: t("AI Assistant"),
          content: <AiSettingsTab />,
        },
      ];
    }

    return commonTabs;
  }, [t, user?.type]);

  // Filter tabs by the search query (matches the translated tab title)
  const visibleTabs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tabsData;
    return tabsData.filter((tab) =>
      tab.title.toLowerCase().includes(query)
    );
  }, [tabsData, searchQuery]);

  return (
    <>
      <div
        className={"flex flex-col gap-4 justify-start bg-main h-full"}
      >
        <div
          className={
            "flex justify-between md:flex-row flex-col items-center bg-surface border border-status-border rounded-2xl p-2 px-4"
          }
        >
          <div className="title-page flex items-center gap-2 bg-none text-start w-full md:py-4 py-3 text-base sm:text-lg md:text-xl text-cell-secondary">
            <div className={"p-2 rounded-full bg-status-bg"}>
              <RiSettings3Line
                size="20"
                className={"group-hover:text-primary-500"}
              />
            </div>
            <div>
              <h3 className={"text-cell-primary text-lg"}>
                {t("Settings Page")}
              </h3>
              <p className={"text-sm"}>
                {t("Manage your preferences and configure various options.")}
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-72 mb-2 md:mb-0">
            <FiSearch
              size={16}
              className="absolute top-1/2 start-3 -translate-y-1/2 text-cell-secondary pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("Search settings...")}
              aria-label={t("Search settings...")}
              className="w-full py-2 ps-9 pe-9 rounded-lg bg-status-bg border border-status-border text-sm text-cell-primary outline-none focus:border-primary-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label={t("Clear search")}
                className="absolute top-1/2 end-3 -translate-y-1/2 text-cell-secondary hover:text-cell-primary"
              >
                <RiCloseLine size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="box-border flex flex-col gap-4 pb-6">
          <p className="text-xs text-cell-secondary flex items-center gap-1.5 -mt-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-400" />
            {t('Changes are saved when you click "Apply Changes" or "Save" within each section.')}
          </p>

          {visibleTabs.length > 0 ? (
            <Tabs tabs={visibleTabs} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-cell-secondary">
              <FiSearch size={28} className="opacity-50" />
              <p className="text-sm">{t("No sections match your search.")}</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-sm text-primary-base dark:text-primary-200 underline"
              >
                {t("Show all sections")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SettingPage;
