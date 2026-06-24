import DefaultButton from "@/components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetAttendanceSettingsQuery, useUpdateAttendanceSettingsMutation } from "@/redux/api/settingsApi";
import { selectUserType, selectPermissions } from "@/redux/auth/authSlice";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function AttendanceTab() {
    const { t } = useTranslation();
    const userType = useSelector(selectUserType);
    const userPermissions = useSelector(selectPermissions);
    const canEdit = userType === "Subscriber" || userType === "Admin" || (Array.isArray(userPermissions) && userPermissions.includes("attendances.manage_settings"));
    const { data: settings, isLoading } = useGetAttendanceSettingsQuery();
    const [updateAttendance, { isLoading: isUpdating }] = useUpdateAttendanceSettingsMutation();

    const [minutesBeforeWarning, setMinutesBeforeWarning] = useState("30");
    const [dailyWorkingHours, setDailyWorkingHours] = useState("8");
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    useEffect(() => {
        if (settings) {
            setMinutesBeforeWarning(String(settings.minutes_before_warning ?? 30));
            setDailyWorkingHours(String(settings.daily_working_hours ?? 8));
        }
    }, [settings]);

    const minutesOptions = [
        { id: "60", element: `60 ${t("min")}` },
        { id: "40", element: `40 ${t("min")}` },
        { id: "30", element: `30 ${t("min")}` },
        { id: "20", element: `20 ${t("min")}` },
        { id: "10", element: `10 ${t("min")}` },
    ];

    const hoursOptions = [
        { id: "8", element: `8 ${t("hours")}` },
        { id: "6", element: `6 ${t("hours")}` },
        { id: "4", element: `4 ${t("hours")}` },
        { id: "2", element: `2 ${t("hours")}` },
        { id: "1", element: `1 ${t("hours")}` },
    ];

    const handleApplyChanges = async () => {
        try {
            await updateAttendance({
                minutes_before_warning: parseInt(minutesBeforeWarning, 10),
                daily_working_hours: parseInt(dailyWorkingHours, 10),
            }).unwrap();
            setApiResponse({ isOpen: true, status: "success", message: t("Attendance settings updated successfully") });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update attendance settings"),
            });
        }
    };

    if (isLoading) return <div className="p-4">{t("Loading...")}</div>;

    return (
        <div className={"flex  w-full justify-center "}>
            <div className={"md:p-5 p-4 rounded-2xl bg-white dark:bg-gray-800 lg:w-[39%]"}>
                <div className={"w-full md:py-2 flex flex-col gap-6"}>
                    <div className={"flex flex-col gap-6"}>
                        <div className={"flex flex-col text-start gap-1"}>
                            <p className={"dark:text-gray-200 text-md text-black"}>{t("Attendance Preferences")}</p>
                            <p className={"text-sm text-gray-500 dark:text-gray-400"}>{t("Configure delay warnings and daily working hours.")}</p>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <div className={"flex justify-between items-center gap-4"}>
                                <div className={"flex flex-col items-start justify-center w-9/12 gap-1"}>
                                    <p className={"text-sm text-black text-wrap text-start dark:text-gray-200"}>{t("Minutes before Warning Message Sent")}</p>
                                    <p className={"text-xs text-gray-500 text-wrap text-start dark:text-gray-400"}>
                                        {t("Time allowed for lateness before sending a warning.")}</p>
                                </div>
                                <div className={"flex-1"}>
                                    <ElementsSelect
                                        defaultValue={minutesOptions.find(o => o.id === minutesBeforeWarning)}
                                        options={minutesOptions}
                                        onChange={(val) => setMinutesBeforeWarning(val[0]?.id || "30")}
                                        isMultiple={false}
                                    />
                                </div>
                            </div>
                            <div className={"flex justify-between items-center gap-4"}>
                                <div className={"flex flex-col items-start justify-center w-9/12 gap-1"}>
                                    <p className={"text-sm text-black text-wrap text-start dark:text-gray-200"}>{t("Number of daily working hours for each employee")}</p>
                                    <p className={"text-xs text-gray-500 text-wrap text-start dark:text-gray-400"}>{t("Standard daily working hours per employee.")}</p>
                                </div>
                                <div className={"flex-1"}>
                                    <ElementsSelect
                                        defaultValue={hoursOptions.find(o => o.id === dailyWorkingHours)}
                                        options={hoursOptions}
                                        onChange={(val) => setDailyWorkingHours(val[0]?.id || "8")}
                                        isMultiple={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"flex gap-2"}>
                        <DefaultButton type={'button'} title={"Cancel"} className={"font-medium dark:text-gray-200"} />
                        <DefaultButton type={'button'} disabled={isUpdating || !canEdit} onClick={handleApplyChanges} title={canEdit ? "Apply Changes" : t("You do not have permission")}
                            className={canEdit ? "bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white" : "bg-gray-300 font-medium text-gray-500 cursor-not-allowed"} />
                    </div>
                </div>
            </div>
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
            />
        </div>
    )
}

export default AttendanceTab;
