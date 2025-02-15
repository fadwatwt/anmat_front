function Switch({ isOn, handleToggle }) {
  return (
    <button
      onClick={handleToggle}
      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
        isOn
          ? "bg-primary-500 dark:bg-primary-200"
          : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <div
        className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default Switch;
