"use client";
import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/auth/authSlice";

const MessageList = ({ messages, isLoading }) => {
  const currentUserId = useSelector(selectUserId);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50 dark:bg-gray-950/30"
    >
      {messages?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <p className="text-sm">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages?.map((message, index) => {
          const isMe = message.sent_by?._id === currentUserId || message.sent_by === currentUserId;
          const showAvatar = index === 0 || messages[index - 1]?.sent_by?._id !== message.sent_by?._id;
          
          return (
            <div
              key={message._id || index}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                {!isMe && (
                  <div className={`w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                    {message.sent_by?.name?.charAt(0) || "U"}
                  </div>
                )}
                
                <div className="flex flex-col">
                  {!isMe && showAvatar && (
                    <span className="text-[10px] text-gray-500 mb-1 ml-1">
                      {message.sent_by?.name}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                      isMe
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    {message.content}
                    {message.attachment && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-white/20">
                        <img src={message.attachment} alt="attachment" className="max-w-full h-auto" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] text-gray-400 mt-1 ${isMe ? "text-right mr-1" : "ml-1"}`}>
                    {format(new Date(message.created_at || Date.now()), "HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;
