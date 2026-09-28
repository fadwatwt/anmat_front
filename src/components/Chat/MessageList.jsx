"use client";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { RootRoute } from "@/Root.Route";
import { format } from "date-fns";
import { Check, CheckCheck, Paperclip, Phone } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/auth/authSlice";
import MessageActions from "./MessageActions";
import PollBubble from "./PollBubble";

const MessageList = ({ messages, isLoading, onEdit, onDelete, onReact, onReply }) => {
  const { t } = useTranslation();
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
      className="chat-canvas flex-1 w-full min-w-0 overflow-y-auto overflow-x-hidden p-4 space-y-4 custom-scrollbar"
    >
      {messages?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-sub-300">
          <p className="text-sm">{t("No messages yet. Start the conversation!")}</p>
        </div>
      ) : (
        messages?.map((message, index) => {
          const isMe = message.sent_by?._id === currentUserId || message.sent_by === currentUserId;
          const showAvatar = index === 0 || messages[index - 1]?.sent_by?._id !== message.sent_by?._id;

          if (message.message_type === "call_log") {
            const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
            return (
              <div key={message._id || index} className="flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-weak-50 text-sub-500 text-xs border border-status-border">
                  <Phone size={14} />
                  <span>{message.content}</span>
                  {message.duration > 0 && <span>· {fmt(message.duration)}</span>}
                </div>
              </div>
            );
          }

          return (
            <div
              key={message._id || index}
              className={`flex flex-col min-w-0 ${isMe ? "items-end" : "items-start"}`}
            >
              <div className={`flex items-end gap-2 min-w-0 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                {!isMe && (
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${showAvatar ? "opacity-100" : "opacity-0"}`}
                    style={{ backgroundColor: 'var(--bg-main)' }}
                  >
                    <span className="text-cell-secondary">{message.sent_by?.name?.charAt(0) || t("U")}</span>
                  </div>
                )}

                <div className="flex flex-col min-w-0 max-w-full relative group">
                  {!isMe && showAvatar && (
                    <span className="text-[10px] text-sub-500 mb-1 ml-1">
                      {message.sent_by?.name}
                    </span>
                  )}

                  <MessageActions
                    isMe={isMe}
                    onEdit={() => onEdit && onEdit(message)}
                    onDelete={() => onDelete && onDelete(message._id)}
                    onReply={() => onReply && onReply(message)}
                    onReact={(emoji) => onReact && onReact(message._id, emoji)}
                  />

                  <div className={`chat-bubble min-w-0 max-w-full px-4 py-2 rounded-2xl text-sm ${isMe ? "chat-bubble-sent rounded-tr-none" : "chat-bubble-received rounded-tl-none"}`}>
                    {message.content && !message.poll && (
                      <div className="chat-bubble-text break-words [overflow-wrap:anywhere]">
                        {message.content}
                        {message.is_edited && (
                          <span className="text-[10px] opacity-70 ml-2 italic">{t("(edited)")}</span>
                        )}
                      </div>
                    )}
                    {message.poll && <PollBubble message={message} />}
                    {message.attachment && (
                      <div className="chat-attachment mt-2 max-w-full rounded-lg overflow-hidden border">
                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(message.attachment.split('?')[0]) ? (
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
                            <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-500 dark:text-primary-400 rounded-lg">
                              <Paperclip size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="chat-bubble-text text-sm font-medium truncate">
                                {message.attachment.split('?')[0].split('/').pop()}
                              </p>
                              <p className="text-[10px] text-sub-500">{t("Click to download")}</p>
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
                        ? <CheckCheck size={11} className="text-primary-500 dark:text-primary-400" />
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

const senderShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
]);

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    chat_id: PropTypes.string,
    sent_by: senderShape,
    message_type: PropTypes.string,
    content: PropTypes.string,
    duration: PropTypes.number,
    is_edited: PropTypes.bool,
    poll: PropTypes.object,
    attachment: PropTypes.string,
    reactions: PropTypes.arrayOf(PropTypes.shape({ emoji: PropTypes.string })),
    created_at: PropTypes.string,
    read_by: PropTypes.arrayOf(PropTypes.string),
  })),
  isLoading: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReact: PropTypes.func,
  onReply: PropTypes.func,
};

export default MessageList;
