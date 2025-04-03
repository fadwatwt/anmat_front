// redux/notifications/notificationsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  socketConnected: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    updateNotification: (state, action) => {
      const index = state.notifications.findIndex(
        (n) => n._id === action.payload._id
      );
      if (index !== -1) {
        const wasRead = state.notifications[index].isRead;
        state.notifications[index] = action.payload;
        if (wasRead !== action.payload.isRead) {
          state.unreadCount += action.payload.isRead ? -1 : 1;
        }
      }
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
      state.unreadCount = 0;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSocketStatus: (state, action) => {
      state.socketConnected = action.payload;
    },
    resetNotifications: () => initialState,
  },
});

export const {
  setNotifications,
  addNotification,
  updateNotification,
  markAllAsRead,
  setLoading,
  setError,
  setSocketStatus,
  resetNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
