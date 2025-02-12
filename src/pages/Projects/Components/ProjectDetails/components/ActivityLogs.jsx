import {FaCirclePlus} from "react-icons/fa6";
import PropTypes from "prop-types";
import {IoDocument, IoVideocam} from "react-icons/io5";
import {FaCheckCircle} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import {translateTime} from "../../../../../functions/Days.js";


function ActivityLogs({activityLogs}) {
    const {t} = useTranslation()
    const getTypeActivityIcons = (type) => {
        switch (type) {
            case "add":
               return (
                   <div className={"p-1.5 rounded-full bg-cyan-50"}>
                       <FaCirclePlus size={18} className={"text-cyan-700 rounded"}/>
                   </div>
               )
            case "check":
                return (
                    <div className={"p-1.5 rounded-full bg-green-50"}>
                        <FaCheckCircle  size={15} className={"text-green-600 rounded"} />
                    </div>
                )
            case "uploaded":
                return (
                    <div className={"p-1.5 rounded-full bg-gray-100"}>
                        <IoDocument  size={15} className={"text-gray-600 rounded"} />
                    </div>
                )
            case "video":
                return (
                    <div className={"p-1.5 rounded-full bg-blue-50"}>
                        <IoVideocam   size={15} className={"text-blue-300 rounded"} />
                    </div>
                )
            default:
                return (
                    <div className={"p-1.5 rounded-full bg-teal-300"}>
                        <FaCirclePlus size={18} className={"text-teal-500 rounded"}/>
                    </div>
                )
        }
    };
    return (
        <div className={"flex flex-col w-full p-4 rounded-2xl items-start gap-3 bg-white dark:bg-white-0"}>
            <p className={"text-lg dark:text-gray-200"}>{t("Activity Logs")}</p>
            <div className={"max-h-64 h-auto flex flex-col w-full overflow-hidden overflow-y-auto custom-scroll"}>
                {
                    activityLogs.map((activityLog, index) => (
                            <div key={index} className={"flex gap-2 justify-start items-start h-80"}>
                                <div className={"flex flex-col justify-start items-center h-full"}>
                                        {
                                            getTypeActivityIcons(activityLog.type)
                                        }

                                    {
                                        index < activityLogs.length - 1 && (
                                        <div className={"w-[1px] bg-gray-200 h-full dark:bg-soft-500"}></div>
                                    )}
                                </div>
                                <div className={"flex flex-col items-start gap-2 pb-4"}>
                                    <div className={"flex gap-1 justify-start"}>
                                        <p className={"text-sm dark:text-gray-200"}>{t(activityLog.title)}</p>
                                    </div>
                                    <p className={"max-w-full text-wrap text-start text-xs text-sub-500 dark:text-sub-300"}>
                                        {activityLog.description}
                                    </p>
                                    <span className={"text-[11px] text-soft-400 dark:text-soft-200"}>{translateTime(activityLog.timeAgo)}</span>
                                </div>

                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}

ActivityLogs.propTypes = {
    activityLogs:PropTypes.array.isRequired
}
export default ActivityLogs;