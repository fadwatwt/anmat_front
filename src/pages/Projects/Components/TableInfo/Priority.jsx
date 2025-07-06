import PropTypes from "prop-types";
import { FaCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Priority({ type, title }) {
  const { t } = useTranslation();
  switch (type || title) {
    case "Urgent and Important":
      return (
        <div className=" rounded-md text-nowrap text-xs bg-red-100 inline-flex py-1 px-2  gap-1 items-center">
          <FaCircle className="text-red-500" />
          <span className="text-red-500">{t(title)} </span>
        </div>
      );
    case "Urgent":
      return (
        <div className=" rounded-md text-xs inline-flex py-1 px-2 bg-[#FEF3EB]  gap-1 items-center">
          <FaCircle className="text-[#F17B2C]" />
          <span className="text-[#F17B2C]">{t(title)}</span>
        </div>
      );
    case "Not Urgent":
      return (
        <div className=" rounded-md text-xs bg-[#EBF1FF] inline-flex py-1 px-2   gap-1 items-center">
          <FaCircle className="text-[#375DFB]" />
          <span className="text-[#375DFB]">{t(title)}</span>
        </div>
      );
    case "Not Important":
      return (
        <div className=" rounded-md  text-xs dark:bg-[#161922] bg-gray-200 inline-flex py-1 px-2  gap-1 items-center">
          <FaCircle className="dark:text-[#CDD0D5] text-sub-500" />
          <span className="dark:text-[#CDD0D5] text-sub-500">{t(title)}</span>
        </div>
      );
  }
}

Priority.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default Priority;
