import PropTypes from "prop-types";

function MembersListXLine({ members, maxVisible }) {
    const visibleMembers = members.slice(0, maxVisible);
    const hiddenCount = members.length - maxVisible;

    return (
        <div className="flex items-center">
            {visibleMembers.map((member, index) => (
                <div
                    key={index}
                    className="-ml-2 first:ml-0 border-2 border-white rounded-full overflow-hidden"
                >
                    <img
                        src={member.imageProfile}
                        alt={member.name}
                        className="w-8 h-8 object-cover rounded-full"
                    />
                </div>
            ))}
            {hiddenCount > 0 && (
                <div className=" -ml-2 w-8 h-8 flex items-center justify-center text-sm font-medium bg-gray-200 text-gray-600 rounded-full border-2 border-white">
                    +{hiddenCount}
                </div>
            )}
        </div>
    );
};

MembersListXLine.propTypes = {
    members:PropTypes.array.isRequired,
    maxVisible:PropTypes.number
}

export default MembersListXLine;