import { FaCirclePlus } from "react-icons/fa6";
import PropTypes from "prop-types";
import { IoDocument, IoVideocam } from "react-icons/io5";
import { FaCheckCircle, FaEdit, FaTrash, FaSignInAlt, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { translateTime } from "../functions/Days.js";


export const mapBackendLogToFrontend = (log, t) => {
    let type = "add";
    const action = (log.action || "").toLowerCase();
    
    // Formatting title: task.status_changed -> Task Status Changed
    const formatTitle = (str) => {
        if (!str) return "";
        return str.split('.').join(' ').split('_').join(' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    let title = formatTitle(log.action || "activity");
    let description = "";

    if (action.includes("created") || action.includes("added") || action.includes("uploaded")) type = "add";
    else if (action.includes("updated") || action.includes("changed") || action.includes("evaluated") || action.includes("status")) type = "update";
    else if (action.includes("deleted") || action.includes("removed")) type = "delete";
    else if (action.includes("login")) type = "login";
    else if (action.includes("logout")) type = "logout";
    else if (action.includes("employee") || action.includes("user")) type = "user";

    if (action.includes("attachment")) type = "uploaded";
    if (action.includes("done") || action.includes("completed")) type = "check";

    const actor = log.meta?.actor_name || log.actor_type || t("System");
    const target = log.meta?.name || log.meta?.title || log.target_type || log.module;
    const project = log.meta?.project_name ? ` ${t("in project")} ${log.meta.project_name}` : "";

    if (action === "task.comment_added") {
        description = `${actor} ${t("added a comment to task")} "${target}"${project}.`;
    } else if (action === "project.comment_added") {
        description = `${actor} ${t("added a comment to project")} "${target}".`;
    } else if (action === "task.status_changed") {
        const status = log.meta?.new_status || log.meta?.status || t("unknown");
        description = `${actor} ${t("changed status of task")} "${target}" ${t("to")} ${t(status)}${project}.`;
    } else if (action === "task.evaluated") {
        description = `${actor} ${t("evaluated task")} "${target}" ${t("with score")} ${log.meta?.score}/5${project}.`;
    } else if (action === "task.attachment_uploaded") {
        description = `${actor} ${t("uploaded attachment")} "${log.meta?.name}" ${t("to task")} "${target}"${project}.`;
    } else if (type === "add") {
        description = `${actor} ${t("created new")} ${t(target)}.`;
    } else if (type === "update") {
        description = `${actor} ${t("updated")} ${t(target)}.`;
    } else if (type === "delete") {
        description = `${actor} ${t("deleted")} ${t(target)}.`;
    } else if (type === "login") {
        description = `${actor} ${t("logged in")}.`;
    } else if (type === "logout") {
        description = `${actor} ${t("logged out")}.`;
    } else {
        description = `${actor} ${t("performed")} ${action} ${t("on")} ${t(target)}.`;
    }

    return {
        type,
        title: t(title),
        description,
        timeAgo: log.created_at
    };
};

function ActivityLogs({ activityLogs, className, isRawLogs = true, isLoading = false }) {
    const { t } = useTranslation();
    const getTypeActivityIcons = (type) => {
        switch (type) {
            case "add":
                return (
                    <div className={"p-2 rounded-full bg-cyan-50 border border-cyan-100 shadow-sm"}>
                        <FaCirclePlus size={16} className={"text-cyan-600"} />
                    </div>
                )
            case "check":
                return (
                    <div className={"p-2 rounded-full bg-green-50 border border-green-100 shadow-sm"}>
                        <FaCheckCircle size={16} className={"text-green-600"} />
                    </div>
                )
            case "uploaded":
                return (
                    <div className={"p-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm"}>
                        <IoDocument size={16} className={"text-blue-600"} />
                    </div>
                )
            case "update":
                return (
                    <div className={"p-2 rounded-full bg-amber-50 border border-amber-100 shadow-sm"}>
                        <FaEdit size={16} className={"text-amber-600"} />
                    </div>
                )
            case "delete":
                return (
                    <div className={"p-2 rounded-full bg-red-50 border border-red-100 shadow-sm"}>
                        <FaTrash size={16} className={"text-red-600"} />
                    </div>
                )
            default:
                return (
                    <div className={"p-2 rounded-full bg-slate-50 border border-slate-100 shadow-sm"}>
                        <FaCirclePlus size={16} className={"text-slate-600"} />
                    </div>
                )
        }
    };

    const logsToRender = isRawLogs ? (activityLogs || []).map(log => mapBackendLogToFrontend(log, t)) : activityLogs;
    
    return (
        <div className={"flex flex-col w-full p-6 rounded-3xl items-start gap-4 bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md"}>
            <div className="flex justify-between items-center w-full">
                <p className={"text-xl font-bold text-slate-800 tracking-tight"}>{t("Activity Logs")}</p>
                {!isLoading && logsToRender.length > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full">
                        {logsToRender.length} {t("Recent")}
                    </span>
                )}
            </div>

            <div className={"flex flex-col w-full overflow-hidden overflow-y-auto pr-2 custom-scroll " + className} style={{ scrollbarWidth: 'thin' }}>
                {isLoading ? (
                    <div className="flex flex-col gap-6 w-full py-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex-shrink-0"></div>
                                <div className="flex flex-col gap-2 flex-1 pt-1">
                                    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : logsToRender.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 w-full gap-2 opacity-60">
                        <div className="p-3 bg-slate-50 rounded-full">
                            <IoDocument size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-400 font-medium">{t("No recent activity")}</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* The vertical timeline line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-slate-100 z-0"></div>
                        
                        <div className="flex flex-col gap-0">
                            {logsToRender.map((activityLog, index) => (
                                <div key={index} className="group flex gap-4 items-start relative z-10 pb-6 last:pb-0">
                                    <div className="flex-shrink-0 bg-white">
                                        {getTypeActivityIcons(activityLog.type)}
                                    </div>
                                    
                                    <div className="flex flex-col items-start gap-1 pt-1.5 flex-1 min-w-0">
                                        <div className="flex justify-between items-center w-full gap-2">
                                            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-cyan-600 transition-colors">
                                                {activityLog.title}
                                            </p>
                                            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded">
                                                {translateTime(activityLog.timeAgo)}
                                            </span>
                                        </div>
                                        <p className="text-[13px] text-slate-500 leading-relaxed text-start">
                                            {activityLog.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

ActivityLogs.propTypes = {
    activityLogs: PropTypes.array,
    className: PropTypes.string,
    isRawLogs: PropTypes.bool,
    isLoading: PropTypes.bool
}
export default ActivityLogs;