import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import i18n from "i18next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectUserType, selectPermissions } from "@/redux/auth/authSlice";
import { useGetSubscriberOrganizationQuery, useUpdateSubscriberOrganizationMutation } from "@/redux/organizations/organizationsApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function RegionalPreferences() {
    const {t} = useTranslation()
    const userType = useSelector(selectUserType);
    const userPermissions = useSelector(selectPermissions);
    const canEdit = userType === "Subscriber" || (Array.isArray(userPermissions) && userPermissions.includes("organizations.manage_settings"));
    const { data: orgData, isLoading } = useGetSubscriberOrganizationQuery();
    const [updateOrg, { isLoading: isUpdating }] = useUpdateSubscriberOrganizationMutation();

    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [selectedTimezone, setSelectedTimezone] = useState("UTC");
    const [selectedTimeFormat, setSelectedTimeFormat] = useState("24h");
    const [selectedDateFormat, setSelectedDateFormat] = useState("yyyy-mm-dd");
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    useEffect(() => {
        if (orgData) {
            setSelectedTimezone(orgData.timezone || "UTC");
            setSelectedTimeFormat(orgData.time_format || "24h");
            setSelectedDateFormat(orgData.date_format || "yyyy-mm-dd");
        }
    }, [orgData]);

    const langugeOptions = [
        {id: "en", element: t("English")},
        {id: "ar", element: t("Arabic")},
    ]
    const timeFormatOptions = [
        {id: "12hr", element: t("12-hour format (AM/PM)")},
        {id: "24h", element: t("24-hour format")},
    ];
    const timezoneOptions = [
        {id: "UTC", element: t("UTC (Coordinated Universal Time)")},
        {id: "Asia/Riyadh", element: t("Riyadh (Arabia Standard Time)")},
        {id: "Asia/Dubai", element: t("Dubai (Gulf Standard Time)")},
        {id: "Africa/Cairo", element: t("Cairo (Eastern European Time)")},
        {id: "Asia/Amman", element: t("Amman (Eastern European Time)")},
        {id: "America/New_York", element: t("New York (Eastern Standard Time)")},
        {id: "America/Los_Angeles", element: t("Los Angeles (Pacific Standard Time)")},
        {id: "Europe/London", element: t("London (Greenwich Mean Time)")},
    ];
    const dateFormatOptions = [
        {id: "mm-dd-yyyy", element: t("MM/DD/YYYY")},
        {id: "dd-mm-yyyy", element: t("DD/MM/YYYY")},
        {id: "yyyy-mm-dd", element: t("YYYY-MM-DD")},
        {id: "dd-month-yyyy", element: t("DD Month YYYY")},
        {id: "month-dd-yyyy", element: t("Month DD, YYYY")},
    ];

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const handleApplyChanges = async () => {
        try {
            await updateOrg({
                timezone: selectedTimezone,
                time_format: selectedTimeFormat,
                date_format: selectedDateFormat,
            }).unwrap();
            changeLanguage(selectedLanguage);
            setApiResponse({ isOpen: true, status: "success", message: t("Regional preferences updated successfully") });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update regional preferences"),
            });
        }
    };
    if (isLoading) return <div className="p-4">{t("Loading...")}</div>;
    return (
        <div className={"w-full md:py-2 flex flex-col gap-5"}>
            <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-col text-start gap-1"}>
                    <p className={"dark:text-gray-200"}>{t("Regional Preferences")}</p>
                    <p className={"text-sm dark:text-gray-200"}>{t("Select your preferences for your region")}</p>
                </div>
                <div className={"flex flex-col gap-2"}>
                    <ElementsSelect
                        title={t("Language")}
                        defaultValue={langugeOptions.find(opt => opt.id === selectedLanguage)}
                        options={langugeOptions}
                        onChange={(vals) => setSelectedLanguage(vals[0]?.id)}
                        isMultiple={false}
                    />
                    <ElementsSelect
                        title={t("Timezone")}
                        defaultValue={timezoneOptions.find(opt => opt.id === selectedTimezone)}
                        options={timezoneOptions}
                        onChange={(vals)=> setSelectedTimezone(vals[0]?.id)}
                        isMultiple={false}
                    />
                    <ElementsSelect
                        title={t("Time Format")}
                        defaultValue={timeFormatOptions.find(opt => opt.id === selectedTimeFormat)}
                        options={timeFormatOptions}
                        onChange={(vals)=> setSelectedTimeFormat(vals[0]?.id)}
                        isMultiple={false}
                    />
                    <ElementsSelect
                        title={t("Date Format")}
                        defaultValue={dateFormatOptions.find(opt => opt.id === selectedDateFormat)}
                        options={dateFormatOptions}
                        onChange={(vals)=> setSelectedDateFormat(vals[0]?.id)}
                        isMultiple={false}
                    />
                </div>
            </div>
            <div className={"flex gap-2"}>
                <DefaultButton type={'button'} title={t("Cancel")} className={"font-medium dark:text-gray-200"} />
                <DefaultButton type={'button'} disabled={isUpdating || !canEdit} onClick={handleApplyChanges} title={canEdit ? t("Apply Changes") : t("You do not have permission")} className={canEdit ? "bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white" : "bg-gray-300 font-medium text-gray-500 cursor-not-allowed"} />
            </div>
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
            />
        </div>
    );
}

export default RegionalPreferences;