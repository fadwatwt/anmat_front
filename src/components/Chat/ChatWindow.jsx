"use client";
import React, { useState } from "react";
import { useGetMessagesQuery } from "@/redux/conversations/conversationsAPI";
import { useChat } from "@/Hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Phone, Video, Info, ArrowLeft } from "lucide-react";

const ChatWindow = ({ activeChat, onBack }) => {
  const { data: messagesData, isLoading } = useGetMessagesQuery(activeChat?._id, {
    skip: !activeChat?._id,
  });

  const messages = Array.isArray(messagesData) ? messagesData : messagesData?.data || [];

  const { sendMessage, setTyping } = useChat(activeChat?._id);

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950/30 text-center p-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Info size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select a conversation</h2>
        <p className="text-gray-500 max-w-xs">
          Choose a chat from the list on the left to start messaging your team.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mr-1"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm">
              {activeChat.image ? (
                <img src={activeChat.image} alt={activeChat.title} className="w-full h-full object-cover rounded-full" />
              ) : (
                (activeChat.title || "C").charAt(0).toUpperCase()
              )}
            </div>
            {activeChat.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 leading-tight">
              {activeChat.title || "Direct Chat"}
            </h3>
            <span className="text-[11px] text-green-500 font-medium">
              {activeChat.isOnline ? "Online" : "Active recently"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <Phone size={20} />
          </button>
          <button className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <Video size={20} />
          </button>
          <button className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <MessageInput
        onSendMessage={(content) => sendMessage(content)}
        onTyping={(isTyping) => setTyping(isTyping)}
      />
    </div>
  );
};

export default ChatWindow;
