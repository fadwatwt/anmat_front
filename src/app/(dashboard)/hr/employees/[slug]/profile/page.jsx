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
    RiCalendarEventLine
} from "@remixicon/react";
import { useGetEmployeeProfileQuery } from '@/redux/employees/employeesApi';
import { translateDate } from '@/functions/Days';

function SingleEmployeeProfile() {
    const { t, i18n } = useTranslation()
    const { slug: employeeId } = useParams();
    const { data: employee, isLoading, error } = useGetEmployeeProfileQuery(employeeId);

    const calculateAge = (dob) => {
        if (!dob) return "-";
        return dayjs().diff(dayjs(dob), 'year');
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
        rating.task_name || "-",
        rating.date ? translateDate(rating.date) : "-",
        <Rating value={rating.value || 0} />,
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
                <div className={"flex gap-6 md:flex-row flex-col items-start w-full md:px-10 px-2 justify-between"}>
                    <div className={"md:w-8/12 w-full flex flex-col gap-4 items-center h-full"}>
                        <div className={"bg-surface rounded-2xl p-4 gap-6 md:flex-1 flex flex-col items-center w-full"}>
                            <div className={"flex justify-between items-center w-full"}>
                                <p className={"text-lg text-cell-primary font-bold"}>{t("Tasks Rating")}</p>
                            </div>
                            <div className={"w-full"}>
                                <Table classContainer={"max-w-full"} headers={headerTasksRating} rows={tasksRows} isActions={false}
                                    isCheckInput={false} isTitle={false} />
                            </div>
                        </div>
                    </div>
                    <div className={"w-full flex h-full flex-col gap-3"}>
                        <div className={"bg-surface rounded-2xl p-4 md:flex-1 w-full gap-4 flex flex-col"}>
                            <p className={"text-lg text-start text-cell-primary font-bold"}>{t("Work Information")}</p>
                            <div className={"flex flex-col w-full gap-6"}>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiBuilding2Line size={18} className={"text-cell-secondary"} />
                                    <span className={"text-cell-secondary text-sm"}>{t("Department")}:</span>
                                    <p className={"text-cell-primary text-sm font-medium"}>{employee?.department?.name || employee?.department_id?.name || "-"}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiBriefcaseLine size={18} className={"text-cell-secondary"} />
                                    <span className={"text-cell-secondary text-sm"}>{t("Role")}:</span>
                                    <p className={"text-cell-primary text-sm font-medium"}>{employee?.position?.name || employee?.position_id?.title || "-"}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiMoneyDollarCircleLine size={"18"} className={"text-cell-secondary"} />
                                    <span className={"text-cell-secondary text-sm"}>{t("Salary")}:</span>
                                    <p className={"text-cell-primary text-sm font-medium"}>${employee?.salary || "0"}/{t("month")}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiTimeLine size={"18"} className={"text-cell-secondary"} />
                                    <span className={"text-cell-secondary text-sm"}>{t("Working Hours")}:</span>
                                    <p className={"text-cell-primary text-sm font-medium"}> {employee?.work_hours || "0"} {t("hours")}/{t("day")}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiCalendarLine size={"18"} className={"text-cell-secondary"} />
                                    <span className={"text-cell-secondary text-sm"}>{t("Annual Leave Days")}:</span>
                                    <p className={"text-cell-primary text-sm font-medium"}> {employee?.yearly_day_offs || "0"} {t("days")}/{t("year")}</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiCalendarEventLine size={"18"} className={"text-cell-secondary"} />
                                    <span className={"text-cell-secondary text-sm"}>{t("Weekend Days")}:</span>
                                    <p className={"text-cell-primary text-sm font-medium"}> {employee?.weekend_days?.join(" - ") || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default SingleEmployeeProfile;
