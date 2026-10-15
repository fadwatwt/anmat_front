import { RiCheckboxCircleFill, RiCloseCircleFill, RiQuestionLine, RiTimeLine, RiErrorWarningFill, RiInformationLine } from "@remixicon/react";
import i18n from "i18next";

const normalizeStatus = (status) => {
    if (!status) return "";

    const lowerStatus = status.toLowerCase().trim();

    // Homogenize active statuses
    if (lowerStatus === "active") {
        return "active";
    }
    if (lowerStatus === "paid") {
        return "paid";
    }

    // Homogenize inactive statuses (accepts all variations)
    if (["not-active", "not active", "in-active", "inactive"].includes(lowerStatus)) {
        return "in-active";
    }
    if (["not-paid", "not paid"].includes(lowerStatus)) {
        return "not-paid";
    }
    if (["completed"].includes(lowerStatus)) {
        return "completed";
    }
    if (["scheduled"].includes(lowerStatus)) {
        return "scheduled";
    }
    if (["cancelled", "canceled"].includes(lowerStatus)) {
        return "cancelled";
    }
    if (["delayed"].includes(lowerStatus)) {
        return "delayed";
    }
    if (lowerStatus === "terminated") {
        return "terminated";
    }
    if (lowerStatus === "expired") {
        return "expired";
    }
    if (["past_due", "past due", "past-due"].includes(lowerStatus)) {
        return "past_due";
    }
    if (lowerStatus === "unpaid") {
        return "unpaid";
    }

    return lowerStatus;
};

const statusConfig = {
    "active": {
        bgColor: "bg-green-50 dark:bg-green-900/20",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700 dark:text-green-400" />,
        textColor: "text-green-700 dark:text-green-400",
    },
    'in-active': {
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: <RiCloseCircleFill size={15} className="text-red-700 dark:text-red-400" />,
        textColor: "text-red-700 dark:text-red-400",
    },
    "Not-paid": {
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: <RiCloseCircleFill size={15} className="text-red-700 dark:text-red-400" />,
        textColor: "text-red-700 dark:text-red-400",
    },
    "not-paid": {
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: <RiCloseCircleFill size={15} className="text-red-700 dark:text-red-400" />,
        textColor: "text-red-700 dark:text-red-400",
    },
    "paid": {
        bgColor: "bg-green-50 dark:bg-green-900/20",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700 dark:text-green-400" />,
        textColor: "text-green-700 dark:text-green-400",
    },
    "scheduled": {
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        icon: <RiTimeLine size={15} className="text-blue-700 dark:text-blue-400" />,
        textColor: "text-blue-700 dark:text-blue-400",
    },
    "completed": {
        bgColor: "bg-green-50 dark:bg-green-900/20",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700 dark:text-green-400" />,
        textColor: "text-green-700 dark:text-green-400",
    },
    "cancelled": {
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: <RiCloseCircleFill size={15} className="text-red-700 dark:text-red-400" />,
        textColor: "text-red-700 dark:text-red-400",
    },
    "delayed": {
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        icon: <RiErrorWarningFill size={15} className="text-orange-700 dark:text-orange-400" />,
        textColor: "text-orange-700 dark:text-orange-400",
    },
    "pending": {
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        icon: <RiQuestionLine size={15} className="text-yellow-700 dark:text-yellow-400" />,
        textColor: "text-yellow-700 dark:text-yellow-400",
    },
    "approved": {
        bgColor: "bg-green-50 dark:bg-green-900/20",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700 dark:text-green-400" />,
        textColor: "text-green-700 dark:text-green-400",
    },
    "rejected": {
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: <RiCloseCircleFill size={15} className="text-red-700 dark:text-red-400" />,
        textColor: "text-red-700 dark:text-red-400",
    },
    "terminated": {
        bgColor: "bg-status-bg",
        icon: <RiCloseCircleFill size={15} className="text-cell-secondary" />,
        textColor: "text-cell-secondary",
    },
    "expired": {
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        icon: <RiErrorWarningFill size={15} className="text-orange-700 dark:text-orange-400" />,
        textColor: "text-orange-700 dark:text-orange-400",
    },
    "inactive": {
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: <RiCloseCircleFill size={15} className="text-red-700 dark:text-red-400" />,
        textColor: "text-red-700 dark:text-red-400",
    },
    "past_due": {
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        icon: <RiErrorWarningFill size={15} className="text-yellow-700 dark:text-yellow-400" />,
        textColor: "text-yellow-700 dark:text-yellow-400",
    },
    "unpaid": {
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: <RiCloseCircleFill size={15} className="text-red-700 dark:text-red-400" />,
        textColor: "text-red-700 dark:text-red-400",
    },
    "open": {
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        icon: <RiInformationLine size={15} className="text-yellow-700 dark:text-yellow-400" />,
        textColor: "text-yellow-700 dark:text-yellow-400",
    },
    "under-review": {
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        icon: <RiTimeLine size={15} className="text-yellow-700 dark:text-yellow-400" />,
        textColor: "text-yellow-700 dark:text-yellow-400",
    },
    "in-progress": {
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        icon: <RiTimeLine size={15} className="text-blue-700 dark:text-blue-400" />,
        textColor: "text-blue-700 dark:text-blue-400",
    },
    "accepted": {
        bgColor: "bg-green-50 dark:bg-green-900/20",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700 dark:text-green-400" />,
        textColor: "text-green-700 dark:text-green-400",
    },
};

const statusCell = (status, _id) => {
    const statusKey = normalizeStatus(status);
    const config = statusConfig[statusKey] || {
        bgColor: "bg-status-bg",
        icon: <RiQuestionLine size={15} className="text-cell-secondary" />,
        textColor: "text-cell-secondary",
    };

    return (
        <div key={`${_id}_status`} data-status={statusKey} className="px-2 py-1">
            <div
                key={`status-${status}`}
                className={`flex items-center justify-center gap-1 ${config.bgColor ? config.bgColor : "bg-status-bg"} border border-status-border px-1 py-1 rounded-md`}
            >
                {config.icon}
                <span className={`text-xs font-medium capitalize ${config.textColor}`}>
                    {i18n.t(status ? status.split(/[-_\s]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") : "")}
                </span>
            </div>
        </div>
    );
};

export { statusCell, statusConfig };
