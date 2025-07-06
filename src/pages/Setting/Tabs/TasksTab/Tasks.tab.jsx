
import Sidebar from "../../../../components/Subcomponents/Sidebar.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import TabModal from "../../../../components/Modal/TabsContener/TabModal.jsx";
import Tasks from "./SidebarItems/Tasks.jsx";
import Rating from "./SidebarItems/Rating.jsx";
import {RiStarLine, RiTaskFill} from "@remixicon/react";


function TasksTab() {
    const {t} = useTranslation()
    const listSideBar = [
        {id:"tasks",title:"Tasks",icon:<RiTaskFill/>},
        {id:"rating",title:"Rating",icon:<RiStarLine />}
    ]
    const [activeTab, setActiveTab] = useState('tasks');

    const handelChangeActiveTab = (activeTap) => {
        setActiveTab(activeTap);
    }
    const tabsData = [
        {
            title: "Tasks Preferences",
            content: <Tasks />,
            icon:<RiTaskFill/>
        },
        {
            title: "Adding Rating Categories",
            content:<Rating />,
            icon:<RiStarLine />,
        },
    ];
    return (
        <div className={"flex lg:gap-32 md:20 gap-10 w-full md:flex-row flex-col"}>
            <div className={"hidden md:block"}>
                <div className={"bg-white dark:bg-gray-800 py-3 px-2 lg:w-64 w-48 flex flex-col gap-2 rounded-lg "}>
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
                        activeTab === 'tasks' ? <Tasks/> : <Rating />
                    }
                </div>
            </div>

        </div>

    );
}

export default TasksTab;