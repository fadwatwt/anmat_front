"use client"

import PropTypes from 'prop-types';
import SearchInput from "./Form/SearchInput.jsx";
import MenuItem from "./Menu/MenuItem.jsx";
import { useTranslation } from "react-i18next";
import React from "react"
import { Setting, Edit, Share, Messages1, Category, Profile2User, TaskSquare, NoteText, Chart2, HambergerMenu, Cpu } from 'iconsax-react';

const Menu = React.memo(({ isSlidebarOpen, toggleSlidebarOpen }) => {
    console.log("Render Menu", { isSlidebarOpen });

    const { t, i18n } = useTranslation()

    // const tweet = {
    //     images: [
    //         "https://mybayutcdn.bayut.com/mybayut/wp-content/uploads/Heydar-Aliyev-Center-Baku-Azerbaijan-ar02072020-1024x640.jpg",
    //         "https://www.alquds.co.uk/wp-content/uploads/2024/02/07-11.jpg",
    //         "https://i.cdn.turner.com/dr/cnnarabic/cnnarabic/release/sites/default/files/styles/landscape_780x440/public/image/1_6.JPG?itok=pmNMX7TP",
    //         "https://cdn.cgway.net/wp-content/uploads/2023/12/the-most-famous-arab-architects-01.jpg"
    //     ],
    //     text: "We&apos;re excited to welcome <span class={'text-primary-base'}>@Ahemd</span> toour team! Next month, we&apos;ll be unveiling a rangeof new features designed to elevate your experience with our software. Keep an eyeout for more updates!",
    //     accountName:"Ahmed Mohammed",
    //     date:` 25  ${t("Dec")}  - 1:30  ${t("PM")}`,
    // }
    // const myAccount = {
    //     imageProfile:"https://sowarprofil.com/wp-content/uploads/2024/04/%D8%B5%D9%88%D8%B1%D8%A9-%D8%A7%D9%84%D9%85%D9%84%D9%81-%D8%A7%D9%84%D8%B4%D8%AE%D8%B5%D9%8A-%D9%81%D9%8A-%D8%A7%D9%84%D9%81%D9%8A%D8%B3%D8%A8%D9%88%D9%83-1-1024x1024.png.webp"
    // }
    return (
        <div
            className={`md:relative md:translate-x-0 min-h--[100vh] bg-white dark:bg-gray-800 w-[272px] max-w-[272px] 
        h-screen fixed flex flex-col gap-5 top-0 z-40 transition-transform 
        ${i18n.language === "ar" ? "right-0" : "left-0"} 
        ${isSlidebarOpen ? "translate-x-0" : (i18n.language === "ar" ? "translate-x-full" : "-translate-x-full")}`}
        >
            <div className={" h-32 flex p-5 gap-2 border-b-2 dark:border-gray-600 items-center"}>
                <div className={"profile-image"}>
                    <img src="/images/logo.png" alt={"img"}
                        className={" w-10 h-10 rounded-full m-0 p-0"} />
                </div>
                <div className={"flex flex-col  gap-2 justify-center  "}>
                    <p className={"text-sm dark:text-white text-start truncate w-28 md:w-full"}>{t("Employees Management")}</p>
                    <p className={"text-xs dark:text-white text-gray-500 truncate w-28 md:w-full"}>{t("Employees & HR Management")}</p>
                </div>
                {
                    isSlidebarOpen && (
                        <button className="inline-flex h-8 w-8 items-center p-2 text-sm text-gray-500
                rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            onClick={toggleSlidebarOpen}>
                            <HambergerMenu />
                        </button>
                    )
                }

            </div>
            <div className={"overflow-y-auto flex flex-col  tab-content justify-between"}>
                <div className="md:hidden px-5 pt-5">
                    <SearchInput />
                </div>
                <div className={"flex  flex-col gap-2"}>
                    <div className={"py-5 menu-list sm:py-0 flex flex-col gap-2 text-gray-500"}>
                        <MenuItem path={"/dashboard"} icon={<Category size="32"
                            color="#375DFB" />} title={"Dashboard"} />
                        <MenuItem path={"/dashboard/projects"} icon={<NoteText size="32"
                            color="#375DFB" />} title={"Projects"} />
                        <MenuItem path={"/dashboard/tasks"} icon={<TaskSquare size="32"
                            color="#375DFB" />} title={"Tasks"} />
                        <MenuItem path={"/dashboard/analytics"} icon={<Chart2 size="32"
                            color="#375DFB" />} title={"Analytics"} />
                        <MenuItem path={"/dashboard/hr"} icon={<Profile2User size="32"
                            color="#375DFB" />} title={"HR Management"} />
                        <MenuItem path={"/dashboard/conversations"} icon={<Messages1 size="32"
                            color="#375DFB" />} title={"Conversations"} />
                        <MenuItem path={"/dashboard/social-media"} icon={<Share size="32"
                            color="#375DFB" />} title={"Social Media"} />
                        <MenuItem path={"/dashboard/time-line"} icon={<Edit size="32"
                            color="#375DFB" />} title={"Timeline"} />
                        <MenuItem path={"/dashboard/setting"} icon={<Setting size="32"
                            color="#375DFB" />} title={"Settings"} />
                        <MenuItem path={"/ai-assistant"} icon={<Cpu size="32"
                            color="#375DFB" />} title={"AI Assistant"} />
                    </div>
                </div>
                {/*<BriefTimeLine tweet={tweet} myAccount={myAccount}/>*/}
            </div>
        </div>
    );
});

Menu.propTypes = {
    isSlidebarOpen: PropTypes.bool,
    toggleSlidebarOpen: PropTypes.func,
};

Menu.displayName = "MenuComponent"

export default React.memo(Menu);