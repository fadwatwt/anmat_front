import React from "react";
import PropTypes from "prop-types";

function Department({ name, icon: Icon }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                {Icon && <Icon size={18} />}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                {name}
            </span>
        </div>
    );
}

Department.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
};

export default Department;
