"use client";
import React, { useState } from "react";
import { useGetChatsQuery } from "@/redux/conversations/conversationsAPI";
import { formatDistanceToNow } from "date-fns";
import { Search, MoreVertical, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/auth/authSlice";

const ChatList = ({ activeChatId, onSelectChat }) => {
  const userId = useSelector(selectUserId);
  const { data: chatsData, isLoading } = useGetChatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const chats = chatsData?.data || [];

  const filteredChats = chats.filter((chat) => {
    const otherParticipant = chat.participants_ids?.find(p => p._id !== userId);
    const chatTitle = chat.title || otherParticipant?.name || "Direct Chat";

    return chatTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });


  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-sub-300">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        <p className="mt-2 text-sm">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface border-r border-status-border">
      <div className="p-4 border-b border-status-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-cell-primary">Messages</h2>
          <button className="p-2 hover:bg-weak-100 rounded-full transition-colors">
            <MoreVertical size={20} className="text-sub-500" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sub-500" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-main border-none rounded-xl text-sm text-cell-primary focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChats?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare size={48} className="text-sub-300 mb-4 opacity-20" />
            <p className="text-sub-500 text-sm">No conversations found</p>
          </div>
        ) : (
          filteredChats?.map((chat) => (
            <button
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`w-full flex items-center p-4 gap-3 transition-all border-l-4 ${activeChatId === chat._id
                  ? "border-primary"
                  : "border-transparent"
                }`}
              style={{ backgroundColor: activeChatId === chat._id ? 'var(--menu-active-bg)' : 'transparent' }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden border"
                  style={{
                    backgroundColor: 'var(--color-blue-ebf1ff)',
                    color: 'var(--color-primary)',
                    borderColor: 'var(--status-border)'
                  }}
                >
                  {chat.image ? (
                    <img src={chat.image} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (chat.title || chat.participants_ids?.find(p => p._id !== userId)?.name || "C").charAt(0).toUpperCase()
                  )}
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold truncate text-cell-primary">
                    {chat.title || chat.participants_ids?.find(p => p._id !== userId)?.name || "Direct Chat"}
                  </h3>
                  {chat.last_message && (
                    <span className="text-[10px] whitespace-nowrap text-sub-500">
                      {formatDistanceToNow(new Date(chat.last_message.created_at), { addSuffix: false })}
                    </span>
                  )}
                </div>
                <p className="text-sm truncate text-sub-500">
                  {chat.last_message?.content || "No messages yet"}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="bg-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                  {chat.unreadCount}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
