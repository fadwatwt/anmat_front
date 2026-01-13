"use client";
import { useParams } from 'next/navigation';
import Page from "@/components/Page.jsx";
import {useTranslation} from "react-i18next";
import {
    RiCheckboxCircleFill,
    RiReceiptLine,
    RiCoinLine,
    RiCalendarLine,
    RiDiscountPercentLine,
     RiCheckboxCircleLine, RiCheckLine
} from "@remixicon/react";


const FeatureItem = ({text}) => {
    return (
            <div className={"flex gap-2 justify-start items-center"}>
                <RiCheckLine size={"18"} className={"text-blue-500"} />
                <span className={"text-gray-500 text-md"}>Access to core dashboard features</span>
            </div>
    )
}

function PlanDetails() {
    const {t,i18n} = useTranslation()
    const { slug } = useParams();
    console.log({ slug });
    return (
        <Page isTitle={false} className={"w-full"}>

            <div className={"w-full flex flex-col items-center md:gap-6 xl:gap-4 gap-8 h-full"}>
                <div className={"relative flex min-h-48 justify-center  w-full h-full md:mb-0 mb-44"}>
                    <div className={"w-full md:h-40 h-[50vh]"}>
                        <img className={"max-w-full w-full max-h-full object-cover"} src={"/images/profileBanner.png"} alt={""} />
                    </div>
                    <p className={"absolute top-3 right-3 text-sm text-white"}>{t("Change")}</p>
                    <div className={"absolute md:top-1/3 top-[50px] w-full md:px-10 px-2"}>
                        <div className={" rounded-2xl p-4 border dark:border-gray-700 flex bg-white dark:bg-gray-800"}>
                            <div
                                className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-6 flex-1"}>
                                <div className={"flex justify-between items-center"}>
                                    <div className={"relative h-[72px] w-[72px]"}>
                                        <img className={"rounded-full h-[72px] w-[72px] max-w-full"}
                                             src={"https://randomuser.me/api/portraits/men/1.jpg"} alt={"image-user"}/>
                                        <RiCheckboxCircleFill size="23"
                                                              className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-full text-cyan-500"/>
                                    </div>
                                    <button
                                        className={"p-1.5 rounded-lg md:hidden text-nowrap bg-none border text-sm dark:border-gray-700 dark:text-gray-200 self-start"}>{t("Edit profile")}
                                    </button>
                                </div>
                                <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                    <div className={`flex flex-col gap-4 flex-1  ${i18n.language === "ar" ? "md:border-l-2 " :"md:border-r-2 "}`}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiReceiptLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Name")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100"}>Basic Plan</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCoinLine size={18} className={"text-soft-400 dark:text-gray-300"}/>
                                            <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Price (per month)")}:</p>
                                            <p className={"text-black text-sm dark:text-gray-100"}>456 USD</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCalendarLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Duration")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100"}>Month</p>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col gap-4 flex-1"}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiDiscountPercentLine size="18" className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Discount")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100"}>{t("10%")}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCheckboxCircleLine size="18" className="text-soft-400 dark:text-gray-300"/>
                                            <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Free Trial")}:</p>
                                            <p className={"text-black text-sm dark:text-gray-100"}>{t("Active")}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCalendarLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Free Trial Duration")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100"}>{t("Week")}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-none border text-sm self-start dark:text-gray-200 dark:border-gray-700"}>
                                    {t("Edit Plan")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"flex gap-6 md:flex-row flex-col items-start w-full md:px-10 px-2 justify-between"}>
                    <div className={"md:w-full w-full flex flex-col gap-4 items-center h-full"}>
                        <div className={"bg-white rounded-2xl p-4 gap-6 md:flex-1 flex flex-col dark:bg-gray-800 items-center w-full p-5"}>
                            <div className={"w-full border border-gray-200 rounded-md flex flex-col gap-4 p-4"}>
                                <h3>Features</h3>
                                <div className={"w-full grid grid-flow-col grid-rows-3 gap-3 "}>
                                    <FeatureItem text={"Access to core dashboard features"} />
                                    <FeatureItem text={"Access to core dashboard features"} />
                                    <FeatureItem text={"Access to core dashboard features"} />
                                    <FeatureItem text={"Access to core dashboard features"} />
                                    <FeatureItem text={"Access to core dashboard features"} />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default PlanDetails;