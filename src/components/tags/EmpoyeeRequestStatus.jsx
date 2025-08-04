import PropTypes from "prop-types";
import { TbForbidFilled } from "react-icons/tb"; // Rejected
import { IoTime } from "react-icons/io5"; // Pending
import { FaCircleCheck } from "react-icons/fa6"; // Approved & Scheduled
import { useTranslation } from "react-i18next";
import {capitalize} from "@/functions/AnotherFunctions";

function EmployeeRequestStatus({ type }) {
  const { t } = useTranslation();

  const statusStyles = {
    Approved: {
      icon: <FaCircleCheck className="text-emerald-500" />,
      color: "text-emerald-500",
      border: "border",
    },
    Rejected: {
      icon: <TbForbidFilled className="text-red-500" />,
      color: "text-red-500",
      border: "border",
    },
    Pending: {
      icon: <IoTime className="text-orange-500" />,
      color: "text-orange-500",
      border: "border",
    }
  };

  const status = statusStyles[type]

  return (
    <div
      className={`rounded-md text-nowrap text-xs inline-flex py-1 px-2 gap-1 items-center ${status.border}`}
    >
      {status.icon}
      <span className={status.color}>{t(capitalize(type))}</span>
    </div>
  );
}

EmployeeRequestStatus.propTypes = {
  type: PropTypes.oneOf(["Approved", "Rejected", "Pending"]).isRequired
};

export default EmployeeRequestStatus;
