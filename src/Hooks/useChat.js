"use client";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initSocket, getSocket, disconnectSocket } from "@/services/socketService";
import { selectUserId } from "@/redux/auth/authSlice";
import { conversationsAPI } from "@/redux/conversations/conversationsAPI";
import { addTempMessage } from "@/redux/conversations/conversationsSlice";

export const useChat = (chatId) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token || !userId) return;

    const socket = initSocket(token);

    if (chatId) {
      socket.emit("join_chat", { chat_id: chatId });
    }

    const handleNewMessage = (message) => {
      console.log("📥 [Socket] New Message:", message);
      // Update the RTK Query cache for getMessages
      dispatch(
        conversationsAPI.util.updateQueryData("getMessages", chatId, (draft) => {
          // Handle both array and object { messages: [] } formats
          const messages = Array.isArray(draft) ? draft : draft?.messages;
          if (messages && Array.isArray(messages)) {
            if (!messages.find((m) => m._id === message._id)) {
              messages.unshift(message); // Assuming newest first
            }
          }
        })
      );
      
      // Also update the chat list (getChats) to update the last message/timestamp
      dispatch(
        conversationsAPI.util.updateQueryData("getChats", undefined, (draft) => {
          if (draft && Array.isArray(draft)) {
            const chatIndex = draft.findIndex((c) => c._id === message.chat_id);
            if (chatIndex !== -1) {
              draft[chatIndex].last_message = message;
              // Reorder chats to put the active one at top?
              const [updatedChat] = draft.splice(chatIndex, 1);
              draft.unshift(updatedChat);
            }
          }
        })
      );
    };

    const handleUserTyping = ({ user_id, is_typing }) => {
      console.log(`📥 [Socket] User ${user_id} is ${is_typing ? "" : "not "}typing`);
      // You can handle this in a local state or dedicated slice
    };

    const handleException = (error) => {
      console.error("📥 [Socket] Exception:", error);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("exception", handleException);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("exception", handleException);
    };
  }, [chatId, userId, token, dispatch]);

  const sendMessage = useCallback((content, attachment = null) => {
    const socket = getSocket();
    if (socket && chatId) {
      socket.emit("send_message", {
        chat_id: chatId,
        content,
        attachment
      });
    }
  }, [chatId]);

  const setTyping = useCallback((isTyping) => {
    const socket = getSocket();
    if (socket && chatId) {
      socket.emit("typing", {
        chat_id: chatId,
        is_typing: isTyping
      });
    }
  }, [chatId]);

  return { sendMessage, setTyping };
};
