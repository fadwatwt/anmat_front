import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function Switch({ isOn, handleToggle }) {
  const {i18n } = useTranslation();
  return (
    <button
      onClick={handleToggle}
      className={`w-10 h-5 flex items-center dark:shadow-inner dark:drop-shadow shadow-gray-500 dark:border border-gray-700 rounded-full p-0.5 transition-colors ${
        isOn
          ? "bg-primary-500 dark:bg-primary-200"
          : "bg-[#E2E4E9] dark:bg-gray-800"
      }`}
    >
      <div
        className={`relative bg-white  dark:shadow-inner  dark:shadow-gray-500 dark:bg-gray-800 w-3.5 h-3.5 rounded-full  transform transition-transform flex items-center justify-center ${
          isOn ? `${i18n.language === "ar" ? "translate-0": "translate-x-5"}` : `${i18n.language === "ar" ? "-translate-x-5" : "translate-0"} `
        }`}
      >
        {/* Small Circle Inside */}
        <div
          className={`w-1.5 h-1.5 rounded-full dark:shadow-inner drop-shadow shadow-gray-500 ${
            isOn ? "bg-blue-500 dark:bg-primary-200" : "bg-[#E2E4E9] "
          }`}
        />
      </div>
    </button>
  );
}

export default Switch;

Switch.propTypes = {
  isOn: PropTypes.bool,
  handleToggle: PropTypes.func,
};
