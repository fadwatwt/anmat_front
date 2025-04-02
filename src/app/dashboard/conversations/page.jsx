"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Paperclip,
  Smile,
  Mic,
  Send,
  Edit3Icon,
} from "lucide-react";
import { Check } from "lucide-react";
import Page from "@/components/Page.jsx";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import SchedulingMeeting from "@/app/dashboard/conversations/_modal/SchedulingMeeting.jsx";
import { IoAdd } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateChatMutation,
} from "@/redux/conversations/conversationsAPI";
import {
  setActiveChat,
  addTempMessage,
  clearTempMessages,
  updateChatLastMessage,
  updateUserStatus,
} from "@/redux/conversations/conversationsSlice";
import {
  initSocket,
  disconnectSocket,
  getSocket,
} from "@/services/socketService";

const ConversationPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const { activeChat } = useSelector((state) => state.conversations);
  const tempMessages = useSelector(
    (state) => state.conversations.tempMessages[activeChat?._id] || []
  );
  const messagesEndRef = useRef(null);

  // RTK Query hooks
  const {
    data: chats = [],
    isLoading: chatsLoading,
    refetch: refetchChats,
  } = useGetChatsQuery();
  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useGetMessagesQuery(activeChat?._id, { skip: !activeChat });

  const [sendMessage] = useSendMessageMutation();
  const [createChat] = useCreateChatMutation();

  // State for UI
  const [activeTab, setActiveTab] = useState("Meetings");
  const [activeRightTab, setActiveRightTab] = useState("Attachments");
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [isOpenSchedulingMeeting, setIsOpenSchedulingMeeting] = useState(false);
  const [socket, setSocket] = useState(null);

  // Get current user ID from localStorage or auth state
  const currentUserId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  // Merged messages (API + temp)
  const messages = messagesData?.messages || [];
  const allMessages = [...messages, ...tempMessages];

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const socketInstance = initSocket(token);
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        console.log("Connected to socket server");
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      socketInstance.on("error", (error) => {
        console.error("Socket error:", error);
      });

      // Listen for new messages
      socketInstance.on("newMessage", (data) => {
        console.log("New message received:", data);

        // If the message is for the active chat, add it to the UI immediately
        if (activeChat && data.chatId === activeChat._id) {
          // Only add the message if it's not from the current user
          if (data.message.sender._id !== currentUserId) {
            const formattedMessage = {
              _id: data.message._id,
              content: data.message.content,
              sender: {
                _id: data.message.sender._id,
                id: data.message.sender._id,
                name: data.message.sender.name,
                avatar: data.message.sender.avatar,
              },
              timestamp: data.message.timestamp,
              status: "delivered",
            };

            dispatch(
              addTempMessage({
                chatId: data.chatId,
                message: formattedMessage,
              })
            );

            // Mark message as read since we're in the chat
            if (socketInstance) {
              socketInstance.emit("markRead", {
                chatId: data.chatId,
                messageId: data.message._id,
              });
            }
          }

          // Refetch messages to ensure we have the latest data
          setTimeout(() => {
            refetchMessages();
            dispatch(clearTempMessages(activeChat._id));
          }, 1000);
        }

        // Update last message in chat list
        dispatch(
          updateChatLastMessage({
            chatId: data.chatId,
            message: data.message.content,
            timestamp: data.message.timestamp,
          })
        );

        // Refetch chats to update the order
        refetchChats();
      });

      // Listen for message read status updates
      socketInstance.on("messagesRead", ({ chatId, userId }) => {
        if (userId !== currentUserId) {
          refetchMessages();
        }
      });

      // Listen for user status updates
      socketInstance.on("userStatusUpdate", ({ userId, isOnline }) => {
        dispatch(updateUserStatus({ userId, isOnline }));
        refetchChats(); // Refetch chats to update online status in the UI
      });

      return () => {
        disconnectSocket();
      };
    }
  }, [dispatch, currentUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Set first chat as active when chats are loaded
  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      dispatch(setActiveChat(chats[0]));
    }
  }, [chats, activeChat, dispatch]);

  // Join chat room when active chat changes
  useEffect(() => {
    if (socket && activeChat) {
      // Leave previous chat room if exists
      const prevChatId = socket.prevChatId;
      if (prevChatId && prevChatId !== activeChat._id) {
        socket.emit("leaveChat", { chatId: prevChatId });
      }

      // Join new chat room
      socket.emit("joinChat", { chatId: activeChat._id });
      socket.prevChatId = activeChat._id;

      // Mark messages as read when entering a chat
      socket.emit("markRead", {
        chatId: activeChat._id,
        userId: currentUserId,
      });

      // Refetch messages to ensure we have the latest
      refetchMessages();
    }
  }, [socket, activeChat, currentUserId, refetchMessages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    // Create a temporary message object to display immediately
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      content: newMessage,
      sender: {
        _id: currentUserId,
        id: currentUserId,
        name: userName,
      },
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    // Add to temporary messages
    dispatch(
      addTempMessage({
        chatId: activeChat._id,
        message: tempMessage,
      })
    );

    // Clear input
    setNewMessage("");

    try {
      const result = await sendMessage({
        chatId: activeChat._id,
        content: newMessage,
      }).unwrap();

      // If we're not using sockets, update the chat manually
      if (!socket) {
        refetchMessages();
        refetchChats();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // You could mark the temp message as failed
    }
  };

  // Map your chats data to the UI format
  const chatGroups = chats.map((chat) => ({
    _id: chat._id,
    name: chat.name || (chat.participants || []).map((p) => p.name).join(", "),
    avatar:
      (chat.participants || [])
        .find((p) => p._id !== currentUserId)
        ?.name?.charAt(0) || "TI",
    avatarColor: "bg-pink-200",
    message: chat.lastMessage?.content || "No messages yet...",
    time: formatTimestamp(chat.lastMessage?.timestamp),
    isOnline: chat.participants?.some((p) => p.isOnline) || false,
    hasRead: chat.lastMessage?.read || false,
    isActive: activeChat?._id === chat._id,
  }));

  // Format timestamp helper
  function formatTimestamp(timestamp) {
    if (!timestamp) return "No recent activity";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} ${t("Mins Ago")}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ${t("Hours Ago")}`;
    return date.toLocaleDateString();
  }

  // Transform backend messages to UI format
  const transformMessagesToUI = () => {
    return allMessages.map((msg) => {
      // Check if the message sender is the current user
      const isCurrentUser =
        msg.sender?._id === currentUserId || msg.sender?.id === currentUserId;

      return {
        text: msg.content,
        time: formatMessageTime(msg.timestamp),
        type: "message",
        isCurrentUser: isCurrentUser,
        avatar: isCurrentUser
          ? null
          : msg.sender?.avatar ||
            "https://randomuser.me/api/portraits/men/32.jpg",
        reaction: msg.reaction || null,
        status: msg.status || "delivered",
      };
    });
  };

  function formatMessageTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const uiMessages = transformMessagesToUI();

  const handleChatSelect = (chatId) => {
    const selectedChat = chats.find((chat) => chat._id === chatId);
    dispatch(setActiveChat(selectedChat));

    // Mark messages as read when selecting a chat (handled in the useEffect)
  };

  const handelSchedulingMeeting = () => {
    setIsOpenSchedulingMeeting(!isOpenSchedulingMeeting);
  };

  const Avatar = ({ avatar, color }) => {
    if (typeof avatar === "string" && !avatar.startsWith("http")) {
      return (
        <div
          className={`flex items-center justify-center ${color} text-gray-700 w-8 h-8 rounded-full`}
        >
          {avatar}
        </div>
      );
    }
    return (
      <img
        src={avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
        className="w-8 h-8 rounded-full object-cover"
        alt="Avatar"
      />
    );
  };

  // Keep your existing files, photoGrid, and points data
  const files = [
    {
      name: "Project Phoenix Prop...",
      type: "pptx",
      size: "5.50 MB",
      icon: "📊",
    },
    { name: "Strategy recorded", type: "mp3", size: "5.50 MB", icon: "🎵" },
    { name: "Roadmap", type: "png", size: "3.20 MB", icon: "🖼️" },
    {
      name: "Project Phoenix Prop...",
      type: "pptx",
      size: "5.50 MB",
      icon: "📊",
    },
    {
      name: "Project Phoenix Prop...",
      type: "pptx",
      size: "5.50 MB",
      icon: "📊",
    },
    { name: "Screen demo", type: "mp4", size: "5.50 MB", icon: "🎬" },
  ];

  const photoGrid = [
    {
      src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=50",
    },
    {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=50",
    },
    {
      src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=50",
    },
    {
      src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=50",
    },
    {
      src: "https://images.unsplash.com/photo-1535970793482-07de93762dc4?w=400&q=50",
    },
    {
      src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=50",
    },
    {
      src: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&q=50",
    },
    {
      src: "https://images.unsplash.com/photo-1507608158173-1dcec673a2e5?w=400&q=50",
    },
    {
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=50",
    },
  ];

  const points = [
    "Discuss project timeline",
    "Allocate budget approvals by reviewing each department's ",
    "Set next meeting date",
  ];

  // Get chat participant avatar
  const getChatAvatar = () => {
    if (!activeChat?.participants) return "";

    const otherParticipant = activeChat.participants.find(
      (p) => p._id !== currentUserId || p.id !== currentUserId
    );

    return otherParticipant?.name?.charAt(0) || "";
  };

  return (
    <Page
      isTitle={false}
      className="flex w-full h-screen"
      dir="rtl"
      style={{ fontFamily: "Tajawal, sans-serif" }}
    >
      <div className={"w-full rounded-2xl overflow-hidden flex "}>
        {!showLeftSidebar && (
          <button
            className="md:hidden fixed top-11 left-1 z-50 bg-gray-800 text-white p-2 rounded"
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
          >
            <RiArrowRightSLine size={18} />
          </button>
        )}

        {/* Left Sidebar */}
        <div
          className={`w-60 border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 
          ${
            showLeftSidebar ? "block" : "hidden"
          } md:block fixed md:relative top-0 left-0 h-full z-40`}
        >
          {showLeftSidebar && (
            <button
              className="md:hidden fixed top-11 left-52 z-50 bg-gray-800 text-white p-2 rounded"
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            >
              <RiArrowLeftSLine size={18} />
            </button>
          )}
          {/* Tabs form here till end need to be modified*/}
          <div className="flex border-b border-gray-200 dark:border-veryWeak-500">
            <button
              className={`flex-1 py-4 text-center dark:text-gray-200 ${
                activeTab === "Chats"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab("Chats")}
            >
              {t("Chats")}
            </button>
            <button
              className={`flex-1 py-4 text-center dark:text-gray-200 ${
                activeTab === "Meetings"
                  ? "border-b-2 border-blue-500 text-blue-600 "
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab("Meetings")}
            >
              {t("Meetings")}
            </button>
          </div>

          {/* Schedule Button */}
          <div className="p-4">
            <button
              onClick={handelSchedulingMeeting}
              className="flex items-center text-blue-600 gap-2 dark:text-primary-200"
            >
              <span className="text-lg">+</span>
              <span>{t("Schedule a Meeting")}</span>
            </button>
          </div>

          {/* Search */}
          <div className="px-4 mb-2">
            <div className="relative dark:bg-gray-900">
              <input
                type="text"
                placeholder={t("Search...")}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md dark:bg-gray-900 dark:border-gray-700 focus-visible:dark:border-gray-700 text-sm"
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto tab-content">
            {chatsLoading ? (
              <div className="p-4 text-center">Loading chats...</div>
            ) : (
              chatGroups.map((chat) => (
                <div
                  key={chat._id}
                  className={"p-1 dark:bg-gray-800"}
                  onClick={() => handleChatSelect(chat._id)}
                >
                  <div
                    className={`px-3 py-3 flex items-start gap-3 hover:bg-gray-100 hover:dark:bg-gray-900 cursor-pointer ${
                      chat.isActive ? "bg-gray-100 dark:bg-gray-900" : ""
                    }`}
                  >
                    <Avatar avatar={chat.avatar} color={chat.avatarColor} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm text-gray-800 truncate dark:text-gray-200">
                          {chat.name}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-300">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate dark:text-gray-300">
                        {chat.message}
                      </p>
                    </div>
                    {chat.isOnline && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 self-end"></div>
                    )}
                    {chat.hasRead && (
                      <div className="text-blue-500">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex max-w-[100vw] max-h-[calc(90vh)] flex-col dark:bg-gray-800">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-white dark:bg-gray-800 dark:border-veryWeak-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-500">{getChatAvatar()}</span>
              </div>
              <div>
                <h3 className="flex flex-start font-medium dark:text-gray-200">
                  {activeChat?.name || t("Select a conversation")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {activeChat?.participants
                    ?.filter(
                      (p) => p._id !== currentUserId && p.id !== currentUserId
                    )
                    .map((p) => p.name)
                    .join(", ") || ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-800 custom-scroll">
            {messagesLoading ? (
              <div className="p-4 text-center">Loading messages...</div>
            ) : !activeChat ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t("Select a conversation to start chatting")}
              </div>
            ) : uiMessages.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t("No messages yet. Start the conversation!")}
              </div>
            ) : (
              uiMessages.map((message, index) => (
                <div key={index} className="mb-6 relative">
                  {message.isCurrentUser ? (
                    // Current user's message (displayed on the right)
                    <div className="flex justify-end mb-4">
                      <div className="max-w-md">
                        <div className="bg-blue-100 p-3 rounded-lg dark:bg-[#253EA7]">
                          <p className="text-gray-800 dark:text-gray-300">
                            {message.text}
                          </p>
                        </div>
                        <div className="mt-1 text-right">
                          <span className="text-xs text-gray-500">
                            {message.time}
                          </span>
                          <Check
                            size={16}
                            className="inline ml-1 text-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Other user's message (displayed on the left)
                    <div className="flex items-start gap-3">
                      {message.avatar && (
                        <img
                          src={message.avatar}
                          className="w-8 h-8 rounded-full"
                          alt="Avatar"
                        />
                      )}
                      <div className="flex flex-col max-w-md">
                        <div className="bg-white border border-gray-200 p-3 rounded-lg dark:bg-gray-900 dark:border-veryWeak-500">
                          <p className="text-gray-800 dark:text-gray-300">
                            {message.text}
                          </p>
                        </div>
                        <div className="mt-1">
                          <span className="text-xs text-gray-500">
                            {message.time}
                          </span>
                        </div>
                        {message.reaction && (
                          <div className="absolute -right-2 -bottom-2 bg-gray-100 rounded-full px-1 text-xs">
                            {message.reaction}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 flex max-w-full box-border items-center gap-3 bg-white dark:bg-[#31353F] dark:border-gray-700">
            <button className="text-gray-500 hover:text-gray-700">
              <Smile size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t("Type a message...")}
              className="flex-1 px-4 py-2 border border-gray-300 box-border w-1/2 rounded-full outline-none text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:focus:border-primary-200"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              disabled={!activeChat}
            />
            <button className="text-gray-500 hover:text-gray-700">
              <Paperclip size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Mic size={20} />
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:bg-blue-300"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !activeChat}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {!showRightSidebar && (
          <button
            className="md:hidden fixed top-11 right-0.5 z-50 bg-gray-800 text-white p-2 rounded"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
          >
            <RiArrowLeftSLine size={18} />
          </button>
        )}

        {/* Right Sidebar */}
        <div
          className={`w-60 border-l border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 
          ${
            showRightSidebar ? "block" : "hidden"
          } md:block fixed md:relative top-0 right-0 h-full z-40`}
        >
          {showRightSidebar && (
            <button
              className="md:hidden fixed top-11 right-52 z-50 bg-gray-800 text-white p-2 rounded"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
            >
              <RiArrowRightSLine size={18} />
            </button>
          )}

          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-veryWeak-500">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl text-gray-500 dark:text-gray-300">
                  {getChatAvatar()}
                </span>
              </div>
            </div>
            <h3 className="text-center font-medium dark:text-gray-300">
              {activeChat?.name || t("Select a conversation")}
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-veryWeak-500">
            <button
              className={`flex-1 py-3 text-center ${
                activeRightTab === "Attachments"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-primary-200 "
                  : "text-gray-700 dark:text-gray-400"
              }`}
              onClick={() => setActiveRightTab("Attachments")}
            >
              {t("Attachments")}
            </button>
            <button
              className={`flex-1 py-3 text-center ${
                activeRightTab === "Main points"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-primary-200"
                  : "text-gray-700 dark:text-gray-400"
              }`}
              onClick={() => setActiveRightTab("Main points")}
            >
              {t("Main points")}
            </button>
          </div>
          {/* Files Section */}
          <div className="h-full overflow-hidden overflow-y-auto custom-scroll">
            {activeRightTab === "Attachments" ? (
              <>
                {/* Files Section */}
                <div className="p-4">
                  <h4 className="flex flex-start font-[600] mb-2 dark:text-gray-200">
                    {t("Files")} (6)
                  </h4>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs">{file.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-800 dark:text-gray-300">
                              {file.name}
                            </p>
                            <p className="flex flex-start text-xs text-gray-500 dark:text-gray-400">
                              {t("Size")}: {file.size}
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-600 dark:text-primary-200">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos & Media Section */}
                <div className="p-4">
                  <h4 className="flex flex-start font-[600] mb-2 dark:text-gray-200">
                    {t("Photos & Media")} (9)
                  </h4>
                  <div className="grid grid-cols-3 gap-1">
                    {photoGrid.map((photo, index) => (
                      <div
                        key={index}
                        className="w-full aspect-square bg-gray-200 rounded-sm overflow-hidden"
                      >
                        <img
                          src={photo.src}
                          alt={`Media ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4">
                {/* Header with Icons */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="flex items-center font-[600] dark:text-gray-200">
                    {t("Points")} ({points.length})
                  </h4>

                  {/* Action Icons */}
                  <div className="flex items-center gap-2">
                    {/* Edit Icon */}
                    <button className="text-primary-600 hover:text-primary-800">
                      <Edit3Icon className="w-4 h-4" />
                    </button>
                    {/* Add Icon */}
                    <button className="text-primary-600 hover:text-primary-800">
                      <IoAdd className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Points List */}
                <div className="space-y-2">
                  {points.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between"
                    >
                      {/* Point Number and Content */}
                      <div className="flex items-start gap-2">
                        <span className="text-gray-600 dark:text-gray-400 font-start">
                          {index + 1}.
                        </span>
                        <p className="text-sm text-gray-800 dark:text-gray-300">
                          {point}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SchedulingMeeting
        isOpen={isOpenSchedulingMeeting}
        onClose={handelSchedulingMeeting}
      />
    </Page>
  );
};

export default ConversationPage;
