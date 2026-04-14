import { apiSlice } from "./apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: ({ recipientId, recipientType }) => ({
                url: `/api/notifications/${recipientId}/${recipientType}`,
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),
        markNotificationAsRead: builder.mutation({
            query: (notificationId) => ({
                url: `/api/notifications/mark-read/${notificationId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAllNotificationsAsRead: builder.mutation({
            query: ({ recipientId, recipientType }) => ({
                url: `/api/notifications/mark-all-read/${recipientId}/${recipientType}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
} = notificationsApi;
