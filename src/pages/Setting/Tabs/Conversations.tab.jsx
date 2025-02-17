import DefaultButton from "../../../components/Form/DefaultButton.jsx";
import {useTranslation} from "react-i18next";
import DefaultSelect from "../../../components/Form/DefaultSelect.jsx";

function ConversationsTab() {
    const {t} = useTranslation()
    const whoCreateGroupChatOptions = [
        {id: "admins", value: `${t("Admins")}`},
        {id: "employees", value: `${t("Admins&Employees")}`},
    ]
    const whoCreateMeetingOptions = [
        {id: "employees", value:`${t("Admins&Employees")}`},
        {id: "admins", value: `${t("Admins")}`},
    ]
    return (
        <div className={"flex  w-full justify-center "}>
            <div className={"md:p-5 p-4 rounded-2xl bg-white dark:bg-gray-800 lg:w-[39%]"}>
                <div className={"w-full md:py-2 flex flex-col gap-6"}>
                    <div className={"flex flex-col gap-6"}>
                        <div className={"flex flex-col text-start gap-1"}>
                            <p className={"dark:text-gray-200 text-md text-black"}>{t("Conversations/Chat")}</p>
                            <p className={"text-sm dark:text-gray-200 text-gray-500"}>{t("Manage chat and meeting permissions.")}</p>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <div className={"flex justify-between items-center gap-4"}>
                                <div className={"flex flex-col items-start justify-center w-[70%] gap-1"}>
                                    <p className={"text-sm text-black text-wrap text-start"}>{t("Who can create a group chat?")}</p>
                                    <p className={"text-xs text-gray-500 text-wrap text-start"}>{t("Specify which roles are allowed to initiate group chats.")}</p>
                                </div>
                                <DefaultSelect classNameContainer={"flex-1"} classNameSelect={"text-black text-sm p-3"}
                                               onChange={() => {
                                               }} options={whoCreateGroupChatOptions}/>
                            </div>
                            <div className={"flex justify-between items-center gap-4"}>
                                <div className={"flex flex-col items-start justify-center w-[70%] gap-1"}>
                                    <p className={"text-sm text-black text-wrap text-start"}>{t("Who can create a meeting?")}</p>
                                    <p className={"text-xs text-gray-500 text-wrap text-start"}>{t("Define which roles have permission to schedule meetings.")}</p>
                                </div>
                                <DefaultSelect classNameContainer={"flex-1"} classNameSelect={"text-black text-sm p-3"}
                                               onChange={() => {
                                               }} options={whoCreateMeetingOptions}/>
                            </div>
                        </div>
                    </div>
                    <div className={"flex gap-2"}>
                        <DefaultButton type={'button'} title={"Cancel"} className={"font-medium dark:text-gray-200"}/>
                        <DefaultButton type={'button'} onClick={() => {}} title={"Apply Changes"}
                                       className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"}/>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ConversationsTab;