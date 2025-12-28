import {RiCheckboxCircleFill, RiCloseCircleFill, RiQuestionLine} from "@remixicon/react";

const normalizeStatus = (status) => {
    if (!status) return "";

    const lowerStatus = status.toLowerCase().trim();

    // توحيد حالات التفعيل
    if (lowerStatus === "active") {
        return "active";
    }
    if (lowerStatus === "paid") {
        return "paid";
    }

    // توحيد حالات إلغاء التفعيل (تقبل كل الصيغ المذكورة)
    if (["not-active", "not active", "in-active", "inactive"].includes(lowerStatus)) {
        // قم بتغيير 'in-active' أدناه إلى الصيغة التي يتوقعها مكون statusCell لعرض اللون الأحمر
        return "in-active";
    }
    if (["not-paid", "not paid"].includes(lowerStatus)) {
        return "Not-paid";
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
