"use client";
import React, { useEffect, useRef } from "react";
import { RootRoute } from "@/Root.Route";
import { format } from "date-fns";
import { Check, CheckCheck, Paperclip } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/auth/authSlice";
import MessageActions from "./MessageActions";
import PollBubble from "./PollBubble";

const MessageList = ({ messages, isLoading, onEdit, onDelete, onReact, onReply }) => {
  const currentUserId = useSelector(selectUserId);
  const scrollRef = useRef(null);

  const getAttachmentUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) {
      const uploadsIndex = url.indexOf("/uploads/");
      if (uploadsIndex !== -1) {
        return `${RootRoute}${url.substring(uploadsIndex)}`;
      }
    }
    return url;
  };

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

                <div className="flex flex-col relative group">
                  {!isMe && showAvatar && (
                    <span className="text-[10px] text-sub-500 mb-1 ml-1">
                      {message.sent_by?.name}
                    </span>
                  )}

                  <MessageActions
                    message={message}
                    isMe={isMe}
                    onEdit={() => onEdit && onEdit(message)}
                    onDelete={() => onDelete && onDelete(message._id)}
                    onReply={() => onReply && onReply(message)}
                    onReact={(emoji) => onReact && onReact(message._id, emoji)}
                  />

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm border ${isMe
                        ? "bg-primary-500 text-white rounded-tr-none border-transparent"
                        : "rounded-tl-none text-cell-primary"
                      }`}
                    style={{
                      borderColor: isMe ? 'transparent' : 'var(--status-border)',
                      backgroundColor: isMe ? undefined : 'var(--color-blue-ebf1ff)',
                      color: isMe ? '#ffffff !important' : 'inherit'
                    }}
                  >
                    {message.content && (
                      <div style={{ color: isMe ? '#ffffff' : 'inherit' }}>
                        {message.content}
                        {message.is_edited && (
                          <span className="text-[10px] opacity-70 ml-2 italic">(edited)</span>
                        )}
                      </div>
                    )}
                    {message.poll && <PollBubble message={message} isMe={isMe} />}
                    {message.attachment && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-status-border bg-weak-50">
                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(message.attachment) ? (
                          <img 
                            src={getAttachmentUrl(message.attachment)} 
                            alt="attachment" 
                            className="max-w-full h-auto max-h-[300px] object-contain cursor-pointer hover:opacity-90 transition-opacity" 
                            onClick={() => window.open(getAttachmentUrl(message.attachment), '_blank')}
                          />
                        ) : (
                          <a 
                            href={getAttachmentUrl(message.attachment)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 hover:bg-weak-100 transition-colors no-underline"
                          >
                            <div className="p-2 bg-primary-50 text-primary-500 rounded-lg">
                              <Paperclip size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isMe ? 'text-white' : 'text-cell-primary'}`}>
                                {message.attachment.split('/').pop()}
                              </p>
                              <p className="text-[10px] text-sub-500">Click to download</p>
                            </div>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                      {Object.entries(
                        message.reactions.reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([emoji, count]) => (
                        <div key={emoji} className="bg-surface border border-status-border rounded-full px-2 py-0.5 text-xs flex items-center gap-1 shadow-sm">
                          <span>{emoji}</span>
                          <span className="text-sub-500 text-[10px]">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`text-[9px] text-sub-300 mt-1 flex items-center gap-0.5 ${isMe ? "justify-end mr-1" : "ml-1"}`}>
                    {format(new Date(message.created_at || Date.now()), "HH:mm")}
                    {isMe && (
                      message.read_by?.some((id) => id !== currentUserId)
                        ? <CheckCheck size={11} className="text-primary-500" />
                        : <Check size={11} className="text-sub-300" />
                    )}
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
