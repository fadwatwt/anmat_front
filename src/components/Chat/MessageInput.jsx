"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Image as ImageIcon } from "lucide-react";

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      handleTyping(false);
    }
  };

  const handleTyping = (typing) => {
    if (isTyping !== typing) {
      setIsTyping(typing);
      onTyping(typing);
    }

    if (typing) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 3000);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    handleTyping(true);
  };

  return (
    <div className="p-4 bg-surface border-t border-status-border">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 transition-colors rounded-full text-sub-500 hover:bg-weak-100"
        >
          <Paperclip size={20} />
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-main border-none rounded-2xl text-sm text-cell-primary focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
            value={message}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-sub-500 hover:text-primary-500"
          >
            <Smile size={18} />
          </button>
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-3 rounded-2xl transition-all ${
            message.trim()
              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-100 hover:scale-105 active:scale-95"
              : "bg-main text-sub-500 scale-100"
          }`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
