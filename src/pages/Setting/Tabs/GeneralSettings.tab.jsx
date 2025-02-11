
import RegionalPreferences from "../components/RegionalPreferences.jsx";
import Sidebar from "../../../components/Subcomponents/Sidebar.jsx";
import {SlGlobe} from "react-icons/sl";
import {IoSunnyOutline} from "react-icons/io5";
import {useState} from "react";
import ThemeOptions from "../components/ThemeOptions.jsx";
import {useTranslation} from "react-i18next";
import TabModal from "../../../components/Modal/TabsContener/TabModal.jsx";


function GeneralSettingsTab() {
    const {t} = useTranslation()
    const listSideBar = [
        {id:"regional-preferences",title:"Regional Preferences",icon:<SlGlobe/>},
        {id:"theme-options",title:"Theme Options",icon:<IoSunnyOutline />}
    ]
    const [activeTab, setActiveTab] = useState('regional-preferences');

    const handelChangeActiveTab = (activeTap) => {
        setActiveTab(activeTap);
    }
    const tabsData = [
        {
            title: "Regional Preferences",
            content: <RegionalPreferences />,
            icon:<SlGlobe/>
        },
        {
            title: "Theme Options",
            content:<ThemeOptions />,
            icon:<IoSunnyOutline />,
        },
    ];
    return (
        <div className={"flex md:gap-32 gap-10 w-full md:flex-row flex-col"}>
            <div className={"hidden md:block"}>
                <div className={"bg-white dark:bg-gray-800 py-3 px-2 w-64 flex flex-col gap-2 rounded-lg "}>
                    <p className={"uppercase text-sm px-3 text-start dark:text-gray-200"}>{t("select menu")}</p>
                    <Sidebar activeItem={activeTab} onClick={handelChangeActiveTab} list={listSideBar}/>
                </div>
            </div>
            <div className={"md:p-5 p-2 rounded-2xl bg-white dark:bg-gray-800 lg:w-[39%]"}>
                <div className={"md:hidden block"}>
                    <TabModal classNameItem={"justify-start mx-1 "} classNameContent={"h-[30rem]"} tabs={tabsData}/>
                </div>

                <div className={"hidden md:block"}>
                    {
                        activeTab === 'regional-preferences' ? <RegionalPreferences/> : <ThemeOptions />
                    }
                </div>
                </div>

        </div>

    );
}

export default GeneralSettingsTab;