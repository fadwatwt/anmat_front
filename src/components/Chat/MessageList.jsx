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
      className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      {messages?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-sub-300">
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
                  <div 
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${showAvatar ? "opacity-100" : "opacity-0"}`}
                    style={{ backgroundColor: 'var(--bg-main)' }}
                  >
                    <span className="text-cell-secondary">{message.sent_by?.name?.charAt(0) || "U"}</span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  {!isMe && showAvatar && (
                    <span className="text-[10px] text-sub-500 mb-1 ml-1">
                      {message.sent_by?.name}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm border ${
                      isMe
                        ? "bg-primary-500 text-white rounded-tr-none border-transparent"
                        : "rounded-tl-none text-cell-primary"
                    }`}
                    style={{ 
                      borderColor: isMe ? 'transparent' : 'var(--status-border)',
                      backgroundColor: isMe ? undefined : 'var(--color-blue-ebf1ff)' 
                    }}
                  >
                    {message.content}
                    {message.attachment && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-white/20">
                        <img src={message.attachment} alt="attachment" className="max-w-full h-auto" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] text-sub-300 mt-1 ${isMe ? "text-right mr-1" : "ml-1"}`}>
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
