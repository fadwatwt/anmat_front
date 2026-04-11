import PropTypes from "prop-types";
import { FaCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Priority({ type }) {
  const { t } = useTranslation();

  const priorityStyles = {
    Urgent: {
      bg: "bg-[#FEF3EB]",
      text: "text-[#F17B2C]",
    },
    High: {
      bg: "bg-red-100",
      text: "text-red-500",
    },
    Medium: {
      bg: "bg-badge-bg",
      text: "text-badge-text",
    },
    Low: {
      bg: "bg-status-bg",
      text: "text-cell-secondary",
    },
  };

  const priority = priorityStyles[type] || priorityStyles.Low; // Default to "Low"

  return (
    <div
      className={`rounded-md text-xs inline-flex py-1 px-2 gap-1 items-center ${priority.bg}`}
    >
      <FaCircle className={priority.text} />
      <span className={priority.text}>{t(type)}</span>
    </div>
  );
}

Priority.propTypes = {
  type: PropTypes.oneOf(["Urgent", "High", "Medium", "Low"]).isRequired,
};

export default Priority;
