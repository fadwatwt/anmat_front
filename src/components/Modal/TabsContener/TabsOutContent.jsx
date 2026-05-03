import { useState } from "react";
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
            <div className="tabs-nav flex gap-2 bg-weak-100 dark:bg-gray-900 rounded-[10px] p-1">
                {tabs.map(({ title, icon: Icon }) => (
                    <div
                        key={title}
                        className={`flex flex-1 md:gap-2 p-1.5 rounded-md justify-center gap-1 items-center cursor-pointer transition-all ${activeTab === title ? "bg-primary-500 shadow-sm" : "bg-transparent hover:bg-weak-200 dark:hover:bg-gray-800"
                            }`}
                        onClick={() => handleTabChange(title)}
                    >
                        {Icon && <Icon size={18} className={activeTab === title ? "text-white" : "text-gray-500"} />}
                        <p className={`text-sm font-medium transition-colors ${activeTab === title ? "text-white" : "text-cell-secondary"
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
