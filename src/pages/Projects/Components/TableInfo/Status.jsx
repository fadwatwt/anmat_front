import PropTypes from "prop-types";
import { TbForbidFilled } from "react-icons/tb";
import { FaCircleCheck } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { useTranslation } from "react-i18next";

function Status({ title, type }) {
  const { t } = useTranslation();
  switch (title) {
    case "Not Started":
      return (
        <div className=" rounded-md text-nowrap text-xs bg-none border border-soft-200 dark:border-soft-500 inline-flex py-1 px-2  gap-1 items-center">
          <TbForbidFilled size={15} className={"text-gray-500"} />
          <span className="text-sub-500 dark:text-sub-300">{t(title)}</span>
        </div>
      );
    case "In Progress":
      return (
        <div className=" rounded-md text-nowrap text-xs bg-none border border-soft-200 dark:border-soft-500 inline-flex py-1 px-2  gap-1 items-center">
          <IoTime size={15} className={"text-red-500"} />
          <span className="text-sub-500 dark:text-sub-300">{t(title)}</span>
        </div>
      );
    case "Completed":
      return (
        <div className=" rounded-md text-nowrap text-xs bg-none border border-soft-200 dark:border-soft-500 inline-flex py-1 px-2  gap-1 items-center">
          <IoTime size={15} className={"text-orange-500"} />
          <span className="text-sub-500 dark:text-sub-300">{t(title)}</span>
        </div>
      );
  }
}

Status.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default Status;
