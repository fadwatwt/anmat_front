import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { IoNotificationsOutline } from "react-icons/io5";
import Avatar from "./Avatar";

const NotificationsDropdown = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        className={`icon-notification flex items-center h-10 ${
          showNotifications
            ? "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300"
            : "bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
        } rounded-lg py-1 px-3 text-center cursor-pointer`}
        onClick={toggleNotifications}
      >
        <div className="relative">
          <IoNotificationsOutline size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            5
          </span>
        </div>
      </div>

      {showNotifications && (
        <>
          {/* Overlay for mobile */}
          <div className="fixed inset-0 bg-black/50 sm:hidden z-40"></div>

          {/* Dropdown container */}
          <div
            ref={notificationRef}
            className="fixed sm:absolute inset-0 sm:inset-auto top-1/2 sm:right-0 sm:mt-2 sm:w-[343px] w-full max-w-[343px] mx-auto sm:mx-0 transform -translate-y-1/2 sm:translate-y-0 h-[686px] sm:h-auto sm:max-h-[70vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[20px] shadow-lg z-50"
            style={{ borderWidth: "0.5px" }}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700">
              <h3 className="font-[Almarai] font-[400] text-[16px] leading-[24px] tracking-[-1.1%] dark:text-white">
                Notification (5)
              </h3>
              <button className="text-[#375DFB] font-[Almarai] font-[400] text-[14px] leading-[20px] tracking-[-0.6%] text-center hover:underline">
                Mark all as read
              </button>
            </div>

            <div className="max-h-[calc(100%-120px)] sm:max-h-[calc(70vh-120px)] overflow-y-auto custom-scroll">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex p-4 border-b dark:border-gray-700 last:border-0 sm:px-4 px-5 sm:py-3 py-4"
                >
                  <div className="mr-3">
                    <Avatar
                      user={notification.user || "User"}
                      avatar={notification.avatar}
                      avatarImage={notification.avatarImage}
                      avatarColor={notification.avatarColor}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm dark:text-gray-200">
                      {notification.content}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.time}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    {notification.actionButton && (
                      <button className="mt-2 bg-[#375DFB] w-full sm:w-[118px] h-[32px] text-white text-sm font-[Almarai] rounded-[8px]">
                        {notification.actionButton}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-[56px] px-5 py-4 border-t dark:border-gray-700 flex justify-center items-center">
              <button className="text-[#375DFB] font-[Almarai] font-[400] text-[14px] leading-[20px] tracking-[-0.6%] text-center hover:underline">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

NotificationsDropdown.propTypes = {
  notifications: PropTypes.array.isRequired,
};

export default NotificationsDropdown;
