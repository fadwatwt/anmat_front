import React, { useState } from "react";
import { ChevronDown, Paperclip, Smile, Mic, Send } from "lucide-react";
import { Check } from "lucide-react";

const Conversation = () => {
  const [activeTab, setActiveTab] = useState("Meetings");
  const [activeRightTab, setActiveRightTab] = useState("Attachments");

  const chatGroups = [
    {
      name: "Team Innovators",
      avatar: "TI",
      avatarColor: "bg-pink-200",
      message: "Hey everyone! How's everyone...",
      time: "20 Mins Ago",
      isOnline: true,
    },
    {
      name: "Creative Minds",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      isAvatar: true,
      message: "Hope you all have a super pro...",
      time: "20 Mins Ago",
      hasRead: true,
    },
    {
      name: "Reviewing the content",
      avatar: "RT",
      avatarColor: "bg-gray-200",
      message: "Determine who is responsible...",
      time: "20 Mins Ago",
      hasRead: true,
      isActive: true,
    },
    {
      name: "Strategic Thinkers",
      avatar: "ST",
      avatarColor: "bg-gray-200",
      message: "Just checking in to see if anyone...",
      time: "20 Mins Ago",
      isOnline: true,
    },
    {
      name: "Dynamic Collaboration",
      avatar: "DC",
      avatarColor: "bg-blue-200",
      message: "Hope you're all enjoying your tim...",
      time: "20 Mins Ago",
      isOnline: true,
    },
    {
      name: "Impact Makers",
      avatar: "IM",
      avatarColor: "bg-yellow-200",
      message: "Keep up the amazing teamw...",
      time: "20 Mins Ago",
      hasRead: true,
    },
    {
      name: "Trailblazers",
      avatar: "TB",
      avatarColor: "bg-green-200",
      message: "Sending positive energy to th...",
      time: "20 Mins Ago",
    },
  ];

  const messages = [
    {
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      message: "Just a friendly reminder to stay positive!",
      time: "09:40",
      reaction: null,
      type: "text",
    },
    {
      avatar: "https://randomuser.me/api/portraits/women/25.jpg",
      message: null,
      audio: true,
      duration: "00:24",
      time: "09:40",
      reaction: "👍",
      type: "audio",
    },
    {
      text: "How sure are we about our presentation?",
      time: "09:50",
      type: "question",
      isRight: true,
    },
    {
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      message: "Just a friendly reminder to stay positive!",
      time: "09:40",
      reaction: null,
      type: "text",
    },
    {
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
      message: "Determine who is responsible for this part of the process.",
      time: "10:00",
      reaction: "❤️",
      type: "image",
    },
  ];

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
    { src: "https://images.unsplash.com/photo-1484154218962-a197022b5858" },
    { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab" },
    { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e" },
    { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4" },
    { src: "https://images.unsplash.com/photo-1535970793482-07de93762dc4" },
    { src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2" },
    { src: "https://images.unsplash.com/photo-1497215842964-222b430dc094" },
    { src: "https://images.unsplash.com/photo-1507608158173-1dcec673a2e5" },
    { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9" },
  ];

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

  return (
    <div className="flex w-full h-[95vh] bg-gray-50 p-5">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 text-center ${
              activeTab === "Chats"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("Chats")}
          >
            Chats
          </button>
          <button
            className={`flex-1 py-4 text-center ${
              activeTab === "Meetings"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("Meetings")}
          >
            Meetings
          </button>
        </div>

        {/* Schedule Button */}
        <div className="p-4">
          <button className="flex items-center text-blue-600 gap-2">
            <span className="text-lg">+</span>
            <span>Schedule a Meeting</span>
          </button>
        </div>
        {/* add btn and center it */}

        {/* Search */}
        <div className="px-4 mb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm"
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
        <div className="flex-1 overflow-y-auto">
          {chatGroups.map((chat, index) => (
            <div
              key={index}
              className={`px-4 py-4 flex items-start gap-3 hover:bg-gray-100 ${
                chat.isActive ? "bg-gray-100" : ""
              }`}
            >
              {chat.avatar || chat.isAvatar ? (
                <Avatar avatar={chat.avatar} color={chat.avatarColor} />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">
                    {chat.name.substring(0, 2)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm text-gray-800 truncate">
                    {chat.name}
                  </h4>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.message}</p>
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
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-500">RT</span>
            </div>
            <div>
              <h3 className="flex flex-start font-medium">
                Reviewing the content
              </h3>
              <p className="text-xs text-gray-500">
                Alice, Bob, Charlie, Diana, Ethan, Fiona and Amir
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
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {messages.map((message, index) => (
            <div key={index} className="mb-6 relative">
              {message.type === "text" && (
                <div className="flex items-start gap-3">
                  {message.avatar && (
                    <img
                      src={message.avatar}
                      className="w-8 h-8 rounded-full"
                      alt="Avatar"
                    />
                  )}
                  <div className="flex flex-col max-w-md">
                    <div className="bg-white border border-gray-200 p-3 rounded-lg">
                      <p className="text-gray-800">{message.message}</p>
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

              {message.type === "audio" && (
                <div className="flex items-start gap-3">
                  {message.avatar && (
                    <img
                      src={message.avatar}
                      className="w-8 h-8 rounded-full"
                      alt="Avatar"
                    />
                  )}
                  <div className="flex flex-col max-w-md">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 p-3 rounded-lg">
                      <button className="text-blue-500">▶</button>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-5 w-72 bg-gray-200 relative rounded-full overflow-hidden">
                            <div
                              className="h-5 w-1/4 bg-blue-500 absolute"
                              style={{ left: "50%" }}
                            ></div>
                            <div className="absolute flex w-full justify-around">
                              {Array(15)
                                .fill(0)
                                .map((_, i) => (
                                  <div
                                    key={i}
                                    className="h-5 w-0.5 bg-white opacity-40"
                                  ></div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {message.duration}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                      {message.reaction && (
                        <div className="bg-amber-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {message.reaction}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {message.type === "question" && (
                <div className="flex justify-end mb-4">
                  <div className="max-w-md">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-gray-800">{message.text}</p>
                    </div>
                    <div className="mt-1 text-right">
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                      <Check size={16} className="inline ml-1 text-blue-500" />
                    </div>
                  </div>
                </div>
              )}

              {message.type === "image" && (
                <div className="flex items-start gap-3">
                  {message.avatar && (
                    <img
                      src={message.avatar}
                      className="w-8 h-8 rounded-full"
                      alt="Avatar"
                    />
                  )}
                  <div className="flex flex-col max-w-md">
                    <div className="bg-white border border-gray-200 p-3 rounded-lg">
                      <div className="w-64 h-48 bg-gray-300 rounded-md mb-2 overflow-hidden">
                        <img
                          src={message.image}
                          alt="Chat attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-gray-800">{message.message}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                      {message.reaction && (
                        <div className="bg-red-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {message.reaction}
                        </div>
                      )}
                      <ChevronDown size={16} className="text-blue-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-3 bg-white">
          <button className="text-gray-500 hover:text-gray-700">
            <Smile size={20} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button className="text-gray-500 hover:text-gray-700">
            <Paperclip size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Mic size={20} />
          </button>
          <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-60 border-l border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl text-gray-500">RT</span>
            </div>
          </div>
          <h3 className="text-center font-medium">Reviewing the content</h3>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-center ${
              activeRightTab === "Attachments"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-700"
            }`}
            onClick={() => setActiveRightTab("Attachments")}
          >
            Attachments
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              activeRightTab === "Main points"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-700"
            }`}
            onClick={() => setActiveRightTab("Main points")}
          >
            Main points
          </button>
        </div>

        {/* Files Section */}
        <div className="p-4">
          <h4 className="flex flex-start font-[600]  mb-2 ">Files (6)</h4>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs">{file.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{file.name}</p>
                    <p className=" flex flex-start text-xs text-gray-500">
                      Size: {file.size}
                    </p>
                  </div>
                </div>
                <button className="text-blue-600">
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
          <h4 className=" flex flex-start font-[600] mb-2">
            Photos & Media (9)
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
      </div>
    </div>
  );
};

export default Conversation;
