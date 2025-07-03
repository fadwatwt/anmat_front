import PropTypes from "prop-types";

const Avatar = ({ user, avatar, avatarImage, avatarColor }) => {
    if (avatarImage) {
      return (
        <img
          src={
            avatar ||
            `https://ui-avatars.com/api/?name=${user}&background=random`
          }
          alt={user}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          avatarColor || "bg-gray-200"
        }`}
      >
        {avatar}
      </div>
    );
  };

export default Avatar

Avatar.propTypes = {
    user: PropTypes.string,
    avatar: PropTypes.string,
    avatarImage: PropTypes.bool,
    avatarColor: PropTypes.string
};