import React, {useState} from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function TabModal({tabs,classNameItem,classNameContent}) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.title || "");
    const {t} = useTranslation()
    return (
        <div className="w-full flex flex-col md:gap-4">
            {/* Tabs navigation */}
            <div className="tabs-nav flex gap-2 px-2">
                {tabs.map(({ title, icon: Icon }) => (
                    <div
                        key={title}
                        className={`flex py-2 w-6/12 text-sm  gap-2 items-center ${classNameItem ? classNameItem :"justify-center"} cursor-pointer ${
                            activeTab === title ? "border-b-2  border-primary-500 dark:border-primary-200" : ""
                        }`}
                        onClick={() => setActiveTab(title)}
                    >
                        {Icon && React.cloneElement(Icon, {
                            size: 15,
                            className: activeTab === title ? "text-primary-500 dark:text-primary-200" : "text-gray-600"
                        })}
                        <p className={"dark:text-gray-400"}>{t(title)}</p>
                    </div>
                ))}
            </div>

            {/* Active tab content */}
            <div className={"tab-content w-full text-nowrap overflow-hidden mt-4 bar overflow-y-auto " + classNameContent}>
                {tabs.map(({ title, content }) => (
                    <div key={title} className={activeTab === title ? "block" : "hidden"}>
                        {content}
                    </div>
                ))}
            </div>
        </div>
    );
}

TabModal.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            icon: PropTypes.elementType, // Icon is optional
            content: PropTypes.node.isRequired, // Content must be a valid React node
        })
    ).isRequired,
    classNameItem: PropTypes.string,
    classNameContent: PropTypes.string
};

export default TabModal;