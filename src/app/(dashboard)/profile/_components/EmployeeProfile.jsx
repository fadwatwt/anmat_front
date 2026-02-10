"use client";
import { useParams } from 'next/navigation';
import Table from "@/components/Tables/Table.jsx";
import Page from "@/components/Page.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { useTranslation } from "react-i18next";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel.jsx";
import TabsOutContent from "@/components/Modal/TabsContener/TabsOutContent.jsx";
import { useState } from "react";
import Rating from "@/app/(dashboard)/hr/Rating.jsx";
import EditProfileModal from "@/app/(dashboard)/profile/_components/modals/EditProfile.modal.jsx";
import ChangePasswordModal from "@/app/(dashboard)/profile/_components/modals/ChangePassword.modal.jsx";
import AddRequestModal from "@/app/(dashboard)/profile/_components/modals/AddRequest.modal.jsx";
import {
    RiCake2Line, RiCalendarLine,
    RiCheckboxCircleFill,
    RiDashboard3Line,
    RiGraduationCapLine,
    RiMailLine, RiMoneyDollarCircleLine, RiStarLine, RiTaskLine, RiTimeLine,
    RiUserLine, RiDownload2Line, RiAddLine, RiBriefcaseLine, RiBuilding2Line, RiPhoneLine,
    RiCalendarEventLine
} from "@remixicon/react";
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/auth/authSlice';
import {
    useGetEmployeeAuthRequestsQuery,
    useUpdateEmployeeDetailMutation
} from '@/redux/employees/employeeAuthRequestsApi';
import { translateDate } from '@/functions/Days';
import dayjs from 'dayjs';


