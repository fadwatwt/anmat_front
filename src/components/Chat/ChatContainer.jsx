"use client";
import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const ChatContainer = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showMobileList, setShowMobileList] = useState(true);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowMobileList(false);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-2xl border dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl m-4">
      {/* Sidebar - hidden on mobile when a chat is selected */}
      <div className={`${showMobileList ? "flex" : "hidden"} md:flex w-full md:w-[350px] lg:w-[400px] flex-col h-full`}>
        <ChatList activeChatId={selectedChat?._id} onSelectChat={handleSelectChat} />
      </div>

      {/* Main Chat Area - hidden on mobile when viewing list */}
      <div className={`${!showMobileList ? "flex" : "hidden"} md:flex flex-1 h-full`}>
        <ChatWindow activeChat={selectedChat} onBack={() => setShowMobileList(true)} />
      </div>
    </div>
  );
};

export default ChatContainer;
