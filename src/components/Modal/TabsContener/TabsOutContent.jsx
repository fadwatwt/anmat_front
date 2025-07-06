import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function TabMethod({ tabs, onTabChange }) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.title || "");
    const { t } = useTranslation();

    // Call the external callback whenever the active tab changes
    const handleTabChange = (title) => {
        setActiveTab(title);
        if (onTabChange) {
            onTabChange(title); // Trigger the callback
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Tabs navigation */}
            <div className="tabs-nav flex gap-2 bg-weak-100 dark:bg-gray-900 rounded-[10px] p-1">
                {tabs.map(({ title, icon: Icon }) => (
                    <div
                        key={title}
                        className={`flex flex-1 md:gap-2 p-1  rounded-md bg-none justify-center gap-1 items-center cursor-pointer ${
                            activeTab === title ? "bg-white dark:bg-gray-800" : ""
                        }`}
                        onClick={() => handleTabChange(title)}
                    >
                        {Icon && <Icon size={20} className={activeTab === title ? "text-primary-500" : "text-gray-600"} />}
                        <p className={`${
                            activeTab === title ? "text-gray-800 dark:text-gray-200 text-sm" : "dark:text-gray-200 text-sm"
                        }`} >{t(title)}</p>
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
            content: PropTypes.node.isRequired, // Content must be a valid React node
        })
    ).isRequired,
    onTabChange: PropTypes.func, // Optional callback to be called when the tab changes
};

export default TabMethod;
