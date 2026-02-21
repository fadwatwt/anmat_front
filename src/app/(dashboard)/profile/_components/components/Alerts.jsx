
import { useTranslation } from "react-i18next";
import {
    RiNotification3Line,
    RiCalendarCheckLine,
    RiErrorWarningLine
} from "@remixicon/react";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel.jsx";

function Alerts({ className }) {
    const { t } = useTranslation();

    const alerts = [
        {
            icon: <RiErrorWarningLine size={15} className="text-red-500" />,
            bgColor: "bg-red-100 dark:bg-red-900/20",
            title: "DownTime",
            description: "Lorem Ipsum dummy text Lorem Ipsum text",
        },
        {
            icon: <RiCalendarCheckLine size={15} className="text-blue-500" />,
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
            title: "Task Due Date",
            description: "Lorem Ipsum dummy text Lorem Ipsum text",
        },
        {
            icon: <RiErrorWarningLine size={15} className="text-red-500" />,
            bgColor: "bg-red-100 dark:bg-red-900/20",
            title: "DownTime",
            description: "Lorem Ipsum dummy text Lorem Ipsum text",
        },
        {
            icon: <RiCalendarCheckLine size={15} className="text-blue-500" />,
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
            title: "Task Due Date",
            description: "Lorem Ipsum dummy text Lorem Ipsum text",
        },
    ];

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 h-full flex flex-col gap-6 ${className}`}>
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t("Alerts")}</h3>
                <SelectWithoutLabel title={"Today"} className={"w-[94px] h-[36px]"} />
            </div>
            <div className="flex flex-col gap-4">
                {alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${alert.bgColor} flex items-center justify-center shrink-0`}>
                            {alert.icon}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-900 dark:text-gray-100">{t(alert.title)}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-wrap">
                                {t(alert.description)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Alerts;
