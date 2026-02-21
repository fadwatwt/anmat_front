import React from "react";
import PropTypes from "prop-types";

function Teams({ teams = [], maxDisplay = 3 }) {
    const safeTeams = Array.isArray(teams) ? teams : [];
    const displayedTeams = safeTeams.slice(0, maxDisplay);

    return (
        <div className="flex gap-1 items-center">
            {displayedTeams.map((team, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    title={team.name}
                >
                    {/* Assuming team has an icon component or we render a default one if string */}
                    {team.icon ? (
                        <team.icon size={18} />
                    ) : (
                        <span className="text-xs font-bold">{team.name.charAt(0)}</span>
                    )}
                </div>
            ))}
        </div>
    );
}

Teams.propTypes = {
    teams: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
        })
    ).isRequired,
    maxDisplay: PropTypes.number,
};

export default Teams;
