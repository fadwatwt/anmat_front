import React from "react";
import PropTypes from "prop-types";

function Assignees({ users, maxDisplay = 3 }) {
    const displayedUsers = users.slice(0, maxDisplay);
    const remainingCount = users.length - maxDisplay;

    return (
        <div className="flex -space-x-2 overflow-hidden">
            {displayedUsers.map((user, index) => (
                <img
                    key={index}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                    src={user.avatar}
                    alt={user.name}
                    title={user.name}
                />
            ))}
            {remainingCount > 0 && (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white dark:bg-gray-700 dark:ring-gray-800">
                    <span className="text-xs font-medium leading-none text-gray-800 dark:text-gray-100">
                        +{remainingCount}
                    </span>
                </span>
            )}
        </div>
    );
}

Assignees.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
        })
    ).isRequired,
    maxDisplay: PropTypes.number,
};

export default Assignees;
