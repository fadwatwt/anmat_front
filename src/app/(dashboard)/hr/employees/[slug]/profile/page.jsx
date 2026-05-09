"use client";
import { useParams } from 'next/navigation';
import Table from "@/components/Tables/Table.jsx";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import dayjs from 'dayjs';
import Rating from "@/app/(dashboard)/hr/Rating.jsx";
import {
    RiCake2Line, RiCalendarLine,
    RiCheckboxCircleFill,
    RiGraduationCapLine,
    RiMailLine, RiMoneyDollarCircleLine, RiTimeLine,
    RiUserLine, RiBriefcaseLine, RiBuilding2Line, RiPhoneLine,
    RiCalendarEventLine, RiDatabase2Line
} from "@remixicon/react";
import { useGetEmployeeProfileQuery, useUpdateEmployeeMutation } from '@/redux/employees/employeesApi';
import { useGetSubscriberOrganizationQuery } from '@/redux/organizations/organizationsApi';
import { RiMore2Fill, RiStarLine, RiEditLine } from "@remixicon/react";
import { translateDate } from '@/functions/Days';
import { useState } from "react";
import ContentCard from "@/components/containers/ContentCard";
import EditPerformanceRatingModal from "../../modals/EditPerformanceRatingModal";
import DropdownMenu from "@/components/Dropdowns/DropdownMenu";
import TabsOutContent from "@/components/Modal/TabsContener/TabsOutContent.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import {
    useGetEmployeeRequestsQuery,
    useDeleteEmployeeRequestMutation
} from '@/redux/employees/employeeRequestsApi';
import { useGetEmployeeLogsQuery } from "@/redux/activity-logs/activityLogsApi";
import ActivityLogs from "@/components/ActivityLogs.jsx";
import { RiDeleteBin7Line, RiErrorWarningLine, RiBellLine, RiInformationLine, RiNotification4Line } from "@remixicon/react";
import { useGetSentSubscriberNotificationsQuery } from "@/redux/subscriber-notifications/subscriberNotificationsApi";
import SendNotificationModal from "@/app/(dashboard)/hr/employees/modals/SendNotification.modal";
import { usePermission } from "@/Hooks/usePermission";

// Map icon name strings from backend to actual icon components
const ICON_MAP = {
    RiErrorWarningLine: <RiErrorWarningLine size={16} />,
    RiBellLine: <RiBellLine size={16} />,
    RiInformationLine: <RiInformationLine size={16} />,
};

const COLOR_MAP = {
    red: "text-red-500 bg-red-50 dark:bg-red-500/10",
    yellow: "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
};

