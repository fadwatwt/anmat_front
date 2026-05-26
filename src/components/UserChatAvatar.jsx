import PropTypes from "prop-types";
import InitialsAvatar from "@/components/InitialsAvatar";
import { useTranslation } from "react-i18next";

const PLACEHOLDER_PATHS = ["userProfile.dark.png", "userProfile.png"];

function resolveUserImageUrl(user) {
  const url = user?.imageProfile || user?.avatar;
  if (!url) return null;
  if (PLACEHOLDER_PATHS.some((p) => url.includes(p))) return null;
  return url;
}

/** Chat/header avatar: real photo when available, otherwise colored initials like the rest of the app. */
function UserChatAvatar({ user, size = "40px", fontSize = "text-sm", className = "" }) {
  const { t } = useTranslation();
  const imageUrl = resolveUserImageUrl(user);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={user?.name || t("User")}
        className={`rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0 ${className}`}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      />
    );
  }

  return (
    <InitialsAvatar
      name={user?.name || "?"}
      size={size}
      fontSize={fontSize}
      className={className}
    />
  );
}

UserChatAvatar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    imageProfile: PropTypes.string,
    avatar: PropTypes.string,
  }),
  size: PropTypes.string,
  fontSize: PropTypes.string,
  className: PropTypes.string,
};

export default UserChatAvatar;
