"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveChat } from "@/redux/conversations/conversationsSlice";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const reduxActiveChat = useSelector((state) => state.conversations.activeChat);
  const [selectedChat, setSelectedChat] = useState(reduxActiveChat);
  const [showMobileList, setShowMobileList] = useState(!reduxActiveChat);

  useEffect(() => {
    if (reduxActiveChat) {
      setSelectedChat(reduxActiveChat);
      setShowMobileList(false);
    }
  }, [reduxActiveChat]);

  const handleSelectChat = (chat) => {
    dispatch(setActiveChat(chat));
    setSelectedChat(chat);
    setShowMobileList(false);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-2xl border bg-surface shadow-xl m-4" style={{ borderColor: 'var(--status-border)' }}>

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
