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
            const newItems = action.payload.data || [];
            // Build a set of IDs that are arriving in the new history fetch
            const newItemIds = new Set(newItems.map(n => n.id));
            
            // Find items already in state that are NOT in the new history fetch (real-time notifications)
            const sseItems = state.items.filter(n => !newItemIds.has(n.id));
            const sseUnreadCount = sseItems.filter(n => !n.isRead).length;
            
            // Combine existing SSE items with new history items
            state.items = [...sseItems, ...newItems];
            
            // Calculate local unread count from the combined items
            const localUnreadCount = state.items.filter(n => !n.isRead).length;
            
            // Merge unread counts: use backend total if available, otherwise fallback to local
            const backendUnread = Number(action.payload.meta?.unreadCount || 0);
            
            // If backend says 0 but we clearly see unread items in the list, trust the list
            state.unreadCount = (backendUnread > 0) ? backendUnread : localUnreadCount;
            
            console.log('🔔 [Redux] Notifications Set:', {
                totalItems: state.items.length,
                unreadCount: state.unreadCount,
                backendUnread,
                localUnreadCount
            });
            
            state.isLoading = false;
        },
        addNotification: (state, action) => {
            const exists = state.items.some(n => n.id === action.payload.id);
            if (!exists) {
                // Add new notification to the beginning of the list
                state.items = [action.payload, ...state.items];
                state.unreadCount += 1;
                console.log('📨 [Redux] New notification added. New unread count:', state.unreadCount);
            }
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
