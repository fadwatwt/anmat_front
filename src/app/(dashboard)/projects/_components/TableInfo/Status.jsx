import PropTypes from "prop-types";
import { TbForbidFilled } from "react-icons/tb"; // Inactive
import { IoTime } from "react-icons/io5"; // Delayed
import { FaCircleCheck } from "react-icons/fa6"; // Active & Scheduled
import { useTranslation } from "react-i18next";
import { capitalize } from "@/functions/AnotherFunctions";
import { RiCloseCircleFill, RiCloseCircleLine } from "@remixicon/react";

function Status({ type, title }) {
  const { t } = useTranslation();

  const statusStyles = {
    active: {
      icon: <FaCircleCheck className="text-green-500" />,
      border: "border-green-300 dark:border-green-500",
    },
    unverified: {
      icon: <RiCloseCircleFill size={15} className="text-red-500" />,
      border: "border-status-border",
    },
    "in review": {
      icon: <IoTime className="text-yellow-500" />,
      border: "border-yellow-300 dark:border-yellow-500",
    },
    "in progress": {
      icon: <IoTime className="text-blue-500" />,
      border: "border-blue-300 dark:border-blue-500",
    },
    "in-progress": {
      icon: <IoTime className="text-blue-500" />,
      border: "border-blue-300 dark:border-blue-500",
    },
    "waiting-for-customer": {
      icon: <IoTime className="text-amber-500" />,
      border: "border-amber-300 dark:border-amber-500",
    },
    "on-hold": {
      icon: <IoTime className="text-purple-500" />,
      border: "border-purple-300 dark:border-purple-500",
    },
    inactive: {
      icon: <TbForbidFilled className="text-cell-secondary" />,
      border: "border-status-border",
    },
    delayed: {
      icon: <IoTime className="text-orange-500" />,
      border: "border-orange-300 dark:border-orange-500",
    },
    scheduled: {
      icon: <FaCircleCheck className="text-purple-500" />,
      border: "border-purple-300 dark:border-purple-500",
    },
    open: {
      icon: <IoTime className="text-cell-secondary" />,
      border: "border-status-border",
    },
    completed: {
      icon: <FaCircleCheck className="text-teal-500" />,
      border: "border-teal-300 dark:border-teal-500",
    },
    done: {
      icon: <FaCircleCheck className="text-green-600 dark:text-green-400" />,
      border: "border-green-400 dark:border-green-600",
    },
    accepted: {
      icon: <FaCircleCheck className="text-green-600 dark:text-green-400" />,
      border: "border-green-200 dark:border-green-800",
    },
    rejected: {
      icon: <RiCloseCircleFill size={15} className="text-red-500" />,
      border: "border-red-300 dark:border-red-500",
    },
    cancelled: {
      icon: <RiCloseCircleLine size={15} className="text-cell-secondary" />,
      border: "border-status-border",
    },
    pending: {
      icon: <IoTime className="text-yellow-500" />,
      border: "border-yellow-300 dark:border-yellow-500",
    },
    delivered: {
      icon: <FaCircleCheck className="text-blue-500" />,
      border: "border-blue-300 dark:border-blue-500",
    },
    read: {
      icon: <FaCircleCheck className="text-green-500" />,
      border: "border-green-300 dark:border-green-500",
    },
  };

  const normalizedType = type?.toLowerCase() || "inactive";
  const status = statusStyles[normalizedType] || statusStyles.inactive; // Default to "Inactive"
  const label = (title && title.toLowerCase() !== normalizedType ? title : null) || { "in-progress": "In Progress", "in progress": "In Progress" }[normalizedType] || capitalize(type);

  return (
    <div
      className={`rounded-md text-nowrap text-xs border inline-flex py-1 px-2 gap-1 items-center ${normalizedType === "accepted" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" : "bg-status-bg border-status-border text-cell-primary"}`}
    >
      {status.icon}
      <span>{t(label)}</span>
    </div>
  );
}

Status.propTypes = {
  type: PropTypes.oneOf([
    "accepted",
    "Active",
    "Inactive",
    "Delayed",
    "Scheduled",
    "Open",
    "Pending",
    "In Progress",
    "In-Progress",
    "waiting-for-customer",
    "on-hold",
    "Completed",
    "Done",
    "Rejected",
    "Cancelled",
    "Delivered",
    "Read",
  ]).isRequired,
  title: PropTypes.string,
};

export default Status;
