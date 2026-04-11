'use client'
function Switch2({ isOn, handleToggle, className }) {
    return (
        <button
            type={"button"}
            onClick={handleToggle}
            className={` flex items-center border border-status-border rounded-full ${className ? className : "h-5 w-10"} p-0.5 transition-colors ${isOn
                    ? "bg-primary-500"
                    : "bg-status-bg"
                }`}
        >
            <div
                className={`relative bg-surface w-1/3 h-[90%] rounded-full shadow-sm transform transition-transform flex items-center justify-center ${isOn ? "translate-x-5" : "translate-x-0"}`}
            >
                {/* Small Circle Inside */}
                <div
                    className={`w-1.5 h-1.5 rounded-full ${isOn ? "bg-primary-200" : "bg-status-border"} `}
                />
            </div>
        </button>
    );
}

export default Switch2;