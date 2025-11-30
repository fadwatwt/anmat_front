'use client'
function Switch2({ isOn, handleToggle ,className}) {
    return (
        <button
            type={"button"}
            onClick={handleToggle}
            className={` flex items-center dark:shadow-inner dark:drop-shadow shadow-gray-500 dark:border border-gray-700 rounded-full ${className ? className:"h-5 w-10"} p-0.5 transition-colors ${
                isOn
                    ? "bg-primary-500 dark:bg-primary-200"
                    : "bg-[#E2E4E9] dark:bg-gray-800"
            }`}
        >
            <div
                className={`relative bg-white  dark:shadow-inner  dark:shadow-gray-500 dark:bg-gray-800 w-1/3 h-[90%] rounded-full  transform transition-transform flex items-center justify-center ${isOn ? "translate-x-5" : "translate-x-0"}`}
            >
                {/* Small Circle Inside */}
                <div
                    className={`w-1.5 h-1.5 rounded-full dark:shadow-inner drop-shadow shadow-gray-500 `}
                />
            </div>
        </button>
    );
}

export default Switch2;