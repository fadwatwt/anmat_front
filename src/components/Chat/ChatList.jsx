"use client";
import React, { useState } from "react";
import { useGetChatsQuery } from "@/redux/conversations/conversationsAPI";
import { formatDistanceToNow } from "date-fns";
import { Search, MoreVertical, MessageSquare } from "lucide-react";

const ChatList = ({ activeChatId, onSelectChat }) => {
  const { data: chats, isLoading } = useGetChatsQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats?.filter((chat) =>
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participants?.some(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r dark:border-gray-800">
      <div className="p-4 border-b dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Messages</h2>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <MoreVertical size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChats?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare size={48} className="text-gray-200 dark:text-gray-700 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No conversations found</p>
          </div>
        ) : (
          filteredChats?.map((chat) => (
            <button
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`w-full flex items-center p-4 gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all border-l-4 ${
                activeChatId === chat._id 
                  ? "bg-primary/5 border-primary" 
                  : "border-transparent"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {chat.image ? (
                    <img src={chat.image} alt={chat.title} className="w-full h-full object-cover" />
                  ) : (
                    (chat.title || "C").charAt(0).toUpperCase()
                  )}
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {chat.title || "Direct Chat"}
                  </h3>
                  {chat.last_message && (
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(chat.last_message.created_at), { addSuffix: false })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {chat.last_message?.content || "No messages yet"}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
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
