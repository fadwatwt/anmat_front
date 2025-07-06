import {useTranslation} from "react-i18next";
import {useState} from "react";
import Sidebar from "../../../../components/Subcomponents/Sidebar.jsx";
import TabModal from "../../../../components/Modal/TabsContener/TabModal.jsx";
import {RiLock2Line, RiUserLine} from "@remixicon/react";
import PersonalInformation from "./SidebarItems/PersonalInformation.jsx";
import ChangePassword from "./SidebarItems/ChangePassword.jsx";

function ProfileSecurityTab() {
    const {t} = useTranslation()
    const listSideBar = [
        {id: "personalInformation", title: "Personal information", icon: <RiUserLine  />},
        {id: "changePassword", title:"Change Password",icon:<RiLock2Line />}
    ]
    const [activeTab, setActiveTab] = useState('personalInformation');

    const handelChangeActiveTab = (activeTap) => {
        setActiveTab(activeTap);
    }
    const tabsData = [
        {
            title: "Personal information",
            content: <PersonalInformation />,
            icon:""
        },
        {
            title: "Change Password",
            content:<ChangePassword />,
            icon:"",
        },
    ];
    return (
        <div className={"flex lg:gap-32 md:20 gap-10 w-full md:flex-row flex-col"}>
            <div className={"hidden md:block"}>
                <div className={"bg-white dark:bg-gray-800 py-3 px-2 lg:w-64 w-48  flex flex-col gap-2 rounded-lg "}>
                    <p className={"uppercase text-sm px-3 text-start dark:text-gray-200"}>{t("select menu")}</p>
                    <Sidebar activeItem={activeTab} onClick={handelChangeActiveTab} list={listSideBar}/>
                </div>
            </div>
            <div className={"md:p-5 p-2 rounded-2xl bg-white dark:bg-gray-800 lg:w-[39%]"}>
                <div className={"md:hidden block"}>
                    <TabModal classNameItem={"justify-start mx-1 "} classNameContent={"h-[calc(100vh-25rem)]"} tabs={tabsData}/>
                </div>

                <div className={"hidden md:block"}>
                    {
                        activeTab === 'personalInformation' ? <PersonalInformation/> : <ChangePassword />
                    }
                </div>
            </div>

        </div>

    );
}

export default ProfileSecurityTab;