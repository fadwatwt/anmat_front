import PropTypes from "prop-types";

function Switch({ isOn, handleToggle }) {
  return (
    <button
      onClick={handleToggle}
      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
        isOn
          ? "bg-primary-500 dark:bg-primary-200"
          : "bg-[#E2E4E9] dark:bg-[#E2E4E9]"
      }`}
    >
      <div
        className={`relative bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform flex items-center justify-center ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      >
        {/* Small Circle Inside */}
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isOn ? "bg-blue-500" : "bg-[#E2E4E9]"
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
