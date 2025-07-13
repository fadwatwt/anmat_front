import PropTypes from "prop-types";
import { TbForbidFilled } from "react-icons/tb"; // Inactive
import { IoTime } from "react-icons/io5"; // Delayed
import { FaCircleCheck } from "react-icons/fa6"; // Active & Scheduled
import { useTranslation } from "react-i18next";
import {capitalize} from "@/functions/AnotherFunctions";

function Status({ type }) {
  const { t } = useTranslation();

  const statusStyles = {
    active: {
      icon: <FaCircleCheck className="text-green-500" />,
      border: "border-green-300 dark:border-green-500",
    },
    Inactive: {
      icon: <TbForbidFilled className="text-gray-500" />,
      border: "border-gray-300 dark:border-gray-500",
    },
    delayed: {
      icon: <IoTime className="text-red-500" />,
      border: "border-red-300 dark:border-red-500",
    },
    scheduled: {
      icon: <FaCircleCheck className="text-blue-500" />,
      border: "border-blue-300 dark:border-blue-500",
    },
  };

  const status = statusStyles[type] || statusStyles.Inactive; // Default to "Inactive"

  return (
    <div
      className={`rounded-md text-nowrap text-xs border inline-flex py-1 px-2 gap-1 items-center ${status.border}`}
    >
      {status.icon}
      <span className="text-sub-500 dark:text-sub-300">{t(capitalize(type))}</span>
    </div>
  );
}

Status.propTypes = {
  type: PropTypes.oneOf(["Active", "Inactive", "Delayed", "Scheduled"])
    .isRequired,
};

export default Status;
