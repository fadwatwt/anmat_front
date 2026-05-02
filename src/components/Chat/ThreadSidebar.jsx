"use client";
import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { X, Send, Paperclip, Smile } from "lucide-react";
import { useGetThreadRepliesQuery, useCreateThreadReplyMutation } from "@/redux/conversations/conversationsAPI";
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/auth/authSlice";

const ThreadSidebar = ({ message, onClose }) => {
  const currentUserId = useSelector(selectUserId);
  const [replyText, setReplyText] = useState("");
  const scrollRef = useRef(null);

  const messageId = message?._id || message?.id;

  const { data: repliesData, isLoading, error } = useGetThreadRepliesQuery(messageId, {
    skip: !messageId,
  });
  const [createReply] = useCreateThreadReplyMutation();

  // Logging for debugging (you can check browser console)
  console.log("Thread Message ID:", messageId);
  console.log("Replies Data Response:", repliesData);

  const replies = Array.isArray(repliesData?.data?.data) 
    ? repliesData.data.data 
    : (Array.isArray(repliesData?.data) ? repliesData.data : (Array.isArray(repliesData) ? repliesData : []));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [replies]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await createReply({ messageId: messageId, content: replyText }).unwrap();
      setReplyText("");
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  return (
    <div className="w-80 border-l border-status-border flex flex-col bg-surface shadow-xl h-full">
      {/* Header */}
      <div className="p-4 border-b border-status-border flex items-center justify-between bg-main">
        <h3 className="font-bold text-cell-primary">Thread</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-weak-100 rounded-full text-sub-500">
          <X size={18} />
        </button>
      </div>

      {/* Original Message */}
      <div className="p-4 border-b border-status-border bg-surface">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-primary">
            {message.sent_by?.name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-cell-primary">
              {message.sent_by?.name}
            </span>
            <span className="text-[10px] text-sub-500 mb-1">
              {format(new Date(message.created_at || Date.now()), "HH:mm")}
            </span>
            <p className="text-sm text-cell-primary mt-1 bg-weak-50 p-2 rounded-lg">
              {message.content}
            </p>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-main" ref={scrollRef}>
        <div className="flex items-center gap-2">
          <div className="h-px bg-status-border flex-1"></div>
          <span className="text-xs text-sub-500 font-medium">{replies.length} Replies</span>
          <div className="h-px bg-status-border flex-1"></div>
        </div>
        
        {isLoading ? (
          <div className="text-center text-sm text-sub-300 py-4">Loading replies...</div>
        ) : (
          replies.map((reply) => {
            const isMe = reply.sent_by?._id === currentUserId || reply.sent_by === currentUserId;
            return (
              <div key={reply._id} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-blue-500">
                  {reply.sent_by?.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-cell-primary">
                      {isMe ? "You" : reply.sent_by?.name}
                    </span>
                    <span className="text-[9px] text-sub-500">
                      {format(new Date(reply.created_at || Date.now()), "HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-cell-secondary mt-0.5">
                    {reply.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-status-border bg-surface">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Reply..."
              className="w-full px-3 py-2 bg-main border border-status-border rounded-xl text-sm text-cell-primary focus:ring-1 focus:ring-primary-500 outline-none"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={!replyText.trim()}
            className={`p-2 rounded-xl transition-colors ${
              replyText.trim() ? "bg-primary-500 text-white" : "bg-weak-100 text-sub-500"
            }`}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThreadSidebar;
