"use client";
// import { useState } from "react";
import { RiBuilding2Line } from "react-icons/ri";
import Page from "@/components/Page.jsx";
import AttendanceTable from "@/app/dashboard/profile/manager-profile/_components/AttendanceTable";
import ToDoList from "@/app/dashboard/profile/_components/ToDoList.jsx";

import {
    RiBriefcaseLine,
    RiCake2Line,
    RiCheckboxCircleFill,
    RiGraduationCapLine,
    RiMailLine,
    RiUserLine
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import RotationTable from "@/app/dashboard/profile/manager-profile/_components/RotationTable";


function ManagerProfilePage() {
    // const [slug, setSlug] = useState("66e69ec5845e00ff449e6d62-kirollos");
    // const [employeeId] = slug.split('-')[0];
    const { t, i18n } = useTranslation()

    return (
        <Page isTitle={false} className={"w-full"}>
            <div className={"w-full flex flex-col items-center gap-6"}>
                {/* Employee Profile Header */}
                <div className={"relative flex min-h-48 justify-center  w-full h-full md:mb-0 mb-44"}>
                    <div className={"w-full md:h-40 h-[50vh]"}>
                        <img className={"max-w-full w-full max-h-full object-cover"} src={"/images/profile_bg.png"} alt={""} />
                    </div>
                    <p className={"absolute top-3 right-3 text-sm text-white"}>{t("Change")}</p>
                    <div className={"absolute md:top-1/3 top-[50px] w-full md:px-10 px-2"}>
                        <div className={" rounded-2xl p-4 border dark:border-gray-700 flex bg-white dark:bg-gray-800"}>
                            <div
                                className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-6 flex-1"}>
                                <div className={"flex justify-between items-center"}>
                                    <div className={"relative h-[72px] w-[72px]"}>
                                        <img className={"rounded-full h-[72px] w-[72px] max-w-full"}
                                            src={"https://randomuser.me/api/portraits/men/1.jpg"} alt={"image-user"} />
                                        <RiCheckboxCircleFill size="23"
                                            className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-full text-cyan-500" />
                                    </div>
                                    <button
                                        className={"p-1.5 rounded-lg md:hidden text-nowrap bg-none border text-sm dark:border-gray-700 dark:text-gray-200 self-start"}>{t("Edit profile")}
                                    </button>
                                </div>
                                <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                    <div
                                        className={`flex flex-col gap-4 flex-1  ${i18n.language === "ar" ? "md:border-l-2 " : "md:border-r-2 "}`}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiUserLine size={18}
                                                className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span
                                                className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Name")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100"}>Rawan Ahmed</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCake2Line size={18} className={"text-soft-400 dark:text-gray-300"} />
                                            <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Age")}:</p>
                                            <p className={"text-black text-sm dark:text-gray-100"}>21</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiGraduationCapLine size={18}
                                                className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span
                                                className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Education")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100"}>Bachelor’s Degree in
                                                Journalism</p>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col gap-4 flex-1"}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiBuilding2Line className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span
                                                className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Department")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100"}>{t("Publishing")}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiBriefcaseLine size="18" className="text-soft-400 dark:text-gray-300" />
                                            <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Role")}:</p>
                                            <p className={"text-black text-sm dark:text-gray-100"}>{t("Senior Manager")}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiMailLine size={18}
                                                className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span
                                                className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Email")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100"}>Rawan@email.com</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 items-start justify-center md:justify-end">
                                        <button
                                            type="submit"
                                            className="bg-primary-500 text-primary-50 text-nowrap text-md w-full px-2 py-2 rounded-lg cursor-pointer
                                        hover:bg-primary-600 text-center"
                                        >
                                            {"Plans & Subscription"}
                                        </button>
                                        <button
                                            className={"px-2 py-2 rounded-lg hidden md:block text-nowrap bg-none border text-md self-start dark:text-gray-200 dark:border-gray-700"}>
                                            {t("Edit profile")}
                                        </button>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className={"w-full px-10"}>
                    <div className={"bg-white rounded-2xl p-4 dark:bg-gray-800"}>
                        <AttendanceTable />
                    </div>
                </div>

                {/* Rotation Table */}
                <div className={"w-full px-10"}>
                    <div className={"bg-white rounded-2xl p-4 dark:bg-gray-800"}>
                        <RotationTable />
                    </div>
                </div>

                {/* ToDo List */}
                <div className={"w-full px-6 flex justify-start pb-16 "}>
                    <div className={" rounded-2xl w-1/2 p-4 dark:bg-gray-800"}>
                        <ToDoList
                            list={[
                                "Edit content for Marketing Trends 2024",
                                "Proofread \"Weekly Report for Publishing\"",
                                "Publish \"Holiday Campaign Articles\"",
                                "Edit content for \"Marketing Trends 2024\".",
                            ]}
                            isActions={true}
                            isFilter={true}
                            className={"flex-1 w-full"}
                        />
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default ManagerProfilePage;