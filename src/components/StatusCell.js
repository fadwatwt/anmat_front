import {RiCheckboxCircleFill, RiCloseCircleFill, RiQuestionLine} from "@remixicon/react";


    const statusConfig = {
        Active: {
            bgColor: "bg-green-50",
            icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
            textColor: "text-green-700",
        },
        'Not-active': {
            bgColor: "bg-red-50",
            icon: <RiCloseCircleFill size={15} className="text-red-700" />,
            textColor: "text-red-700",
        }
    };
const statusCell = (status, _id) => {
    const config = statusConfig[status] || {
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
