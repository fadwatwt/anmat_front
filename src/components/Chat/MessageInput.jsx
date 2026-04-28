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
    <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <Paperclip size={20} />
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all dark:text-white"
            value={message}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            <Smile size={18} />
          </button>
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-3 rounded-2xl transition-all ${
            message.trim()
              ? "bg-primary text-white shadow-lg shadow-primary/30 scale-100 hover:scale-105 active:scale-95"
              : "bg-gray-200 dark:bg-gray-800 text-gray-400 scale-100"
          }`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
