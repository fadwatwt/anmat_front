"use client";

import { useState, useRef, useEffect } from "react";
import { RiChat3Line } from "@remixicon/react";
import { CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useGetUnreadChatsQuery, useMarkChatAsReadMutation } from "@/redux/conversations/conversationsAPI";
import { setActiveChat } from "@/redux/conversations/conversationsSlice";
import { selectUserId } from "@/redux/auth/authSlice";

const MessagesDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messageRef = useRef(null);
  const timeoutRef = useRef(null);
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const [loadingChatId, setLoadingChatId] = useState(null);

  const { data, refetch } = useGetUnreadChatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [markChatAsRead] = useMarkChatAsReadMutation();

  const totalUnread = data?.data?.total_unread || 0;
  const unreadChats = data?.data?.chats || [];

  useEffect(() => {
    if (isMenuOpen) refetch();
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && messageRef.current && !messageRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isMenuOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsMenuOpen(false), 200);
  };

  const handleOpenChat = (chat) => {
    dispatch(setActiveChat(chat));
    router.push("/conversations");
    setIsMenuOpen(false);
  };

  const handleMarkAsRead = async (e, chatId) => {
    e.stopPropagation();
    if (loadingChatId) return;
    setLoadingChatId(chatId);
    try {
      await markChatAsRead(chatId).unwrap();
    } finally {
      setLoadingChatId(null);
    }
  };

  const handleViewAll = () => {
    router.push("/conversations");
    setIsMenuOpen(false);
  };

  return (
    <div className="w-10 relative" ref={messageRef}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`icon-message flex items-center h-10 ${
          isMenuOpen
            ? "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300"
            : "bg-status-bg"
        } rounded-lg py-1 px-3 text-center cursor-pointer`}
      >
        <div className="relative">
          <RiChat3Line className="text-sub-500" size={20} />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed sm:absolute top-[72px] sm:top-full left-0 right-0 sm:left-auto sm:right-0 sm:mt-2 w-full sm:w-[380px] max-w-[300px] mx-auto sm:mx-0 h-auto max-h-[calc(100vh-80px)] sm:max-h-[75vh] bg-surface border border-status-border rounded-b-[20px] sm:rounded-[20px] shadow-xl z-[100] flex flex-col overflow-hidden"
          style={{ borderWidth: "0.5px" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-status-border">
            <h3 className="font-semibold text-[16px] text-cell-primary">
              {t("Messages")} {totalUnread > 0 && `(${totalUnread})`}
            </h3>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scroll">
            {unreadChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-sub-500 text-sm">
                <RiChat3Line size={32} className="mb-2 opacity-30" />
                {t("No unread messages")}
              </div>
            ) : (
              unreadChats.map((chat) => {
                const otherParticipant = chat.participants_ids?.find(
                  (p) => p._id !== userId
                );
                const name = chat.title || otherParticipant?.name || "Direct Chat";
                const msg = chat.last_unread_message;

                return (
                  <div
                    key={chat._id}
                    className="flex items-start gap-3 px-4 py-3 border-b border-status-border last:border-0 hover:bg-status-bg transition-colors"
                  >
                    {/* Avatar */}
                    <button
                      onClick={() => handleOpenChat(chat)}
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white bg-gradient-to-tr from-primary-500 to-blue-400 mt-0.5"
                    >
                      {otherParticipant?.image ? (
                        <img
                          src={otherParticipant.image}
                          alt={name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </button>

                    {/* Content + actions */}
                    <div className="flex-1 min-w-0">
                      {/* Top row: name + time + badge */}
                      <button
                        onClick={() => handleOpenChat(chat)}
                        className="w-full text-left"
                      >
                        <div className="flex items-baseline justify-between gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-cell-primary truncate">
                            {name}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {chat.unread_count > 0 && (
                              <span className="bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {chat.unread_count}
                              </span>
                            )}
                            {msg?.created_at && (
                              <span className="text-[10px] text-sub-500 whitespace-nowrap">
                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: false })}
                              </span>
                            )}
                          </div>
                        </div>
                        {msg?.content && (
                          <p className="text-xs text-sub-500 truncate">{msg.content}</p>
                        )}
                      </button>

                      {/* Mark as read button */}
                      <button
                        onClick={(e) => handleMarkAsRead(e, chat._id)}
                        disabled={loadingChatId === chat._id}
                        className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-primary-500 hover:text-primary-600 disabled:opacity-50 transition-colors"
                      >
                        {loadingChatId === chat._id ? (
                          <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCheck size={13} />
                        )}
                        {t("Mark as read")}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-status-border flex justify-center">
            <button
              onClick={handleViewAll}
              className="text-primary-500 font-medium text-[14px] hover:underline"
            >
              {t("View all messages")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesDropdown;
