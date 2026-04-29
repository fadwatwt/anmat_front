"use client";
import { useParams } from 'next/navigation';
import Table from "@/components/Tables/Table.jsx";
import Page from "@/components/Page.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { useTranslation } from "react-i18next";
import TabsOutContent from "@/components/Modal/TabsContener/TabsOutContent.jsx";
import { useState } from "react";
import Rating from "@/app/(dashboard)/hr/Rating.jsx";
import EditProfileModal from "@/app/(dashboard)/profile/_components/modals/EditProfile.modal.jsx";
import ChangePasswordModal from "@/app/(dashboard)/profile/_components/modals/ChangePassword.modal.jsx";
import AddRequestModal from "@/app/(dashboard)/profile/_components/modals/AddRequest.modal.jsx";
import {
    RiCake2Line, RiCalendarLine,
    RiCheckboxCircleFill,
    RiGraduationCapLine,
    RiMailLine, RiMoneyDollarCircleLine, RiTimeLine,
    RiUserLine, RiBriefcaseLine, RiBuilding2Line, RiPhoneLine,
    RiCalendarEventLine, RiDeleteBin7Line
} from "@remixicon/react";
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/auth/authSlice';
import {
    useGetEmployeeAuthRequestsQuery,
    useUpdateEmployeeDetailMutation,
    useCancelEmployeeRequestMutation
} from '@/redux/employees/employeeAuthRequestsApi';
import { translateDate } from '@/functions/Days';
import dayjs from 'dayjs';
import ContentCard from "@/components/containers/ContentCard";

