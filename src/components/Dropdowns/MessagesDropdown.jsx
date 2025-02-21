import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { AiOutlineMessage } from "react-icons/ai";
import Avatar from "./Avatar";

const MessagesDropdown = ({ messages }) => {
  const [showMessages, setShowMessages] = useState(false);
  const messageRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showMessages &&
        messageRef.current &&
        !messageRef.current.contains(event.target)
      ) {
        setShowMessages(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMessages]);

  const toggleMessages = () => {
    setShowMessages((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        className={`icon-message flex items-center h-10 ${
          showMessages
            ? "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300"
            : "bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
        } rounded-lg py-1 px-3 text-center cursor-pointer`}
        onClick={toggleMessages}
      >
        <div className="relative">
          <AiOutlineMessage size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            5
          </span>
        </div>
      </div>

      {showMessages && (
        <>
          <div className="fixed inset-0 bg-black/50 sm:hidden z-40"></div>
          <div
            ref={messageRef}
            className="fixed sm:absolute inset-0 sm:inset-auto top-1/2 sm:right-0 sm:mt-2 sm:w-[343px] w-full max-w-[343px] mx-auto sm:mx-0 transform -translate-y-1/2 sm:translate-y-0 h-[686px] sm:h-auto sm:max-h-[686px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[20px] shadow-lg z-50"
            style={{ borderWidth: "0.5px" }}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700">
              <h3 className="font-[Almarai] font-[400] text-[16px] leading-[24px] tracking-[-1.1%] dark:text-white">
                Messages (5)
              </h3>
              <button className="text-[#375DFB] font-[Almarai] font-[400] text-[14px] leading-[20px] tracking-[-0.6%] text-center hover:underline">
                Mark all as read
              </button>
            </div>

            <div className="max-h-[calc(100%-120px)] sm:max-h-[686px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex p-4 border-b dark:border-gray-700 last:border-0 sm:px-4 px-5 sm:py-3 py-4"
                >
                  <div className="mr-3">
                    <Avatar
                      user={message.user || "User"}
                      avatar={message.avatar}
                      avatarImage={message.avatarImage}
                      avatarColor={message.avatarColor}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm dark:text-gray-200">
                      {message.content}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {message.time}
                      </span>
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-[56px] px-5 py-4 border-t dark:border-gray-700 flex justify-center items-center">
              <button className="text-[#375DFB] font-[Almarai] font-[400] text-[14px] leading-[20px] tracking-[-0.6%] text-center hover:underline">
                View all messages
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

MessagesDropdown.propTypes = {
  messages: PropTypes.array.isRequired,
};

export default MessagesDropdown;
