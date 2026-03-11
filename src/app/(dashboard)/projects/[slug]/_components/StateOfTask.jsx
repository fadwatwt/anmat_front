import {MdCheckCircle} from "react-icons/md";
import PropTypes from "prop-types";
import {FiClock} from "react-icons/fi";
import {useTranslation} from "react-i18next";

function StateOfTask({type,timeLate}) {
    const {t} = useTranslation()
    switch (type){
        case "Delayed":
            return (
                <div className={"flex items-center rounded-full py-0.5 px-2 gap-1 bg-amber-50 dark:bg-amber-900/20"}>
                    <FiClock className={"text-amber-700 dark:text-amber-400"} size={12} />
                    <p className={"text-amber-700 dark:text-amber-400 text-[11px] font-medium"}>{t("Delayed")}</p>
                </div>
            );
        case "late":
            return (
                <div className={"flex items-center rounded-full py-0.5 px-2 gap-1 bg-red-50 dark:bg-red-900/20"}>
                    <FiClock className={"text-red-700 dark:text-red-400"} size={12} />
                    <p className={"text-red-700 dark:text-red-400 text-[11px] font-medium"}>{timeLate || t("Late")}</p>
                </div>
            );
        case "open":
            return (
                <div className={"flex items-center rounded-full py-0.5 px-2 gap-1 bg-blue-50 dark:bg-blue-900/20"}>
                    <MdCheckCircle className={"text-blue-700 dark:text-blue-400"} size={12} />
                    <p className={"text-blue-700 dark:text-blue-400 text-[11px] font-medium"}>{t("Open")}</p>
                </div>
            );
        case "completed":
        case "done":
            return (
                <div className={"flex items-center rounded-full py-0.5 px-2 gap-1 bg-green-50 dark:bg-green-900/20"}>
                    <MdCheckCircle className={"text-green-700 dark:text-green-400"} size={12} />
                    <p className={"text-green-700 dark:text-green-400 text-[11px] font-medium"}>{t("Completed")}</p>
                </div>
            );
        case "in-progress":
            return (
                <div className={"flex items-center rounded-full py-0.5 px-2 gap-1 bg-indigo-50 dark:bg-indigo-900/20"}>
                    <FiClock className={"text-indigo-700 dark:text-indigo-400"} size={12} />
                    <p className={"text-indigo-700 dark:text-indigo-400 text-[11px] font-medium"}>{t("In Progress")}</p>
                </div>
            );
        case "cancelled":
            return (
                <div className={"flex items-center rounded-full py-0.5 px-2 gap-1 bg-gray-50 dark:bg-gray-900/20"}>
                    <MdCheckCircle className={"text-gray-700 dark:text-gray-400"} size={12} />
                    <p className={"text-gray-700 dark:text-gray-400 text-[11px] font-medium"}>{t("Cancelled")}</p>
                </div>
            );
        default:
            return (
                <div className={"flex items-center rounded-full py-0.5 px-2 gap-1 bg-slate-50 dark:bg-slate-900/20"}>
                    <p className={"text-slate-700 dark:text-slate-400 text-[11px] font-medium uppercase"}>{t(type)}</p>
                </div>
            );
    }

}

StateOfTask.propTypes = {
    type: PropTypes.string,
    timeLate: PropTypes.string
}

export default StateOfTask;