import Tabs from "../../components/Tabs.jsx";
import GeneralSettingsTab from "./Tabs/GeneralSettings.tab.jsx";
import {IoSettingsOutline} from "react-icons/io5";
import {FiPlus} from "react-icons/fi";
import {useTranslation} from "react-i18next";


function SettingPage() {
    const {t} = useTranslation()
    const tabsData = [
        {
            title: "General Settings",
            content: <GeneralSettingsTab/>,
        },
        {
            title: "Notifications",
            content: <div>Twitter content goes here</div>,
        },
        {
            title: "Rotation",
            content: <div>Instagram content goes here</div>,
        },
        {
            title: "Attendance",
            content: <div>Gmail content goes here</div>,
        },
        {
            title: "Tasks",
            content: <div>Youtube content goes here</div>,
        },
        {
            title: "Privacy & Security",
            content: <div>Youtube content goes here</div>,
        },
    ];
    return (
        <>
            <div className={"flex flex-col gap-2 justify-start dark:bg-gray-900 h-full"}>
                <div className={"flex justify-between md:flex-row flex-col items-center bg-white dark:bg-gray-800 p-4"}>
                    <div
                        className="title-page flex items-center gap-2 bg-none text-start w-full md:py-6 py-3 text-base sm:text-lg md:text-xl text-gray-600">
                        <div className={"p-2 rounded-full bg-gray-100 dark:bg-gray-900"}>
                            <IoSettingsOutline
                                className={"group-hover:text-primary-500 w-[19.62px] h-[19.62px] dark:text-gray-100"}/>
                        </div>
                        <div>
                            <h3 className={"text-black dark:text-gray-200 text-lg"}>{t("Settings Page")}</h3>
                            <p className={"dark:text-gray-400 text-sm"}>{t("Manage your preferences and configure various options.")}</p>
                        </div>

                    </div>
                    <div className={"w-full flex md:justify-end justify-center items-center bg-none px-2"}>
                        <div className={"flex flex-wrap gap-2 md:w-auto w-full"}>
                            <button
                                className={"bg-none p-2.5 md:w-48 flex-1 justify-center  rounded-[10px] flex gap-1 items-center dark:text-primary-200 dark:border-primary-200  border border-primary-500 text-primary-500"}>
                                <FiPlus size={20}/>
                                <span className={"text-base"}>{t("Add Department")} </span>
                            </button>
                            <button
                                className={"bg-none p-2 md:w-48 flex-1 flex gap-1 justify-center rounded-[10px] items-center border border-primary-500 dark:text-primary-200 dark:border-primary-200 text-primary-500"}>
                                <FiPlus size={20}/>
                                <span className={"text-base"}>{t("Add Employee")} </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-h-screen md:px-10 px-5  box-border flex flex-col gap-4">
                    <Tabs tabs={tabsData}/>
                </div>
            </div>
        </>
    )
        ;
}

export default SettingPage;