import PropTypes from "prop-types";
import { FaCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {capitalize} from "@/functions/AnotherFunctions";

function Priority({ type }) {
  const { t } = useTranslation();

  const priorityStyles = {
    urgent: {
      bg: "bg-[#FEF3EB]",
      text: "text-[#F17B2C]",
    },
    high: {
      bg: "bg-red-100",
      text: "text-red-500",
    },
    medium: {
      bg: "bg-[#EBF1FF]",
      text: "text-[#375DFB]",
    },
    low: {
      bg: "bg-gray-200 dark:bg-[#161922]",
      text: "text-sub-500 dark:text-[#CDD0D5]",
    },
  };

  const priority = priorityStyles[type] || priorityStyles.Low; // Default to "Low"

  return (
    <div
      className={`rounded-md text-xs inline-flex py-1 px-2 gap-1 items-center ${priority.bg || "bg-gray-200 dark:bg-[#161922]"}`}
    >
      <FaCircle className={priority.text} />
      <span className={priority.text}>{t(capitalize(type))}</span>
    </div>
  );
}

Priority.propTypes = {
  type: PropTypes.oneOf(["Urgent", "High", "Medium", "Low"]).isRequired,
};

export default Priority;