function EmployeeProfile() {
    const { t, i18n } = useTranslation()
    const { slug } = useParams();
    console.log({ slug });

    const user = useSelector(selectUser);
    const { data: requests = [], isLoading: isLoadingRequests } = useGetEmployeeAuthRequestsQuery();

    const [activeTab, setActiveTab] = useState("Leave");
    const [isAddRequestModal, setIsAddRequestModal] = useState(false);
    const [isEditProfileModal, setIsEditProfileModal] = useState(false);
    const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);

    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateEmployeeDetailMutation();

    const calculateAge = (dob) => {
        if (!dob) return "-";
        return dayjs().diff(dayjs(dob), 'year');
    };

    const headerTasksRating = [
        { label: t("Task") },
        { label: t("Date") },
        { label: t("Rating") },
        { label: t("Commits") },
    ];

    const getLeaveRows = () => {
        return requests
            .filter(req => req.type === "DAY_OFF")
            .map(req => [
                req.created_at ? translateDate(req.created_at) : "-",
                t("Day Off"),
                <div key={req._id} className="flex flex-col gap-1">
                    <Status type={req.status} title={req.status} />
                    <span className="text-[10px] text-gray-500">{req.vacation_date ? translateDate(req.vacation_date) : "-"}</span>
                </div>
            ]);
    };

    const getDelayRows = () => {
        return requests
            .filter(req => req.type === "WORK_DELAY")
            .map(req => [
                req.created_at ? translateDate(req.created_at) : "-",
                t("Delay Request"),
                <div key={req._id} className="flex flex-col gap-1">
                    <Status type={req.status} title={req.status} />
                    <span className="text-[10px] text-gray-500">{req.work_due_at ? translateDate(req.work_due_at) : "-"}</span>
                </div>
            ]);
    };

    const getFinancialRows = () => {
        return requests
            .filter(req => req.type === "SALARY_ADVANCE")
            .map(req => [
                req.created_at ? translateDate(req.created_at) : "-",
                t("Salary Advance"),
                <div key={req._id} className="flex flex-col gap-1">
                    <Status type={req.status} title={req.status} />
                    <span className="text-[10px] text-gray-500">{req.advance_salary_by || "-"}</span>
                </div>
            ]);
    };
    const tabsData = [
        {
            title: "Leave",
            content: (
                <Table
                    classContainer={"max-w-full"}
                    headers={[
                        { label: t("Request Date") },
                        { label: t("Type") },
                        { label: t("Status - Vacation Date") },
                    ]}
                    rows={getLeaveRows()}
                    isActions={false}
                    isCheckInput={false}
                    isTitle={false}
                    isLoading={isLoadingRequests}
                />
            ),
        },
        {
            title: "Delay",
            content: (
                <Table
                    classContainer={"max-w-full"}
                    headers={[
                        { label: t("Request Date") },
                        { label: t("Type") },
                        { label: t("Status - Delay Date") },
                    ]}
                    rows={getDelayRows()}
                    isActions={false}
                    isCheckInput={false}
                    isTitle={false}
                    isLoading={isLoadingRequests}
                />
            ),
        },

        {
            title: "Financial",
            content: (
                <Table
                    classContainer={"max-w-full"}
                    headers={[
                        { label: t("Request Date") },
                        { label: t("Type") },
                        { label: t("Status - Details") },
                    ]}
                    rows={getFinancialRows()}
                    isActions={false}
                    isCheckInput={false}
                    isTitle={false}
                    isLoading={isLoadingRequests}
                />
            ),
        },
    ];

    const handleTabChange = (tabTitle) => {
        setActiveTab(tabTitle);
    };

    const handelAddRequestModal = () => {
        setIsAddRequestModal(!isAddRequestModal)
    }

    const handelEditProfileModal = () => {
        setIsEditProfileModal(!isEditProfileModal)
    }

    const handelChangePasswordModal = () => {
        setIsChangePasswordModal(!isChangePasswordModal)
    }

    const tasksRows = user?.employee_detail?.ratings?.map(rating => [
        rating.task_name || "-",
        rating.date ? translateDate(rating.date) : "-",
        <Rating value={rating.value || 0} />,
        <p className={"text-wrap dark:text-gray-300"}>{rating.comment || "-"}</p>
    ]) || [];
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
                                        <img className={"rounded-full h-[72px] w-[72px] max-w-full object-cover border-2 border-primary-500"}
                                            src={user?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=random`} alt={"image-user"} />
                                        {user?.is_active && (
                                            <RiCheckboxCircleFill size="23"
                                                className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-full text-cyan-500" />
                                        )}
                                    </div>
                                    <button
                                        onClick={handelEditProfileModal}
                                        className={"p-1.5 rounded-lg md:hidden text-nowrap bg-none border text-sm dark:border-gray-700 dark:text-gray-200 self-start"}>{t("Edit profile")}
                                    </button>
                                </div>
                                <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                    <div className={`flex flex-col gap-4 flex-1  ${i18n.language === "ar" ? "md:border-l-2 " : "md:border-r-2 "}`}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiUserLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Name")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{user?.name}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCake2Line size={18} className={"text-soft-400 dark:text-gray-300"} />
                                            <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Age")}:</p>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{calculateAge(user?.employee_detail?.date_of_birth)}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiGraduationCapLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Location")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>
                                                {user?.employee_detail?.city && user?.employee_detail?.country
                                                    ? `${user.employee_detail.city}, ${user.employee_detail.country}`
                                                    : user?.employee_detail?.country || user?.employee_detail?.city || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col gap-4 flex-1"}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiMailLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Email")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{user?.email}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiPhoneLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Phone")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{user?.phone || "-"}</p>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col gap-4 flex-1"}>
                                        {/* Added for symmetry if needed, or leave for other fields */}
                                    </div>
                                </div>

                                <button
                                    onClick={handelChangePasswordModal}
                                    className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-blue-100 text-blue-500 border text-sm self-start dark:text-gray-200 dark:border-gray-700"}>
                                    {t("Change password")}
                                </button>
                                <button
                                    onClick={handelEditProfileModal}
                                    className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-none border text-sm self-start dark:text-gray-200 dark:border-gray-700"}>
                                    {t("Edit profile")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"flex gap-6 md:flex-row flex-col items-start w-full md:px-10 px-2 justify-between"}>
                    <div className={"md:w-8/12 w-full flex flex-col gap-4 items-center h-full"}>
                        <div className={"bg-white rounded-2xl p-4 gap-6 md:flex-1 flex flex-col dark:bg-gray-800 items-center w-full"}>
                            <div className={"flex justify-between items-center w-full"}>
                                <p className={"text-lg dark:text-gray-200"}>{t("Requests")}</p>
                                {/* <button
                                    onClick={handelAddRequestModal}
                                    className={" bg-none p-1.5 border-2 border-primary-base dark:border-primary-200 rounded-xl flex items-center gap-2"}>
                                    <RiAddLine size={"18"} className={"text-primary-base dark:text-primary-200"} />
                                    <span className={"text-sm text-primary-base dark:text-primary-200"}>{t("Request")}</span>
                            </button> */}
                            </div>
                            <div className={"flex items-center justify-between w-full"}>
                                <div className={"flex w-1/3"}>
                                    <TabsOutContent tabs={tabsData} onTabChange={handleTabChange} />
                                </div>
                                <div className={"flex gap-2"}>
                                    <SelectWithoutLabel title={"Filter by"} className={"w-[94px] h-[36px]"} />
                                    <button
                                        className={"flex dark:text-gray-400 text-sm items-baseline p-2  gap-2 rounded-lg border border-gray-200 dark:border-gray-600"}>
                                        <RiDownload2Line size={15} />
                                        {t("Export")}
                                    </button>
                                </div>
                            </div>
                            <div className={"w-full"}>
                                {tabsData.map(
                                    ({ title, content }) =>
                                        activeTab === title && <div key={title}>{content}</div>
                                )}
                            </div>
                        </div>
                        <div className={"bg-white rounded-2xl p-4 gap-6 md:flex-1 flex flex-col items-center w-full dark:bg-gray-800"}>
                            <div className={"flex justify-between items-center w-full"}>
                                <p className={"text-lg dark:text-gray-200"}>{t("Tasks Rating")}</p>
                                <div className={"flex gap-2"}>
                                    <SelectWithoutLabel title={"Filter by"} className={"w-[94px] h-[36px]"} />
                                    <button
                                        className={"flex dark:text-gray-400 text-sm items-baseline p-2  gap-2 rounded-lg border border-gray-200 dark:border-gray-600"}>
                                        <RiDownload2Line size={"18"} />
                                        {t("Export")}
                                    </button>
                                </div>
                            </div>
                            <div className={"w-full"}>
                                <Table classContainer={"max-w-full"} headers={headerTasksRating} rows={tasksRows} isActions={false}
                                    isCheckInput={false} isTitle={false} />
                            </div>
                        </div>
                    </div>
                    <div className={"w-full flex h-full flex-col gap-3"}>
                        <div className={"bg-white rounded-2xl p-4 md:flex-1 w-full gap-4 flex flex-col dark:bg-gray-800"}>
                            <p className={"text-lg text-start dark:text-gray-200"}>{t("Work Information")}</p>
                            <div className={"flex flex-col w-full gap-6"}>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiBuilding2Line size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Department")}:</span>
                                    <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{user?.employee_detail?.department?.name || "-"}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiBriefcaseLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Role")}:</span>
                                    <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{user?.employee_detail?.position?.name || "-"}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiMoneyDollarCircleLine size={"18"} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Salary")}:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}>${user?.employee_detail?.salary || "0"}/{t("month")}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiTimeLine size={"18"} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Working Hours")}:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}> {user?.employee_detail?.work_hours || "0"} {t("hours")}/{t("day")}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiCalendarLine size={"18"} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Annual Leave Days")}:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}> {user?.employee_detail?.yearly_day_offs || "0"} {t("days")}/{t("year")}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiCalendarEventLine size={"18"} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Weekend Days")}:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}> {user?.employee_detail?.weekend_days?.join(" - ") || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddRequestModal isOpen={isAddRequestModal} onClose={handelAddRequestModal} onClick={() => { }} />
            <EditProfileModal
                isOpen={isEditProfileModal}
                onClose={handelEditProfileModal}
                user={user}
                updateProfile={updateProfile}
                isLoading={isUpdatingProfile}
            />
            <ChangePasswordModal
                isOpen={isChangePasswordModal}
                onClose={handelChangePasswordModal}
            />
        </Page>
    );
}

export default EmployeeProfile;