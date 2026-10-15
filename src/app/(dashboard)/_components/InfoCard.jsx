"use client";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import ProjectProgress from "@/app/(dashboard)/projects/[slug]/_components/ProjectProgress.jsx";
import { FaTasks } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { HiOutlineCalendarDateRange, HiOutlineBuildingOffice2 } from "react-icons/hi2";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { translateDate } from "@/functions/Days.js";
import ActionsBtns from "@/components/ActionsBtns.jsx";
import useDropdown from "@/Hooks/useDropdown.js";
import StarRating from "@/components/StarRating.jsx";
import { RiBriefcase4Line, RiTaskLine } from "@remixicon/react";

function InfoCard({ type, data, handelEditAction, rate, onRate }) {
    const { t } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useDropdown();

    const name = data?.name || data?.title || t("Untitled");

    const description = data?.description || t("No description available");

    const status = data?.status || "Active";

    const handleDropdownToggle = () => {
        setDropdownOpen((prev) => !prev);  // Toggle the dropdown state
    };

    return (
        <section className={`relative flex flex-col w-full bg-surface rounded-[24px] border border-status-border shadow-sm ${dropdownOpen ? "z-40" : "z-0"}`}>
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-[24px] bg-gradient-to-r from-primary-base via-blue-400 to-cyan-400" />
            <div className="flex flex-col gap-5 p-4 sm:p-6">
            <div className={"title-header w-full flex justify-between items-start gap-3"}>
                <div className={"min-w-0 flex gap-3 items-start"}>
                    <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-base/10 text-primary-base dark:bg-primary-base/20">
                        {type === "project" ? <RiBriefcase4Line size={23} /> : <RiTaskLine size={23} />}
                    </div>
                    <div className="min-w-0 flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                    <h1 className={"text-xl sm:text-2xl font-bold text-table-title break-words"}>{name}</h1>
                    <Status type={status} title={status} />
                    {rate !== undefined && (
                        <StarRating rating={rate} onClickRate={onRate} />
                    )}
                    </div>
                    <span className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-badge-bg text-cell-primary text-xs font-medium border border-status-border"}>
                        <HiOutlineBuildingOffice2 className={"text-primary-base"} size={14} />
                        {data?.department || t("No Department")}
                    </span>
                    </div>
                </div>
                {handelEditAction && <div className="relative shrink-0 dropdown-container">
                    <button
                        type="button"
                        aria-label={t("Actions")}
                        aria-expanded={Boolean(dropdownOpen)}
                        className="cursor-pointer rounded-xl p-2 text-cell-secondary hover:bg-status-bg transition-colors"
                        onClick={handleDropdownToggle}
                    >
                        <PiDotsThreeVerticalBold size={20} />
                    </button>
                    {dropdownOpen && <ActionsBtns className="!z-[100] !mt-2 top-full end-0" isDeleteBtn={false} handleEdit={handelEditAction} />}
                </div>}
            </div>

            <div className={"description flex flex-col gap-1.5 items-start rounded-2xl bg-status-bg/70 border border-status-border p-4"}>
                <p className={"text-xs font-semibold uppercase tracking-wide text-cell-secondary"}>{t("Description")}</p>
                <p className={"text-sm leading-6 text-cell-primary text-start break-words"}>{description}</p>
            </div>

            {type === "project" && (
                <ProjectProgress lastUpdate={data?.lastUpdate} progress={data?.progress ?? 0} />
            )}

            <div className={"grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3"}>
                <IconWithTitleAndNumber title={"All Tasks"} icon={<FaTasks className={"text-primary-400 dark:text-primary-base"} />} text={String(data?.totalTasks ?? 0)} />
                <IconWithTitleAndNumber title={"Completed Tasks"} icon={<FaCircleCheck className={"text-green-600 dark:text-green-400"} />} text={String(data?.completedTasks ?? 0)} />
                <IconWithTitleAndNumber title={"Assigned Date"} icon={<HiOutlineCalendarDateRange className={"text-cyan-600"} />} date={data?.assignedDate} text={!data?.assignedDate ? t("N/A") : undefined} />
                <IconWithTitleAndNumber title={"Due Date"} icon={<HiOutlineCalendarDateRange />} date={data?.dueDate} text={!data?.dueDate ? t("N/A") : undefined} />
            </div>
            </div>
        </section>
    );
}

function IconWithTitleAndNumber({ title, icon, text, date }) {
    const { t } = useTranslation();
    return (
        <div className={"flex min-w-0 gap-3 items-center rounded-2xl border border-status-border bg-surface p-3"}>
            <div className={"shrink-0 p-2 rounded-xl bg-badge-bg text-primary-base"}>
                {icon && React.cloneElement(icon)}
            </div>
            <div className={"flex flex-col items-start"}>
                <p className={"text-cell-secondary text-xs"}>{t(title)}</p>
                {text && <p className={"text-sm font-semibold text-cell-primary"}>{text}</p>}
                {date && <p className={"text-sm font-semibold text-cell-primary whitespace-nowrap"}>{translateDate(date)}</p>}
            </div>
        </div>
    );
}

InfoCard.propTypes = {
    type: PropTypes.oneOf(["project", "task"]).isRequired,
    data: PropTypes.object,
    handelEditAction: PropTypes.func,
    rate: PropTypes.number,
    onRate: PropTypes.func
};

IconWithTitleAndNumber.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    text: PropTypes.string,
    date: PropTypes.string,
};

export default InfoCard;
