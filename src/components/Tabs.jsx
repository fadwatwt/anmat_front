import { useState } from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function Tabs({ tabs }) {
    const {t} = useTranslation()
    const [activeTab, setActiveTab] = useState(tabs[0]?.title || ""); // Default to the first tab

    return (
        <div className="max-w-screen-sm xl:max-w-full md:max-w-3xl flex flex-col gap-4">
            {/* Tabs navigation */}
            <div className="tabs-nav flex tab-content overflow-x-auto overflow-hidden  gap-6 max-w-full  border-b border-gray-200 dark:border-gray-700">
                {tabs.map(({ title, icon: Icon }) => (
                    <div
                        key={title}
                        className={`flex py-2 md:gap-2 gap-1 w-auto  items-center cursor-pointer ${
                            activeTab === title ? "border-b-4 border-primary-500 dark:border-primary-200" : ""
                        }`}
                        onClick={() => setActiveTab(title)}
                    >
                        {Icon && <Icon size={20} className={activeTab === title ? "text-primary-500 dark:text-primary-200" : "text-gray-600 dark:dark:text-gray-400"} />}
                        <p className={"dark:text-gray-400 text-sm whitespace-nowrap"}>{t(title)}</p>
                    </div>
                ))}
            </div>

            {/* Active tab content */}
            <div className={`tab-content w-full text-nowrap overflow-hidden md:mt-4 bar overflow-y-auto h-[calc(100vh-15rem)]`}>
                {tabs.map(({ title, content }) => (
                    <div key={title} className={activeTab === title ? "block" : "hidden"}>
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
};

export default Tabs;