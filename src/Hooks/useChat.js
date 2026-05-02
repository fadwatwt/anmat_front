"use client";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initSocket, getSocket } from "@/services/socketService";
import { selectUserId } from "@/redux/auth/authSlice";
import { conversationsAPI } from "@/redux/conversations/conversationsAPI";

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

      // Notify server that this user has read the chat
      socket.emit("mark_read", { chat_id: chatId });

      // Optimistically zero the unread count in the chat list cache
      dispatch(
        conversationsAPI.util.updateQueryData("getChats", undefined, (draft) => {
          const chats = draft?.data;
          if (Array.isArray(chats)) {
            const chat = chats.find((c) => c._id === chatId);
            if (chat) chat.unreadCount = 0;
          }
        })
      );
    }

    const handleMessagesRead = ({ chat_id, user_id }) => {
      console.log(`👁 [Chat] Messages read in ${chat_id} by ${user_id}`);
      dispatch(
        conversationsAPI.util.updateQueryData("getMessages", chat_id, (draft) => {
          const messages = draft?.data;
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              if (msg.read_by && !msg.read_by.includes(user_id)) {
                msg.read_by.push(user_id);
              }
            });
          }
        })
      );
    };

    const handleNewMessage = (message) => {
      console.log("📥 [Chat] New Message Event Received:", message);

      const msgChatId = message.chat_id?.toString() || message.chat_id;
      const msgSenderId = message.sent_by?._id?.toString() || message.sent_by?.toString() || message.sent_by;
      const currentUserIdStr = userId?.toString();

      // New message from someone else → badge count needs updating
      if (msgSenderId !== currentUserIdStr) {
        dispatch(conversationsAPI.util.invalidateTags(["UnreadChats"]));
      }
      
      // 1. Update the Chat List (Always)
      dispatch(
        conversationsAPI.util.updateQueryData("getChats", undefined, (draft) => {
          const chats = draft?.data; 
          if (Array.isArray(chats)) {
            const chatIndex = chats.findIndex((c) => c._id?.toString() === msgChatId);
            if (chatIndex !== -1) {
              console.log("📝 [Chat] Updating existing chat in list:", msgChatId);
              chats[chatIndex].last_message = message;
              
              // Increment unread count if it's not the active chat and not sent by me
              if (msgChatId !== chatId?.toString() && msgSenderId !== currentUserIdStr) {
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
      if (chatId && msgChatId === chatId.toString()) {
        console.log("💬 [Chat] Updating active chat messages:", chatId);
        dispatch(
          conversationsAPI.util.updateQueryData("getMessages", chatId, (draft) => {
            const messages = draft?.data;
            if (Array.isArray(messages)) {
              const messageExists = messages.some((m) => m._id?.toString() === message._id?.toString());
              if (!messageExists) {
                messages.unshift(message);
              }
            }
          })
        );

        // Chat is open and message is from someone else — mark as read immediately
        if (msgSenderId !== currentUserIdStr) {
          socket.emit("mark_read", { chat_id: chatId });
          dispatch(conversationsAPI.endpoints.markChatAsRead.initiate(chatId));
        }
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
    socket.on("messages_read", handleMessagesRead);
    socket.on("user_typing", handleUserTyping);
    socket.on("exception", handleException);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("messages_read", handleMessagesRead);
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