function EmployeeProfile() {
    const { t, i18n } = useTranslation()
    const user = useSelector(selectUser);
    const employeeDetail = user?.employee_detail || {};
    
    const { data: requests = [], isLoading: isLoadingRequests } = useGetEmployeeAuthRequestsQuery();
    const [cancelRequest] = useCancelEmployeeRequestMutation();

    const [activeTab, setActiveTab] = useState("Leave");
    const [isAddRequestModal, setIsAddRequestModal] = useState(false);
    const [isEditProfileModal, setIsEditProfileModal] = useState(false);
    const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);

    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateEmployeeDetailMutation();

    const calculateAge = (dob) => {
        if (!dob) return "-";
        return dayjs().diff(dayjs(dob), 'year');
    };

    const handleDeleteRequest = async (id) => {
        if (window.confirm(t("Are you sure you want to cancel this request?"))) {
            try {
                await cancelRequest(id).unwrap();
            } catch (err) {
                console.error("Failed to cancel request:", err);
            }
        }
    };

    const getLeaveRows = () => {
        return requests
            .filter(req => req.type === "DAY_OFF")
            .map(req => [
                req.created_at ? translateDate(req.created_at) : "-",
                t("Day Off"),
                <div key={req._id} className="flex flex-col gap-1">
                    <Status type={req.status} title={req.status} />
                    <span className="text-[10px] text-cell-secondary">{req.vacation_date ? translateDate(req.vacation_date) : "-"}</span>
                </div>,
                req.status === 'pending' ? (
                    <button 
                        key={`del-${req._id}`}
                        onClick={() => handleDeleteRequest(req._id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                        <RiDeleteBin7Line size={18} />
                    </button>
                ) : null
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
                    <span className="text-[10px] text-cell-secondary">{req.work_due_at ? translateDate(req.work_due_at) : "-"}</span>
                </div>,
                req.status === 'pending' ? (
                    <button 
                        key={`del-${req._id}`}
                        onClick={() => handleDeleteRequest(req._id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                        <RiDeleteBin7Line size={18} />
                    </button>
                ) : null
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
                    <span className="text-[10px] text-cell-secondary">{req.advance_salary_by || "-"}</span>
                </div>,
                req.status === 'pending' ? (
                    <button 
                        key={`del-${req._id}`}
                        onClick={() => handleDeleteRequest(req._id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                        <RiDeleteBin7Line size={18} />
                    </button>
                ) : null
            ]);
    };

    const tabsData = [
        {
            title: "Leave",
            content: (
                <Table
                    classContainer={"max-w-full"}
                    headers={[{ label: t("Request Date") }, { label: t("Type") }, { label: t("Status - Vacation Date") }, { label: "" }]}
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
                    headers={[{ label: t("Request Date") }, { label: t("Type") }, { label: t("Status - Delay Date") }, { label: "" }]}
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
                    headers={[{ label: t("Request Date") }, { label: t("Type") }, { label: t("Status - Details") }, { label: "" }]}
                    rows={getFinancialRows()}
                    isActions={false}
                    isCheckInput={false}
                    isTitle={false}
                    isLoading={isLoadingRequests}
                />
            ),
        },
    ];

    const tasksRows = employeeDetail.ratings?.map(rating => [
        rating.details || "-",
        rating.created_at ? translateDate(rating.created_at) : "-",
        <Rating value={rating.score || 0} />,
        <p className={"text-wrap text-cell-secondary"}>{rating.comment || "-"}</p>
    ]) || [];

    return (
        <Page isTitle={false} className={"w-full"}>
            <div className={"w-full flex flex-col items-center md:gap-6 xl:gap-4 gap-8 h-full"}>
                {/* Banner & Header Card */}
                <div className={"relative flex min-h-48 justify-center w-full h-full md:mb-0 mb-44"}>
                    <div className={"w-full md:h-40 h-[20vh]"}>
                        <img className={"max-w-full w-full max-h-full object-cover rounded-xl"} src={"/images/profileBanner.png"} alt={""} />
                    </div>
                    
                    <div className={"absolute md:top-1/3 top-[50px] w-full md:px-10 px-2"}>
                        <div className={" rounded-2xl p-4 border border-status-border flex bg-surface"}>
                            <div className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-6 flex-1"}>
                                <div className={"flex justify-between items-center"}>
                                    <div className={"relative h-[72px] w-[72px]"}>
                                        <img className={"rounded-full h-[72px] w-[72px] max-w-full object-cover border-2 border-primary-500"}
                                            src={user?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=random`} alt={"image-user"} />
                                        {user?.is_active && (
                                            <RiCheckboxCircleFill size="23" className="absolute top-0 right-0 bg-surface rounded-full text-cyan-500" />
                                        )}
                                    </div>
                                </div>
                                <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                    <div className={`flex flex-col gap-4 flex-1 border-status-border ${i18n.language === "ar" ? "md:border-l-2 " : "md:border-r-2 "}`}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiUserLine size={18} className={"text-cell-secondary"} />
                                            <span className={"text-cell-secondary text-sm"}>{t("Name")}:</span>
                                            <p className={"text-cell-primary text-sm font-medium"}>{user?.name}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCake2Line size={18} className={"text-cell-secondary"} />
                                            <p className={"text-cell-secondary text-sm"}>{t("Age")}:</p>
                                            <p className={"text-cell-primary text-sm font-medium"}>{calculateAge(employeeDetail.date_of_birth)}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiGraduationCapLine size={18} className={"text-cell-secondary"} />
                                            <span className={"text-cell-secondary text-sm"}>{t("Location")}:</span>
                                            <p className={"text-cell-primary text-sm font-medium"}>
                                                {employeeDetail.city && employeeDetail.country ? `${employeeDetail.city}, ${employeeDetail.country}` : "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col gap-4 flex-1"}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiMailLine size={18} className={"text-cell-secondary"} />
                                            <span className={"text-cell-secondary text-sm"}>{t("Email")}:</span>
                                            <p className={"text-cell-primary text-sm font-medium"}>{user?.email}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiPhoneLine size={18} className={"text-cell-secondary"} />
                                            <span className={"text-cell-secondary text-sm"}>{t("Phone")}:</span>
                                            <p className={"text-cell-primary text-sm font-medium"}>{user?.phone || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => setIsChangePasswordModal(true)} className={"p-1.5 rounded-lg text-nowrap bg-badge-bg text-badge-text border border-status-border text-sm"}>
                                        {t("Change password")}
                                    </button>
                                    <button onClick={() => setIsEditProfileModal(true)} className={"p-1.5 rounded-lg text-nowrap bg-none border border-status-border text-sm text-cell-primary"}>
                                        {t("Edit profile")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Content */}
                <div className={"grid grid-cols-12 gap-6 md:px-10 px-2 w-full"}>
                    {/* Work Info (Left 8) */}
                    <div className={"col-span-12 lg:col-span-8"}>
                        <div className={"bg-surface rounded-2xl p-4 w-full gap-4 flex flex-col h-full"}>
                            <p className={"text-lg text-start text-cell-primary font-bold"}>{t("Work Information")}</p>
                            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-2"}>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg"><RiBuilding2Line size={18} className={"text-primary-500"} /></div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Department")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}>{employeeDetail.department?.name || "-"}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg"><RiBriefcaseLine size={18} className={"text-green-500"} /></div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Role")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}>{employeeDetail.position?.name || "-"}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg"><RiMoneyDollarCircleLine size={18} className={"text-yellow-500"} /></div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Salary")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}>${employeeDetail.salary || "0"}/{t("month")}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg"><RiTimeLine size={18} className={"text-purple-500"} /></div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Working Hours")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}> {employeeDetail.work_hours || "0"} {t("hrs/day")}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg"><RiCalendarLine size={18} className={"text-orange-500"} /></div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Annual Leave")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}> {employeeDetail.yearly_day_offs || "0"} {t("days")}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg"><RiCalendarEventLine size={18} className={"text-red-500"} /></div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Weekend")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}> {employeeDetail.weekend_days?.join(" - ") || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Rating (Right 4) */}
                    <div className={"col-span-12 lg:col-span-4"}>
                        <ContentCard
                            title={t("Performance Rating")}
                            main={
                                <div className="flex flex-col items-center justify-center gap-4 py-2">
                                    <div className="text-5xl font-bold text-primary-base">
                                        {(employeeDetail.overall_rating || 0).toFixed(1)}
                                    </div>
                                    <Rating value={employeeDetail.overall_rating || 0} size={24} />
                                    <p className="text-sm text-cell-secondary">{t("Automatic calculation")}</p>
                                </div>
                            }
                        />
                    </div>

                    {/* Requests (Full 12) */}
                    <div className={"col-span-12 mt-6"}>
                        <div className={"bg-surface rounded-2xl p-4 gap-6 flex flex-col items-center w-full"}>
                            <div className={"flex justify-between items-center w-full"}>
                                <p className={"text-lg text-cell-primary font-bold"}>{t("Requests")}</p>
                            </div>
                            <div className={"w-full flex flex-col gap-4"}>
                                <div className={"flex w-full md:w-1/3"}>
                                    <TabsOutContent tabs={tabsData} onTabChange={(title) => setActiveTab(title)} />
                                </div>
                                <div className={"w-full"}>
                                    {tabsData.map(({ title, content }) => activeTab === title && <div key={title}>{content}</div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Rating (Full 12) */}
                    <div className={"col-span-12 mt-6"}>
                        <div className={"bg-surface rounded-2xl p-4 gap-6 flex flex-col items-center w-full"}>
                            <div className={"flex justify-between items-center w-full"}>
                                <p className={"text-lg text-cell-primary font-bold"}>{t("Tasks Rating")}</p>
                            </div>
                            <div className={"w-full"}>
                                <Table classContainer={"max-w-full"} headers={[{ label: t("Task") }, { label: t("Date") }, { label: t("Rating") }, { label: t("Commits") }]} rows={tasksRows} isActions={false} isCheckInput={false} isTitle={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddRequestModal isOpen={isAddRequestModal} onClose={() => setIsAddRequestModal(false)} onClick={() => { }} />
            <EditProfileModal isOpen={isEditProfileModal} onClose={() => setIsEditProfileModal(false)} user={user} updateProfile={updateProfile} isLoading={isUpdatingProfile} />
            <ChangePasswordModal isOpen={isChangePasswordModal} onClose={() => setIsChangePasswordModal(false)} />
        </Page>
    );
}

export default EmployeeProfile;