function SingleEmployeeProfile() {

    const { t, i18n } = useTranslation()
    const { slug: employeeId } = useParams();
    const { data: employee, isLoading, error } = useGetEmployeeProfileQuery(employeeId);
    const { data: orgData } = useGetSubscriberOrganizationQuery();
    const [updateEmployee] = useUpdateEmployeeMutation();
    const { data: requests = [], isLoading: isLoadingRequests } = useGetEmployeeRequestsQuery({ employee_id: employeeId });
    const [deleteRequest] = useDeleteEmployeeRequestMutation();

    const { data: notificationsData, isLoading: isLoadingNotifications } = useGetSentSubscriberNotificationsQuery({
        employeeId: employeeId,
        page: 1,
        limit: 10
    }, { skip: !employeeId });
    const notifications = notificationsData?.data?.data || [];

    const { data: employeeLogsData } = useGetEmployeeLogsQuery({ employeeId: employeeId, limit: 10 }, { skip: !employeeId });
    const activityLogs = employeeLogsData?.data || [];

    const [isOpenSendNotifyModal, setIsOpenSendNotifyModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditRatingModalOpen, setIsEditRatingModalOpen] = useState(false);

    const canViewLeaves = usePermission("leaves.track_all") || usePermission("leaves.track_department");
    const canViewRequests = usePermission("employee_requests.track_all") || usePermission("employee_requests.track_department");
    const canViewSalary = usePermission("salary_transactions.track_all") || usePermission("salary_transactions.track_department");

    const tabsList = [
        { title: "Notifications" },
        ...(canViewLeaves ? [{ title: "Leave" }] : []),
        ...(canViewRequests ? [{ title: "Delay" }] : []),
        ...(canViewSalary ? [{ title: "Financial" }] : []),
    ];

    const [activeTab, setActiveTab] = useState("Notifications");

    const handleUpdateRating = async (rating) => {
        try {
            setIsUpdating(true);
            await updateEmployee({
                id: employeeId,
                employee_details: {
                    manual_rating: rating
                }
            }).unwrap();
        } catch (error) {
            console.error("Failed to update rating:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateFullRating = async (data) => {
        try {
            setIsUpdating(true);
            await updateEmployee({
                id: employeeId,
                employee_details: data
            }).unwrap();
        } catch (error) {
            console.error("Failed to update rating:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return "-";
        return dayjs().diff(dayjs(dob), 'year');
    };

    const formatStorage = (bytes) => {
        if (!bytes) return "0 MB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const handleDeleteRequest = async (id) => {
        if (window.confirm(t("Are you sure you want to delete this request?"))) {
            try {
                await deleteRequest(id).unwrap();
            } catch (err) {
                console.error("Failed to delete request:", err);
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
                <button
                    key={`del-${req._id}`}
                    onClick={() => handleDeleteRequest(req._id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                    <RiDeleteBin7Line size={18} />
                </button>
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
                <button
                    key={`del-${req._id}`}
                    onClick={() => handleDeleteRequest(req._id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                    <RiDeleteBin7Line size={18} />
                </button>
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
                <button
                    key={`del-${req._id}`}
                    onClick={() => handleDeleteRequest(req._id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                    <RiDeleteBin7Line size={18} />
                </button>
            ]);
    };

    const getNotificationRows = () => {
        return notifications.map(notif => {
            const type = notif.notification_type_id || {};
            const Icon = ICON_MAP[type.icon] || <RiInformationLine size={16} />;
            const colorClass = COLOR_MAP[type.color] || "text-gray-500 bg-gray-50 dark:bg-gray-500/10";

            return [
                notif.created_at ? translateDate(notif.created_at) : "-",
                <div key={notif._id} className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-full ${colorClass}`}>
                        {Icon}
                    </span>
                    <span className="font-medium text-sm text-cell-primary">{type.name || t("Notification")}</span>
                </div>,
                <div key={`info-${notif._id}`} className="flex flex-col max-w-xs">
                    <span className="font-semibold text-cell-primary text-sm truncate" title={notif.title}>{notif.title}</span>
                    <span className="text-xs text-cell-secondary truncate" title={notif.message}>{notif.message}</span>
                </div>,
                <Status key={`status-${notif._id}`} type={notif.status} title={t(notif.status)} />
            ];
        });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "Notifications":
                return (
                    <Table
                        classContainer={"max-w-full"}
                        headers={[
                            { label: t("Date"), width: "15%" },
                            { label: t("Type"), width: "20%" },
                            { label: t("Message"), width: "50%" },
                            { label: t("Status"), width: "15%" }
                        ]}
                        rows={getNotificationRows()}
                        isActions={false}
                        isCheckInput={false}
                        isTitle={false}
                        isLoading={isLoadingNotifications}
                    />
                );
            case "Leave":
                return (
                    <Table
                        classContainer={"max-w-full"}
                        headers={[
                            { label: t("Request Date") },
                            { label: t("Type") },
                            { label: t("Status - Vacation Date") },
                            { label: "" }
                        ]}
                        rows={getLeaveRows()}
                        isActions={false}
                        isCheckInput={false}
                        isTitle={false}
                        isLoading={isLoadingRequests}
                    />
                );
            case "Delay":
                return (
                    <Table
                        classContainer={"max-w-full"}
                        headers={[
                            { label: t("Request Date") },
                            { label: t("Type") },
                            { label: t("Status - Delay Date") },
                            { label: "" }
                        ]}
                        rows={getDelayRows()}
                        isActions={false}
                        isCheckInput={false}
                        isTitle={false}
                        isLoading={isLoadingRequests}
                    />
                );
            case "Financial":
                return (
                    <Table
                        classContainer={"max-w-full"}
                        headers={[
                            { label: t("Request Date") },
                            { label: t("Type") },
                            { label: t("Status - Details") },
                            { label: "" }
                        ]}
                        rows={getFinancialRows()}
                        isActions={false}
                        isCheckInput={false}
                        isTitle={false}
                        isLoading={isLoadingRequests}
                    />
                );
            default:
                return null;
        }
    };

    if (isLoading) return <div className="text-center py-10">{t("Loading...")}</div>;
    if (error) return <div className="text-center py-10 text-red-500">{t("Error loading profile")}</div>;
    if (!employee) return <div className="text-center py-10">{t("Employee not found")}</div>;

    const userData = employee.user || {};

    const headerTasksRating = [
        { label: t("Task") },
        { label: t("Date") },
        { label: t("Rating") },
        { label: t("Commits") },
    ];

    const tasksRows = employee.ratings?.map(rating => [
        rating.details || "-",
        rating.created_at ? translateDate(rating.created_at) : "-",
        <Rating value={rating.score || 0} />,
        <p className={"text-wrap text-cell-secondary"}>{rating.comment || "-"}</p>
    ]) || [];

    return (
        <Page isTitle={false} className={"w-full"}>
            <div className={"w-full flex flex-col items-center md:gap-6 xl:gap-4 gap-8 h-full"}>
                <div className={"relative flex min-h-48 justify-center  w-full h-full md:mb-0 mb-44"}>
                    <div className={"w-full md:h-40 h-[20vh]"}>
                        <img className={"max-w-full w-full max-h-full object-cover rounded-xl"} src={"/images/profileBanner.png"} alt={""} />
                    </div>

                    <div className={"absolute md:top-1/3 top-[50px] w-full md:px-10 px-2"}>
                        <div className={" rounded-2xl p-4 border border-status-border flex bg-surface"}>
                            <div
                                className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-6 flex-1"}>
                                <div className={"flex justify-between items-center"}>
                                    <div className={"relative h-[72px] w-[72px]"}>
                                        <img className={"rounded-full h-[72px] w-[72px] max-w-full object-cover border-2 border-primary-500"}
                                            src={employee?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || "U")}&background=random`} alt={"image-user"} />
                                        {userData.is_active && (
                                            <RiCheckboxCircleFill size="23"
                                                className="absolute top-0 right-0 bg-surface rounded-full text-cyan-500" />
                                        )}
                                    </div>
                                </div>
                                <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                    <div className={`flex flex-col gap-4 flex-1 border-status-border ${i18n.language === "ar" ? "md:border-l-2 " : "md:border-r-2 "}`}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiUserLine size={18} className={"text-cell-secondary"} />
                                            <span className={"text-cell-secondary text-sm"}>{t("Name")}:</span>
                                            <p className={"text-cell-primary text-sm font-medium"}>{userData.name}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCake2Line size={18} className={"text-cell-secondary"} />
                                            <p className={"text-cell-secondary text-sm"}>{t("Age")}:</p>
                                            <p className={"text-cell-primary text-sm font-medium"}>{calculateAge(employee?.date_of_birth)}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiGraduationCapLine size={18} className={"text-cell-secondary"} />
                                            <span className={"text-cell-secondary text-sm"}>{t("Location")}:</span>
                                            <p className={"text-cell-primary text-sm font-medium"}>
                                                {employee?.city && employee?.country
                                                    ? `${employee.city}, ${employee.country}`
                                                    : employee?.country || employee?.city || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col gap-4 flex-1"}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiMailLine size={18} className={"text-cell-secondary"} />
                                            <span className={"text-cell-secondary text-sm"}>{t("Email")}:</span>
                                            <p className={"text-cell-primary text-sm font-medium"}>{userData.email}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiPhoneLine size={18} className={"text-cell-secondary"} />
                                            <span className={"text-cell-secondary text-sm"}>{t("Phone")}:</span>
                                            <p className={"text-cell-primary text-sm font-medium"}>{userData.phone || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"grid grid-cols-12 gap-6 md:px-10 px-2 w-full"}>
                    <div className={"col-span-12 lg:col-span-8"}>
                        <div className={"bg-surface rounded-2xl p-4 w-full gap-4 flex flex-col h-full"}>
                            <p className={"text-lg text-start text-cell-primary font-bold"}>{t("Work Information")}</p>
                            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-2"}>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                                        <RiBuilding2Line size={18} className={"text-primary-500"} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Department")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}>{employee?.department?.name || employee?.department_id?.name || "-"}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
                                        <RiBriefcaseLine size={18} className={"text-green-500"} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Role")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}>{employee?.position?.name || employee?.position_id?.title || "-"}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                                        <RiMoneyDollarCircleLine size={18} className={"text-yellow-500"} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Salary")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}>${employee?.salary || "0"}/{t("month")}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                                        <RiTimeLine size={18} className={"text-purple-500"} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Working Hours")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}> {employee?.work_hours || "0"} {t("hrs/day")}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                                        <RiCalendarLine size={18} className={"text-orange-500"} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Annual Leave")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}> {employee?.yearly_day_offs || "0"} {t("days")}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
                                        <RiCalendarEventLine size={18} className={"text-red-500"} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Weekend")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}> {employee?.weekend_days?.join(" - ") || "-"}</p>
                                    </div>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                                        <RiDatabase2Line size={18} className={"text-indigo-500"} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={"text-cell-secondary text-xs"}>{t("Storage")}</span>
                                        <p className={"text-cell-primary text-sm font-semibold"}>
                                            {formatStorage(employee?.used_storage)} / {employee?.storage_quota ? formatStorage(employee.storage_quota) : t("Unlimited")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"col-span-12 lg:col-span-4"}>
                        {orgData?.is_points_system_active && (
                            <ContentCard
                                title={t("Performance Rating")}
                                toolbar={
                                    <DropdownMenu
                                        removeDefaultButtonStyling={true}
                                        button={
                                            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                <RiMore2Fill size={20} className="text-gray-400" />
                                            </button>
                                        }
                                        content={
                                            <div className="flex flex-col min-w-[120px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-status-border">
                                                <button
                                                    onClick={() => setIsEditRatingModalOpen(true)}
                                                    className="flex items-center gap-2 p-3 text-sm text-cell-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left w-full"
                                                >
                                                    <RiEditLine size={18} className="text-primary-base" />
                                                    {t("Edit")}
                                                </button>
                                            </div>
                                        }
                                    />
                                }
                                main={
                                    <div className="flex flex-col items-center justify-center gap-4 py-2">
                                        <div className="relative">
                                            <div className="text-5xl font-bold text-primary-base">
                                                {employee?.evaluation_method === 'MANUAL' ? (employee?.manual_rating || 0).toFixed(1) : (employee?.overall_rating || 0).toFixed(1)}
                                            </div>
                                            <div className="absolute -top-2 -right-6">
                                                {employee?.evaluation_method === 'MANUAL' && (
                                                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded uppercase">
                                                        {t("Manual")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Rating
                                            value={employee?.evaluation_method === 'MANUAL' ? employee?.manual_rating || 0 : employee?.overall_rating || 0}
                                            size={24}
                                        />
                                        <p className="text-sm text-cell-secondary">
                                            {employee?.evaluation_method === 'MANUAL' ? t("Manual Override active") : t("Automatic calculation")}
                                        </p>
                                    </div>
                                }
                            />
                        )}
                    </div>

                    <div className={"col-span-12 mt-6"}>
                        <div className={"bg-surface rounded-2xl p-4 gap-6 flex flex-col items-center w-full"}>
                            <div className={"flex justify-between items-center w-full"}>
                                <p className={"text-lg text-cell-primary font-bold"}>{t("Requests & Notifications")}</p>
                                <button
                                    onClick={() => setIsOpenSendNotifyModal(true)}
                                    className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
                                >
                                    <RiNotification4Line size={18} />
                                    {t("Send Notification")}
                                </button>
                            </div>
                            <div className={"w-full flex flex-col gap-4"}>
                                <div className={"flex w-full md:w-1/3"}>
                                    <TabsOutContent tabs={tabsList} activeTab={activeTab} onTabChange={(title) => setActiveTab(title)} />
                                </div>
                                <div className={"w-full"}>
                                    {renderTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"col-span-12 mt-6"}>
                        <div className={"bg-surface rounded-2xl p-4 gap-6 flex flex-col items-center w-full"}>
                            <div className={"flex justify-between items-center w-full"}>
                                <p className={"text-lg text-cell-primary font-bold"}>{t("Tasks Rating")}</p>
                            </div>
                            <div className={"w-full"}>
                                <Table classContainer={"max-w-full"} headers={headerTasksRating} rows={tasksRows} isActions={false}
                                    isCheckInput={false} isTitle={false} />
                            </div>
                        </div>
                    </div>

                    <div className={"col-span-12 mt-6"}>
                        <ActivityLogs activityLogs={activityLogs} isRawLogs={true} className={"h-72"} />
                    </div>
                </div>

                <EditPerformanceRatingModal
                    isOpen={isEditRatingModalOpen}
                    onClose={() => setIsEditRatingModalOpen(false)}
                    employee={employee}
                    onUpdate={handleUpdateFullRating}
                />

                <SendNotificationModal
                    isOpen={isOpenSendNotifyModal}
                    onClose={() => setIsOpenSendNotifyModal(false)}
                    employeeData={employee}
                />
            </div>
        </Page>
    );
}

export default SingleEmployeeProfile;
