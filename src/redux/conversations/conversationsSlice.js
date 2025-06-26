// First, add these missing functions in your conversationsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const conversationsSlice = createSlice({
  name: "conversations",
  initialState: {
    activeChat: null,
    tempMessages: {},
    users: [],
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addTempMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.tempMessages[chatId]) {
        state.tempMessages[chatId] = [];
      }
      state.tempMessages[chatId].push(message);
    },
    clearTempMessages: (state, action) => {
      const chatId = action.payload;
      state.tempMessages[chatId] = [];
    },
    updateChatLastMessage: (state, action) => {
      const { chatId, message, timestamp } = action.payload;
      // This will be used by the chats query to update the UI
    },
    updateUserStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      state.users = state.users.map((user) =>
        user._id === userId ? { ...user, isOnline } : user
      );
    },
  },
});

export const {
  setActiveChat,
  addTempMessage,
  clearTempMessages,
  updateChatLastMessage,
  updateUserStatus,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
