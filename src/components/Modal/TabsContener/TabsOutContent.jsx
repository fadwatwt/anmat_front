import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function TabMethod({ tabs, activeTab, onTabChange }) {
    const { t } = useTranslation();

    const handleTabChange = (title) => {
        if (onTabChange) {
            onTabChange(title);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Tabs navigation */}
            <div className="tabs-nav flex w-full gap-1.5 bg-weak-100 dark:bg-gray-900 rounded-[10px] p-1">
                {tabs.map(({ title, icon: Icon, count }) => (
                    <div
                        key={title}
                        className={`flex flex-1 min-w-0 gap-1.5 px-2 py-2 rounded-md justify-center items-center cursor-pointer transition-all ${activeTab === title ? "bg-primary-500 shadow-sm" : "bg-transparent hover:bg-weak-200 dark:hover:bg-gray-800"
                            }`}
                        onClick={() => handleTabChange(title)}
                    >
                        {Icon && <Icon size={18} className={activeTab === title ? "text-white" : "text-gray-500 dark:text-gray-400"} />}
                        <p className={`text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${activeTab === title ? "text-white" : "text-cell-secondary"
                            }`} >{t(title)}</p>
                        {typeof count === "number" && (
                            <span className={`min-w-5 h-5 px-1.5 shrink-0 rounded-full text-[10px] font-bold flex items-center justify-center ${activeTab === title
                                ? "bg-white/20 text-white"
                                : "bg-status-bg text-cell-secondary"
                                }`}>
                                {count}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

TabMethod.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            icon: PropTypes.elementType, // Icon is optional
            content: PropTypes.node,
            count: PropTypes.number,
        })
    ).isRequired,
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func, // Optional callback to be called when the tab changes
};

export default TabMethod;
