import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function Tabs({ tabs, setActiveTitleTab, activeTab: controlledActiveTab, onTabChange }) {
    const { t } = useTranslation();

    // If activeTab is provided from parent, use controlled mode
    const isControlled = controlledActiveTab !== undefined;

    // Internal state for uncontrolled mode
    const [internalActiveTab, setInternalActiveTab] = useState(0);

    // Use controlled or uncontrolled value
    const activeTabIndex = isControlled ? controlledActiveTab : internalActiveTab;
    const activeTabTitle = tabs[activeTabIndex]?.title || "";

    const handleTabClick = (index, title) => {
        if (isControlled && onTabChange) {
            onTabChange(index);
        } else {
            setInternalActiveTab(index);
        }

        // Call setActiveTitleTab if provided (for backwards compatibility)
        if (setActiveTitleTab) {
            setActiveTitleTab(title);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Tabs navigation */}
            <div className="tabs-nav flex tab-content overflow-x-auto gap-6 max-w-full border-b border-status-border">
                {tabs.map(({ title, icon: Icon }, index) => (
                    <div
                        key={title}
                        className={`flex py-2 md:gap-2 gap-1 w-auto  items-center cursor-pointer ${activeTabTitle === title ? "border-b-4 border-primary-500 dark:border-primary-200" : ""
                            }`}
                        onClick={() => handleTabClick(index, title)}
                    >
                        {Icon && <Icon size={20} className={activeTabTitle === title ? "text-primary-base" : "text-cell-secondary"} />}
                        <p className={`text-sm whitespace-nowrap ${activeTabTitle === title ? "text-cell-primary" : "text-cell-secondary"}`}>{t(title)}</p>
                    </div>
                ))}
            </div>

            {/* Active tab content */}
            <div className={`tab-content w-full overflow-x-auto md:mt-4 bar overflow-y-auto h-[calc(100vh-15rem)]`}>
                {tabs.map(({ title, content }) => (
                    <div key={title} className={activeTabTitle === title ? "block" : "hidden"}>
                        {content}
                    </div>
                ))}
            </div>
        </div>
    );
}

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            icon: PropTypes.elementType, // Icon is optional
            content: PropTypes.node.isRequired, // Content must be a valid React node
        })
    ).isRequired,
    setActiveTitleTab: PropTypes.func,
    activeTab: PropTypes.number, // Controlled active tab index
    onTabChange: PropTypes.func, // Callback when tab changes
};

export default Tabs;
