import { useTranslation } from "react-i18next";
import {
    RiMoneyDollarCircleLine,
    RiTimeLine,
    RiCalendarLine,
    RiCheckboxCircleLine,
    RiTaskLine,
} from "@remixicon/react";
import StarRating from "@/components/StarRating";

function WorkInformation() {
    const { t } = useTranslation();

    const info = [
        {
            icon: <RiMoneyDollarCircleLine size={18} className="text-gray-400" />,
            label: "Salary",
            value: "$3,500/month",
        },
        {
            icon: <RiTimeLine size={18} className="text-gray-400" />,
            label: "Working Hours",
            value: "8 hours/day",
        },
        {
            icon: <RiCalendarLine size={18} className="text-gray-400" />,
            label: "Annual Leave Days",
            value: "21 days/year",
        },
        {
            icon: <RiCheckboxCircleLine size={18} className="text-gray-400" />,
            label: "Attendance Rate",
            value: "95% for the month",
        },
        {
            icon: <RiTaskLine size={18} className="text-gray-400" />,
            label: "Task Completion",
            value: "67%",
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-full flex flex-col gap-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t("Work Information")}</h3>
            <div className="flex flex-col gap-4">
                {info.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-gray-400 text-sm">{t(item.label)}:</span>
                        <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">{t(item.value)}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <StarRating rating={4.5} />
                </div>
            </div>
        </div>
    );
}

export default WorkInformation;
