import DefaultButton from "@/components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetChatSettingsQuery, useUpdateChatSettingsMutation } from "@/redux/api/settingsApi";
import { selectUser, selectPermissions } from "@/redux/auth/authSlice";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import WordTheMiddleAndLine from "@/components/Subcomponents/WordTheMiddleAndLine.jsx";

const fileSizeOptions = [
    { id: "5242880", element: "5 MB" },
    { id: "10485760", element: "10 MB" },
    { id: "26214400", element: "25 MB" },
    { id: "52428800", element: "50 MB" },
    { id: "104857600", element: "100 MB" },
];

const retentionOptions = [
    { id: "30", element: "30 Days" },
    { id: "90", element: "90 Days" },
    { id: "365", element: "1 Year" },
];

function ConversationsTab() {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const userPermissions = useSelector(selectPermissions);
    const canEdit = user?.type === "Subscriber" || (Array.isArray(userPermissions) && userPermissions.includes("chats.manage_settings"));
    const { data: settings, isLoading } = useGetChatSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateChatSettingsMutation();

    const [retentionDays, setRetentionDays] = useState("90");
    const [maxFileSize, setMaxFileSize] = useState("10485760");
    const [autoCreateChat, setAutoCreateChat] = useState(true);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    useEffect(() => {
        if (settings) {
            setRetentionDays(String(settings.retention_days ?? 90));
            setMaxFileSize(String(settings.max_file_size_bytes ?? 10485760));
            setAutoCreateChat(settings.auto_create_project_chat ?? true);
        }
    }, [settings]);

    const handleApplyChanges = async () => {
        try {
            await updateSettings({
                retention_days: parseInt(retentionDays, 10),
                max_file_size_bytes: parseInt(maxFileSize, 10),
                auto_create_project_chat: autoCreateChat,
            }).unwrap();
            setApiResponse({ isOpen: true, status: "success", message: t("Chat settings updated successfully") });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update chat settings"),
            });
        }
    };

    if (isLoading) return <div className="p-4">{t("Loading...")}</div>;

    return (
        <div className={"flex w-full justify-center"}>
            <div className={"md:p-5 p-4 rounded-2xl bg-white dark:bg-gray-800 lg:w-[39%]"}>
                <div className={"w-full md:py-2 flex flex-col gap-6"}>
                    <div className={"flex flex-col gap-6"}>
                        <div className={"flex flex-col text-start gap-1"}>
                            <p className={"dark:text-gray-200 text-md text-black"}>{t("Conversations/Chat")}</p>
                            <p className={"text-sm text-gray-500 dark:text-gray-400"}>{t("Manage chat and file sharing settings.")}</p>
                        </div>

                        <div className={"flex flex-col gap-4"}>
                            <div className={"flex justify-between items-center gap-4"}>
                                <div className={"flex flex-col items-start justify-center w-[70%] gap-1"}>
                                    <p className={"text-sm text-black text-wrap text-start dark:text-gray-200"}>{t("Message Retention Period")}</p>
                                    <p className={"text-xs text-gray-500 text-wrap text-start dark:text-gray-400"}>
                                        {t("How long to keep chat messages before automatic deletion.")}
                                    </p>
                                </div>
                                <div className={"flex-1"}>
                                    <ElementsSelect
                                        defaultValue={retentionOptions.find(o => o.id === retentionDays)}
                                        options={retentionOptions}
                                        onChange={(val) => setRetentionDays(val[0]?.id || "90")}
                                        isMultiple={false}
                                    />
                                </div>
                            </div>

                            <div className={"flex justify-between items-center gap-4"}>
                                <div className={"flex flex-col items-start justify-center w-[70%] gap-1"}>
                                    <p className={"text-sm text-black text-wrap text-start dark:text-gray-200"}>{t("Maximum File Upload Size")}</p>
                                    <p className={"text-xs text-gray-500 text-wrap text-start dark:text-gray-400"}>
                                        {t("Maximum file size allowed for upload in chats.")}
                                    </p>
                                </div>
                                <div className={"flex-1"}>
                                    <ElementsSelect
                                        defaultValue={fileSizeOptions.find(o => o.id === maxFileSize)}
                                        options={fileSizeOptions}
                                        onChange={(val) => setMaxFileSize(val[0]?.id || "10485760")}
                                        isMultiple={false}
                                    />
                                </div>
                            </div>

                            <WordTheMiddleAndLine />

                            <div className={"flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-status-border"}>
                                <div className={"flex flex-col text-start"}>
                                    <p className={"text-sm text-black font-medium text-wrap dark:text-gray-200"}>{t("Auto-create Project Chat")}</p>
                                    <p className={"text-xs text-gray-500 text-wrap dark:text-gray-400"}>
                                        {t("Automatically create a group chat when a new project is created.")}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={autoCreateChat} onChange={() => setAutoCreateChat(!autoCreateChat)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500 dark:peer-checked:bg-primary-200"></div>
                                </label>
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

export default ConversationsTab;
