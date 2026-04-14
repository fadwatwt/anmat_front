import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.items = action.payload.data;
            state.unreadCount = action.payload.meta?.unreadCount || 0;
            state.isLoading = false;
        },
        addNotification: (state, action) => {
            // Add new notification to the beginning of the list
            state.items = [action.payload, ...state.items];
            state.unreadCount += 1;
        },
        markRead: (state, action) => {
            const index = state.items.findIndex(n => n.id === action.payload);
            if (index !== -1 && !state.items[index].isRead) {
                state.items[index].isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.items.forEach(n => n.isRead = true);
            state.unreadCount = 0;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

export const {
    setNotifications,
    addNotification,
    markRead,
    markAllAsRead,
    setLoading,
    setError
} = notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectIsNotificationsLoading = (state) => state.notifications.isLoading;

export default notificationsSlice.reducer;
