"use client"
import PropTypes from 'prop-types';
import SearchInput from "./Form/SearchInput.jsx";
import MenuItem from "./Menu/MenuItem.jsx";
import {useTranslation} from "react-i18next";
import React from "react"
import {
    // Setting,
    // Edit ,
    // Share,
    // Messages1,
    Category,Profile2User,TaskSquare,NoteText,Chart2,HambergerMenu} from 'iconsax-react';


const MenuAdmin = React.memo(({ isSlidebarOpen, taggleSlidebarOpen }) => {
    const {t,i18n} = useTranslation()

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
            className={`md:relative md:translate-x-0 bg-white dark:bg-gray-800 w-[272px] max-w-[272px] 
        h-screen fixed flex flex-col gap-5 top-0 z-40 transition-transform 
        ${i18n.language === "ar" ? "right-0" : "left-0"} 
        ${isSlidebarOpen ? "translate-x-0" : (i18n.language === "ar" ? "translate-x-full" : "-translate-x-full")}`}
        >
            <div className={" h-32 flex p-5 gap-2 border-b-2 dark:border-gray-600 items-center"}>
                <div className={"profile-image"}>
                    <img src="/images/logo.png" alt={"img"}
                         className={" w-10 h-10 rounded-full m-0 p-0"}/>
                </div>
                <div className={"flex flex-col  gap-2 justify-center  "}>
                    <p className={"text-sm dark:text-white text-start truncate w-28 md:w-full"}>{t("Employees Management")}</p>
                    <p className={"text-xs dark:text-white text-gray-500 truncate w-28 md:w-full"}>{t("Employees & HR Management")}</p>
                </div>
                {
                    isSlidebarOpen && (
                        <button className="inline-flex h-8 w-8 items-center p-2 text-sm text-gray-500
                rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                onClick={taggleSlidebarOpen}>
                            <HambergerMenu />
                        </button>
                    )
                }

            </div>
            <div className={"overflow-y-auto flex flex-col  tab-content justify-between"}>
                <div className="md:hidden px-5 pt-5">
                    <SearchInput/>
                </div>
                <div className={"flex  flex-col gap-2"}>
                    <div className={"py-5 menu-list sm:py-0 flex flex-col gap-2 text-gray-500"}>
                        <MenuItem path={"/admin"} icon={<Category size={"18"} />} title={"Analytics"}/>
                        <MenuItem path={"/admin/companies"} icon={<NoteText/>} title={"Companies"}/>
                        <MenuItem path={"/admin/plans"} icon={<TaskSquare />} title={"Plans"}/>
                        <MenuItem path={"/admin/subscriptions"} icon={<Chart2 />} title={"Subscriptions"}/>
                        <MenuItem path={"/admin/orders"} icon={<Profile2User />} title={"Orders"}/>
                        <MenuItem path={"/ai-assistant"} icon={
                          <span className="relative flex items-center justify-center">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_6px_rgba(55,93,251,0.5)] animate-pulse">
                              <g clipPath="url(#clip0_33_14791)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M7.85714 3.14286C8.20795 3.14286 8.51625 3.37541 8.61263 3.71272L9.46455 6.69444C9.83743 7.99954 10.8576 9.01971 12.1627 9.3926L15.1444 10.2445C15.4817 10.3409 15.7143 10.6492 15.7143 11C15.7143 11.3508 15.4817 11.6591 15.1444 11.7555L12.1627 12.6074C10.8576 12.9803 9.83743 14.0005 9.46455 15.3056L8.61263 18.2873C8.51625 18.6246 8.20795 18.8571 7.85714 18.8571C7.50634 18.8571 7.19803 18.6246 7.10166 18.2873L6.24974 15.3056C5.87685 14.0005 4.85669 12.9803 3.55158 12.6074L0.569862 11.7555C0.232554 11.6591 0 11.3508 0 11C0 10.6492 0.232554 10.3409 0.569862 10.2445L3.55159 9.3926C4.85669 9.01971 5.87685 7.99954 6.24974 6.69444L7.10166 3.71272C7.19803 3.37541 7.50634 3.14286 7.85714 3.14286Z" fill="#375DFB"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.2857 0C17.6463 0 17.9605 0.245376 18.048 0.595151L18.3192 1.67992C18.5655 2.6652 19.3348 3.43452 20.3201 3.68084L21.4048 3.95203C21.7546 4.03947 22 4.35375 22 4.71429C22 5.07482 21.7546 5.3891 21.4048 5.47654L20.3201 5.74773C19.3348 5.99405 18.5655 6.76337 18.3192 7.74865L18.048 8.83342C17.9605 9.18319 17.6463 9.42857 17.2857 9.42857C16.9252 9.42857 16.6109 9.18319 16.5235 8.83342L16.2523 7.74865C16.0059 6.76337 15.2366 5.99405 14.2513 5.74773L13.1666 5.47654C12.8168 5.3891 12.5714 5.07482 12.5714 4.71429C12.5714 4.35375 12.8168 4.03947 13.1666 3.95203L14.2513 3.68084C15.2366 3.43452 16.0059 2.6652 16.2523 1.67992L16.5235 0.595151C16.6109 0.245376 16.9252 0 17.2857 0Z" fill="#375DFB"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.7143 14.1429C16.0525 14.1429 16.3527 14.3593 16.4597 14.6801L16.8727 15.9192C17.0291 16.3884 17.3973 16.7566 17.8666 16.913L19.1056 17.326C19.4264 17.433 19.6429 17.7332 19.6429 18.0714C19.6429 18.4096 19.4264 18.7099 19.1056 18.8168L17.8666 19.2298C17.3973 19.3863 17.0291 19.7545 16.8727 20.2237L16.4597 21.4627C16.3527 21.7836 16.0525 22 15.7143 22C15.3761 22 15.0758 21.7836 14.9689 21.4627L14.5559 20.2237C14.3995 19.7545 14.0313 19.3863 13.562 19.2298L12.323 18.8168C12.0021 18.7099 11.7857 18.4096 11.7857 18.0714C11.7857 17.7332 12.0021 17.433 12.323 17.326L13.562 16.913C14.0313 16.7566 14.3995 16.3884 14.5559 15.9192L14.9689 14.6801C15.0758 14.3593 15.3761 14.1429 15.7143 14.1429Z" fill="#A3B6FD"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_33_14791">
                                  <rect width="22" height="22" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                            <span className="absolute w-6 h-6 rounded-full bg-blue-400 opacity-30 blur-lg animate-ping"></span>
                          </span>
                        } title={"AI Assistant"}/>
                    </div>
                </div>
                {/*<BriefTimeLine tweet={tweet} myAccount={myAccount}/>*/}
            </div>
        </div>
    );
});

MenuAdmin.displayName = "MenuAdmin";

MenuAdmin.propTypes = {
    isSlidebarOpen: PropTypes.bool,
    taggleSlidebarOpen: PropTypes.func,
};

export default MenuAdmin;