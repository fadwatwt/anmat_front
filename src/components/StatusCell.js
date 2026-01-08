import { RiCheckboxCircleFill, RiCloseCircleFill, RiQuestionLine, RiTimeLine, RiErrorWarningFill } from "@remixicon/react";

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
        return "Not-paid";
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

    return lowerStatus;
};

const statusConfig = {
    "active": {
        bgColor: "bg-green-50",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
        textColor: "text-green-700",
    },
    'in-active': {
        bgColor: "bg-red-50",
        icon: <RiCloseCircleFill size={15} className="text-red-700" />,
        textColor: "text-red-700",
    },
    "Not-paid": {
        bgColor: "bg-red-50",
        icon: <RiCloseCircleFill size={15} className="text-red-700" />,
        textColor: "text-red-700",
    },
    "paid": {
        bgColor: "bg-green-50",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
        textColor: "text-green-700",
    },
    "scheduled": {
        bgColor: "bg-blue-50",
        icon: <RiTimeLine size={15} className="text-blue-700" />,
        textColor: "text-blue-700",
    },
    "completed": {
        bgColor: "bg-green-50",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
        textColor: "text-green-700",
    },
    "cancelled": {
        bgColor: "bg-red-50",
        icon: <RiCloseCircleFill size={15} className="text-red-700" />,
        textColor: "text-red-700",
    },
    "delayed": {
        bgColor: "bg-orange-50",
        icon: <RiErrorWarningFill size={15} className="text-orange-700" />,
        textColor: "text-orange-700",
    },
};

const statusCell = (status, _id) => {
    const statusKey = normalizeStatus(status);
    const config = statusConfig[statusKey] || {
        bgColor: "bg-gray-50",
        icon: <RiQuestionLine size={15} className="text-gray-700" />,
        textColor: "text-gray-700",
    };

    return (
        <div key={`${_id}_status`} className="px-2 py-1">
            <div
                key={`status-${status}`}
                className={`flex items-center justify-center gap-1 ${config.bgColor} px-1 py-1 rounded-md`}
            >
                {config.icon}
                <span className={`text-xs ${config.textColor}`}>
                    {status}
                </span>
            </div>
        </div>
    );
};

export { statusCell, statusConfig };
