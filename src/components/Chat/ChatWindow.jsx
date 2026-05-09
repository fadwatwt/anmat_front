"use client";
import React, { useEffect, useState } from "react";
import {
  useGetMessagesQuery,
  useMarkChatAsReadMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useAddReactionMutation,
  useRemoveReactionMutation,
  useLazySearchMessagesQuery
} from "@/redux/conversations/conversationsAPI";
import { useSelector } from "react-redux";
import { useChat } from "@/Hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ThreadSidebar from "./ThreadSidebar";
import CreatePollModal from "./CreatePollModal";
import ChatDetailsModal from "./ChatDetailsModal";
import { Phone, Video, Info, ArrowLeft, Search, X } from "lucide-react";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

const ChatWindow = ({ activeChat, onBack }) => {
  const currentUserId = useSelector((state) => state.auth.user?._id || state.auth.user?.id);
  const { data: messagesData, isLoading } = useGetMessagesQuery(activeChat?._id, {
    skip: !activeChat?._id,
    refetchOnMountOrArgChange: true,
  });

  const [markChatAsRead] = useMarkChatAsReadMutation();
  const [editMessage] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [addReaction] = useAddReactionMutation();
  const [removeReaction] = useRemoveReactionMutation();
  const [triggerSearch, { data: searchData, isFetching: isSearching }] = useLazySearchMessagesQuery();

  const [editMessageData, setEditMessageData] = useState(null);
  const [replyMessageData, setReplyMessageData] = useState(null);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  useEffect(() => {
    if (activeChat?._id) {
      markChatAsRead(activeChat._id);
      setReplyMessageData(null); // Close thread when switching chats
      setEditMessageData(null);
      setShowSearch(false);
      setSearchQuery("");
    }
  }, [activeChat?._id]);

  useEffect(() => {
    if (showSearch && searchQuery.trim() && activeChat?._id) {
      const delayFn = setTimeout(() => {
        triggerSearch({ chatId: activeChat._id, q: searchQuery });
      }, 500);
      return () => clearTimeout(delayFn);
    }
  }, [searchQuery, showSearch, activeChat?._id]);

  const rawMessages = Array.isArray(messagesData) ? messagesData : messagesData?.data || [];
  const messages = [...rawMessages].reverse();

  const searchResults = Array.isArray(searchData?.data?.data)
    ? searchData.data.data
    : (Array.isArray(searchData?.data) ? searchData.data : (Array.isArray(searchData) ? searchData : []));

  const { sendMessage, setTyping } = useChat(activeChat?._id);

  const handleEditMessage = async (messageId, content) => {
    try {
      await editMessage({ messageId, content }).unwrap();
    } catch (err) {
      setApiResponse({ isOpen: true, status: "error", message: "Failed to edit message" });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId).unwrap();
    } catch (err) {
      setApiResponse({ isOpen: true, status: "error", message: "Failed to delete message" });
    }
  };

  const handleReactMessage = async (messageId, emoji) => {
    try {
      await addReaction({ messageId, emoji }).unwrap();
    } catch (err) {
      // Reaction failures are silent — user can simply retry
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-main text-center p-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Info size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-cell-primary mb-2">Select a conversation</h2>
        <p className="text-sub-500 max-w-xs">
          Choose a chat from the list on the left to start messaging your team.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full bg-surface overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 border-b border-status-border flex items-center justify-between shadow-sm z-10 bg-surface">
          {showSearch ? (
            <div className="flex items-center w-full gap-3 animate-in fade-in">
              <Search size={20} className="text-sub-500" />
              <input
                type="text"
                placeholder="Search in conversation..."
                className="flex-1 bg-main border-none outline-none text-sm px-3 py-2 rounded-lg text-cell-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-weak-100 rounded-full text-sub-500"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="md:hidden p-2 hover:bg-status-bg rounded-full transition-colors mr-1"
                >
                  <ArrowLeft size={20} className="text-sub-500" />
                </button>
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden"
                    style={{ backgroundColor: 'var(--color-blue-ebf1ff)', color: 'var(--color-primary)' }}
                  >
                    {activeChat.image ? (
                      <img src={activeChat.image} alt={activeChat.title} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      (activeChat.title || activeChat.participants_ids?.find(p => p._id !== currentUserId)?.name || "C").charAt(0).toUpperCase()
                    )}
                  </div>
                  {activeChat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-cell-primary leading-tight">
                    {activeChat.title || activeChat.participants_ids?.find(p => p._id !== currentUserId)?.name || "Direct Chat"}
                  </h3>
                  <span className="text-[11px] text-green-500 font-medium">
                    {activeChat.isOnline ? "Online" : "Active recently"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2.5 text-sub-500 hover:bg-status-bg rounded-xl transition-all"
                >
                  <Search size={20} />
                </button>
                <button className="p-2.5 text-sub-500 hover:bg-status-bg rounded-xl transition-all">
                  <Phone size={20} />
                </button>
                <button className="p-2.5 text-sub-500 hover:bg-status-bg rounded-xl transition-all">
                  <Video size={20} />
                </button>
                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="p-2.5 text-sub-500 hover:bg-status-bg rounded-xl transition-all"
                >
                  <Info size={20} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Messages or Search Results */}
        {showSearch && searchQuery.trim() ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-main">
            <h4 className="text-sm font-semibold text-sub-500 mb-2">Search Results</h4>
            {isSearching ? (
              <div className="text-center text-sm text-sub-300 py-8">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-sm text-sub-300 py-8">No messages found for "{searchQuery}"</div>
            ) : (
              searchResults.map(msg => (
                <div key={msg._id} className="bg-surface p-3 rounded-xl border border-status-border shadow-sm flex flex-col gap-1 cursor-pointer hover:bg-weak-50">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-cell-primary">{msg.sent_by?.name}</span>
                  </div>
                  <p className="text-sm text-cell-secondary">{msg.content}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onEdit={(msg) => setEditMessageData(msg)}
            onDelete={handleDeleteMessage}
            onReact={handleReactMessage}
            onReply={(msg) => setReplyMessageData(msg)}
          />
        )}

        {/* Input */}
        <MessageInput
          onSendMessage={(content, attachmentUrl) => sendMessage(content, attachmentUrl)}
          onTyping={(isTyping) => setTyping(isTyping)}
          editMessageData={editMessageData}
          onCancelEdit={() => setEditMessageData(null)}
          onEditMessage={handleEditMessage}
          onOpenPoll={() => setShowPollModal(true)}
          activeChatId={activeChat?._id}
        />
      </div>

      {/* Thread Sidebar */}
      {replyMessageData && (
        <div className="flex-shrink-0 z-20 absolute right-0 top-0 bottom-0 shadow-[-5px_0_15px_-3px_rgba(0,0,0,0.1)] md:relative md:shadow-none animate-in slide-in-from-right-8 duration-300">
          <ThreadSidebar
            message={replyMessageData}
            onClose={() => setReplyMessageData(null)}
          />
        </div>
      )}

      {/* Modals */}
      {showPollModal && (
        <CreatePollModal
          chatId={activeChat._id}
          onClose={() => setShowPollModal(false)}
        />
      )}
      {showDetailsModal && (
        <ChatDetailsModal
          activeChat={activeChat}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ isOpen: false, status: "", message: "" })}
      />
    </div>
  );
};

export default ChatWindow;
