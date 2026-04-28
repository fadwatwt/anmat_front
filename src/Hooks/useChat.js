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

    console.log(`📡 [Chat] Connecting... User: ${userId}, Active Chat: ${chatId || "None"}`);

    // Join personal room to receive global updates (like new chats or messages in other rooms)
    socket.emit("join_chat", { chat_id: userId });
    console.log(`📡 [Chat] Joined personal room: ${userId}`);

    if (chatId) {
      socket.emit("join_chat", { chat_id: chatId });
      console.log(`📡 [Chat] Joined chat room: ${chatId}`);
    }

    const handleNewMessage = (message) => {
      console.log("📥 [Chat] New Message Event Received:", message);
      
      // 1. Update the Chat List (Always)
      dispatch(
        conversationsAPI.util.updateQueryData("getChats", undefined, (draft) => {
          // The backend returns { status, data: [] }
          const chats = draft?.data; 
          if (Array.isArray(chats)) {
            const chatIndex = chats.findIndex((c) => c._id === message.chat_id);
            if (chatIndex !== -1) {
              console.log("📝 [Chat] Updating existing chat in list:", message.chat_id);
              chats[chatIndex].last_message = message;
              
              // Increment unread count if it's not the active chat and not sent by me
              if (message.chat_id !== chatId && message.sent_by !== userId) {
                chats[chatIndex].unreadCount = (chats[chatIndex].unreadCount || 0) + 1;
              }

              // Move to top
              const [updatedChat] = chats.splice(chatIndex, 1);
              chats.unshift(updatedChat);
            } else {
              console.log("🆕 [Chat] Chat not in list, triggering refetch...");
              dispatch(conversationsAPI.util.invalidateTags(["Chats"]));
            }
          }
        })
      );

      // 2. Update Messages Cache (Only if it's the active chat)
      if (chatId && message.chat_id === chatId) {
        console.log("💬 [Chat] Updating active chat messages:", chatId);
        dispatch(
          conversationsAPI.util.updateQueryData("getMessages", chatId, (draft) => {
            // The backend returns { status, data: [] }
            const messages = draft?.data;
            if (Array.isArray(messages)) {
              if (!messages.find((m) => m._id === message._id)) {
                messages.unshift(message);
              }
            }
          })
        );
      }
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
      console.log(`📤 [Chat] Sending message to ${chatId}:`, content);
      socket.emit("send_message", {
        chat_id: chatId,
        content,
        attachment
      }, (ack) => {
        if (ack?.error) {
          console.error("❌ [Chat] Send Message Error:", ack.error);
        } else {
          console.log("✅ [Chat] Message sent successfully");
        }
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
