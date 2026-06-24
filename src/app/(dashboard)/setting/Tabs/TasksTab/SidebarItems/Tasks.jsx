import { useTranslation } from "react-i18next";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import WordTheMiddleAndLine from "@/components/Subcomponents/WordTheMiddleAndLine.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import { useState, useEffect } from "react";
import { useGetUserPreferencesQuery, useUpdateUserPreferencesMutation } from "@/redux/api/settingsApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function Tasks() {
    const { t } = useTranslation();
    const { data: preferences, isLoading } = useGetUserPreferencesQuery();
    const [updatePreferences, { isLoading: isUpdating }] = useUpdateUserPreferencesMutation();
    const [minTasks, setMinTasks] = useState(2);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    useEffect(() => {
        if (preferences?.min_tasks !== undefined) {
            setMinTasks(preferences.min_tasks);
        }
    }, [preferences]);

    const handleApplyChanges = async () => {
        try {
            const value = parseInt(minTasks, 10);
            if (isNaN(value) || value < 1) {
                setApiResponse({ isOpen: true, status: "error", message: t("Minimum number of tasks must be a positive integer") });
                return;
            }
            await updatePreferences({ min_tasks: value }).unwrap();
            setApiResponse({ isOpen: true, status: "success", message: t("Settings updated successfully") });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update settings"),
            });
        }
    };

    if (isLoading) return <div className="p-4">{t("Loading...")}</div>;

    return (
        <div className={"w-full md:py-2 flex flex-col gap-5"}>
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-col text-start gap-1"}>
                    <p className={"dark:text-gray-200 text-black"}>{t("Tasks Preferences")}</p>
                    <p className={"text-sm text-gray-500 dark:text-gray-400"}>{t("Customize tasks settings")}</p>
                </div>
                <WordTheMiddleAndLine />
                <div className={"flex flex-col gap-2"}>
                    <InputAndLabel className={"rounded-md"} value={minTasks} onChange={(e) => setMinTasks(e.target.value)} title={"Minimum Number of Tasks When Creating a Project"} />
                </div>
            </div>
            <div className={"flex gap-2"}>
                <DefaultButton type={'button'} title={"Cancel"} className={"font-medium dark:text-gray-200"} />
                <DefaultButton type={'button'} disabled={isUpdating} onClick={handleApplyChanges} title={"Apply Changes"} className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"} />
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

export default Tasks;
