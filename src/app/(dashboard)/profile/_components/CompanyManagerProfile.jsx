"use client";
import {
    RiBriefcaseLine,
    RiBuilding2Line,
    RiCheckboxCircleFill,
    RiGraduationCapLine,
    RiMailLine,
    RiPhoneLine,
    RiUserLine
} from "@remixicon/react";
import Page from "@/components/Page.jsx";
import ToDoList from "@/app/(dashboard)/profile/_components/components/ToDoList.jsx";
import OrganizationCard from "@/app/(dashboard)/profile/_components/company_manager/OrganizationCard";
import WorkInformation from "@/app/(dashboard)/profile/_components/company_manager/WorkInformation";
import Subscriptions from "@/app/(dashboard)/profile/_components/company_manager/Subscriptions";
import { useTranslation } from "react-i18next";
import { RiCake2Line } from "react-icons/ri";
import { useState } from "react";
import EditProfileModal from "@/app/(dashboard)/profile/_components/modals/EditProfile.modal.jsx";
import ChangePasswordModal from "@/app/(dashboard)/profile/_components/modals/ChangePassword.modal.jsx";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";
import { useUpdateUserAccountMutation } from "@/redux/auth/authAPI";

function CompanyManagerProfile() {
    const { t, i18n } = useTranslation();
    const user = useSelector(selectUser);
    const [updateUserAccount, { isLoading: isUpdating }] = useUpdateUserAccountMutation();
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    return (
        <Page isTitle={false} className={"w-full"}>
            <div className={"w-full flex flex-col items-center gap-6"}>
                {/* Employee Profile Header */}
                <div className={"relative flex min-h-48 justify-center w-full h-full md:mb-0 mb-52"}>
                    <div className={"w-full md:h-40 h-[50vh]"}>
                        <img className={"max-w-full w-full max-h-full object-cover"} src={"/images/profile_bg.png"} alt={""} />
                    </div>
                    <p className={"absolute top-3 right-3 text-sm text-white cursor-pointer hover:underline"}>{t("Change")}</p>
                    <div className={"absolute md:top-1/3 top-[50px] w-full md:px-10 px-2"}>
                        <div className={"rounded-2xl p-6 border dark:border-gray-700 flex bg-white dark:bg-gray-800 shadow-sm"}>
                            <div className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-6 flex-1"}>

                                {/* Avatar and Name/Role mobile view? No, standard view */}
                                <div className={"flex justify-between items-start"}>
                                    <div className={"relative h-[80px] w-[80px]"}>
                                        <img className={"rounded-full h-[80px] w-[80px] object-cover border-4 border-white dark:border-gray-800"}
                                            src={user?.avatar || "/images/userProfile.dark.png"} alt={"image-user"} />
                                        <RiCheckboxCircleFill size="24"
                                            className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-full text-blue-500" />
                                    </div>
                                    <button
                                        onClick={() => setIsEditProfileOpen(true)}
                                        className={"p-2 rounded-lg md:hidden text-nowrap bg-none border text-sm dark:border-gray-700 dark:text-gray-200 self-start"}>
                                        {t("Edit profile")}
                                    </button>
                                </div>

                                {/* Info Grid */}
                                <div className={"w-full grid grid-cols-1 md:grid-cols-3 gap-6"}>

                                    {/* Col 1 */}
                                    <div className={`flex flex-col gap-3 ${i18n.language === "ar" ? "md:border-l md:pl-6" : "md:border-r md:pr-6"} border-gray-200 dark:border-gray-700`}>
                                        <div className={"flex items-center gap-2"}>
                                            <RiUserLine size={18} className={"text-gray-400"} />
                                            <span className={"text-gray-400 text-sm"}>{t("Name")}:</span>
                                            <p className={"text-gray-900 dark:text-white text-sm font-medium"}>{user?.name || "N/A"}</p>
                                        </div>
                                        <div className={"flex items-center gap-2"}>
                                            <RiCake2Line size={18} className={"text-gray-400"} />
                                            <span className={"text-gray-400 text-sm"}>{t("Age")}:</span>
                                            <p className={"text-gray-900 dark:text-white text-sm font-medium"}>{user?.age || "N/A"}</p>
                                        </div>
                                        <div className={"flex items-center gap-2"}>
                                            <RiGraduationCapLine size={18} className={"text-gray-400"} />
                                            <span className={"text-gray-400 text-sm"}>{t("Education")}:</span>
                                            <p className={"text-gray-900 dark:text-white text-sm font-medium truncate"}>{user?.education || "N/A"}</p>
                                        </div>
                                        <div className={"flex items-center gap-2"}>
                                            <RiBuilding2Line size={18} className={"text-gray-400"} />
                                            <span className={"text-gray-400 text-sm"}>{t("Department")}:</span>
                                            <p className={"text-gray-900 dark:text-white text-sm font-medium"}>{user?.department?.name || t("N/A")}</p>
                                        </div>
                                    </div>

                                    {/* Col 2 */}
                                    <div className={`flex flex-col gap-3 md:px-2`}>

                                        <div className={"flex items-center gap-2"}>
                                            <RiBriefcaseLine size={18} className={"text-gray-400"} />
                                            <span className={"text-gray-400 text-sm"}>{t("Role")}:</span>
                                            <p className={"text-gray-900 dark:text-white text-sm font-medium"}>{user?.type || t("N/A")}</p>
                                        </div>
                                        <div className={"flex items-center gap-2"}>
                                            <RiMailLine size={18} className={"text-gray-400"} />
                                            <span className={"text-gray-400 text-sm"}>{t("Email")}:</span>
                                            <p className={"text-gray-900 dark:text-white text-sm font-medium"}>{user?.email || "N/A"}</p>
                                        </div>
                                        <div className={"flex items-center gap-2"}>
                                            <RiPhoneLine size={18} className={"text-gray-400"} />
                                            <span className={"text-gray-400 text-sm"}>{t("Phone Number")}:</span>
                                            <div className="flex items-center gap-2">
                                                <p className={"text-gray-900 dark:text-white text-sm font-medium"}>{user?.phone || user?.phoneNumber || "N/A"}</p>
                                                {user?.is_verified && (
                                                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                                        <RiCheckboxCircleFill size={10} /> {t("Verified")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Col 3: Actions */}
                                    <div className="flex flex-col gap-3 items-end justify-between">
                                        <div className="flex gap-3 w-full md:w-auto">
                                            <button className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap">
                                                {t("Plans & Subscription")}
                                            </button>
                                            <button
                                                onClick={() => setIsEditProfileOpen(true)}
                                                className="hidden md:block border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap">
                                                {t("Edit profile")}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setIsChangePasswordOpen(true)}
                                            className="w-full md:w-auto bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors whitespace-nowrap">
                                            {t("Change password")}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organization Card */}
                <div className={"w-full px-4 md:px-10 "}>
                    <OrganizationCard />
                </div>

                {/* Middle Section: To Do List + Work Info */}
                <div className={"w-full px-4 md:px-10 flex flex-col lg:flex-row gap-6"}>
                    {/* To Do List */}
                    <div className={"flex-[1.5]"}>
                        <ToDoList
                            list={[
                                "Edit content for \"Marketing Trends 2024\"",
                                "Proofread \"Weekly Report for Publishing\"",
                                "Publish \"Holiday Campaign Articles\"",
                                "Edit content for \"Marketing Trends 2024\".",
                                "Schedule \"December Newsletter\"",
                            ]}
                            isActions={true}
                            isFilter={true}
                            className={"h-full"}
                        />
                    </div>
                    {/* Work Information */}
                    <div className={"flex-1"}>
                        <WorkInformation />
                    </div>
                </div>

                {/* Subscriptions */}
                <div className={"w-full px-4 md:px-10 pb-16"}>
                    <Subscriptions />
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                user={user}
                updateProfile={updateUserAccount}
                isLoading={isUpdating}
            />
            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
        </Page>
    );
}

export default CompanyManagerProfile;