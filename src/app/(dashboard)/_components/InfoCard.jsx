"use client";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import ReadMore from "@/functions/ReadMore.jsx";
import ProjectProgress from "@/app/(dashboard)/projects/[slug]/_components/ProjectProgress.jsx";
import { FaTasks } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { translateDate } from "@/functions/Days.js";
import ActionsBtns from "@/components/ActionsBtns.jsx";
import useDropdown from "@/Hooks/useDropdown.js";

function InfoCard({ type, data, handelEditAction }) {
    const { t } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useDropdown();

    const name = data?.name || data?.title || (type === "project" ? "Project Omega" : "Taking a good look at the current website design.");

    const description = data?.description || (type === "project" ?
        "The website could really use a makeover to make it more user-friendly and visually appealing. We want to go for a fresh, modern look that keeps up with the latest design trends. The new design should make it super easy to navigate and read" :
        "Revamp the website to enhance user-friendliness and visual appeal. Aim for a sleek, contemporary design that aligns with current trends. The updated layout should prioritize easy navigation and readability.");

    const stages = data?.stages || (type === "project" ? [
        "Taking a good look at the current website design.",
        "Working with the UI/UX team to sketch out some wireframes and mockups.",
        "Tweaking the design based on what everyone thinks.",
        "Putting the final design changes into action with HTML, CSS, and JavaScript.",
        "Testing the site on various devices and browsers."
    ] : [
        "Assess the current website design thoroughly.",
        "Collaborate with the UI/UX team to create detailed wireframes and mockups.",
        "Refine the design based on team feedback.",
        "Implement the final design changes using HTML, CSS, and JavaScript.",
        "Conduct testing across multiple devices and browsers."
    ]);

    const status = data?.status || "Active";

    const stagesTitle = type === "project" ? "Key Tasks" : "Task Steps";

    const handleDropdownToggle = () => {
        setDropdownOpen((prev) => !prev);  // Toggle the dropdown state
    };

    return (
        <div className={"flex flex-col p-4 w-full bg-white dark:bg-white-0 rounded-2xl gap-3"}>
            <div className={"title-header re w-full flex justify-between items-center"}>
                <div className={"flex gap-2"}>
                    <p className={"text-xl dark:text-gray-200"}>{name}</p>
                    <Status type={status} title={status} />
                </div>
                <div className="relative cursor-pointer flex-1 flex justify-end dropdown-container" onClick={handleDropdownToggle}>
                    <PiDotsThreeVerticalBold />
                    {dropdownOpen && <ActionsBtns className={"mt-5"} isDeleteBtn={false} handleEdit={handelEditAction} />}
                </div>
            </div>

            <div className={"description flex flex-col gap-1 items-start"}>
                <p className={"text-sm dark:text-gray-200"}>{t("Description")}:</p>
                <p className={"text-xs text-soft-400 text-start dark:text-soft-200"}>{description}</p>
            </div>

            <div className={"department flex flex-col gap-1 items-start"}>
                <p className={"text-sm dark:text-gray-200"}>{t("Department")}:</p>
                <p className={"text-xs text-soft-400 text-start dark:text-soft-200"}>{data?.department || t("No Department")}</p>
            </div>

            {type === "project" && (
                <ProjectProgress lastUpdate={data?.lastUpdate || "2025-01-12T08:00:00"} progress={data?.progress ?? 0} />
            )}

            <div className={"flex p-4 h-full rounded-xl bg-veryWeak-50 dark:bg-veryWeak-500 justify-between"}>
                <IconWithTitleAndNumber title={"All Tasks"} icon={<FaTasks className={"text-primary-400 dark:text-primary-base"} />} text={String(data?.totalTasks ?? 0)} />
                <div className="line w-[1px] bg-gray-300"></div>
                <IconWithTitleAndNumber title={"Completed Tasks"} icon={<FaCircleCheck className={"text-green-600 dark:text-green-400"} />} text={String(data?.completedTasks ?? 0)} />
                <div className="line w-[1px] bg-gray-300"></div>
                <IconWithTitleAndNumber title={"Assigned Date"} icon={<HiOutlineCalendarDateRange className={"text-cyan-600"} />} date={data?.assignedDate || "2025-03-16T14:30:00"} />
                <div className="line w-[1px] bg-gray-300"></div>
                <IconWithTitleAndNumber title={"Due Date"} icon={<HiOutlineCalendarDateRange />} date={data?.dueDate || "2025-01-15T14:30:00"} />
            </div>
        </div>
    );
}

function IconWithTitleAndNumber({ title, icon, text, date }) {
    const { t } = useTranslation();
    return (
        <div className={"flex gap-3 items-center"}>
            <div className={"p-[6px] rounded-full bg-primary-lighter"}>
                {icon && React.cloneElement(icon)}
            </div>
            <div className={"flex flex-col items-start"}>
                <p className={"text-sub-500 text-xs dark:text-gray-300"}>{t(title)}</p>
                {text && <p className={"text-sm dark:text-gray-100"}>{text}</p>}
                {date && <p className={"text-sm dark:text-gray-100"}>{translateDate(date)}</p>}
            </div>
        </div>
    );
}

function TaskOrStage({ stage }) {
    return (
        <div className="list-key-tasks flex flex-col items-start">
            <p className="text-xs text-soft-400 dark:text-soft-200 text-start">{stage}</p>
        </div>
    );
}

TaskOrStage.propTypes = {
    stage: PropTypes.string.isRequired,
};

InfoCard.propTypes = {
    type: PropTypes.oneOf(["project", "task"]).isRequired,
    data: PropTypes.object,
    handelEditAction: PropTypes.func
};

IconWithTitleAndNumber.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    text: PropTypes.string,
    date: PropTypes.string,
};

export default InfoCard;
