import { useTranslation } from "react-i18next";
import {
    RiMoneyDollarCircleLine,
    RiTimeLine,
    RiCalendarLine,
    RiCheckboxCircleLine,
    RiTaskLine,
    RiStarLine,
    RiCheckboxCircleFill,
} from "@remixicon/react";
import StarRating from "@/components/StarRating";

function WorkInformation() {
    const { t } = useTranslation();

    const info = [
        {
            icon: <RiMoneyDollarCircleLine size={18} className="text-cell-secondary" />,
            label: "Salary",
            value: "$3,500/month",
        },
        {
            icon: <RiTimeLine size={18} className="text-cell-secondary" />,
            label: "Working Hours",
            value: "8 hours/day",
        },
        {
            icon: <RiCalendarLine size={18} className="text-cell-secondary" />,
            label: "Annual Leave Days",
            value: "21 days/year",
        },
        {
            icon: <RiCheckboxCircleFill size={18} className="text-cell-secondary" />,
            label: "Attendance Rate",
            value: "95% for the month",
        },
        {
            icon: <RiTaskLine size={18} className="text-cell-secondary" />,
            label: "Task Completion",
            value: "67%",
        },
    ];

    return (
        <div className="bg-surface rounded-2xl p-6 h-full flex flex-col gap-6">
            <h3 className="text-lg font-medium text-cell-primary">{t("Work Information")}</h3>
            <div className="flex flex-col gap-4">
                {info.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-cell-secondary text-sm">{t(item.label)}:</span>
                        <span className="text-cell-primary text-sm font-medium">{t(item.value)}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <RiStarLine size={18} className="text-cell-secondary" />
                    <span className="text-cell-secondary text-sm">{t("Rating")}:</span>
                    <StarRating rating={4.5} />
                    <span className="text-cell-primary text-sm font-medium">4.5</span>
                </div>
            </div>
        </div>
    );
}

export default WorkInformation;
