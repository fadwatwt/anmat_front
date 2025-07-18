import { useState, useMemo } from "react";
import Sidebar from "@/components/Subcomponents/Sidebar.jsx";
import { IoOptionsOutline } from "react-icons/io5";
import { RiNotification2Line } from "react-icons/ri";
import TabModal from "@/components/Modal/TabsContener/TabModal.jsx";
import NotificationPreferences from "./NotificationPreferences.jsx";
import NotificationMethods from "./NotificationMethods.jsx";
import { useTranslation } from "react-i18next";
import {RiEqualizerLine, RiNotification4Line} from "@remixicon/react";

function NotificationsTab() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("notification-preferences");

  const listSideBar = useMemo(
    () => [
      {
        id: "notification-preferences",
        title: t("Notification Preferences"),
        icon: <IoOptionsOutline />,
      },
      {
        id: "notification-methods",
        title: t("Notification Methods"),
        icon: <RiNotification2Line />,
      },
    ],
    [t]
  );

  const tabsData = useMemo(
    () => [
      {
        id: "notification-preferences",
        title: t("Notification Preferences"),
        content: <NotificationPreferences />,
        icon: <RiEqualizerLine />,
      },
      {
        id: "notification-methods",
        title: t("Notification Methods"),
        content: <NotificationMethods />,
        icon: <RiNotification4Line />,
      },
    ],
    [t]
  );

  return (
    <div className="flex lg:gap-32 md:20 gap-10  w-full md:flex-row flex-col">
      <div className="hidden md:block">
        <div className="bg-white dark:bg-gray-800 py-3 px-2 lg:w-64 w-48 flex flex-col gap-2 rounded-lg">
          <p className="uppercase text-sm px-3 text-start dark:text-gray-200">
            {t("select menu")}
          </p>
          <Sidebar
            activeItem={activeTab}
            onClick={setActiveTab}
            list={listSideBar}
          />
        </div>
      </div>

      <div className="md:p-5 p-2 rounded-2xl bg-white dark:bg-gray-800 lg:w-[39%]">
        <div className="md:hidden block">
          <TabModal
            classNameItem="justify-start mx-1"
            classNameContent="h-[30rem]"
            tabs={tabsData}
          />
        </div>

        <div className="hidden md:block">
          {tabsData.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}

export default NotificationsTab;
