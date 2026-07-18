import { apiSlice } from "./apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: ({ recipientId, recipientType, page = 1, limit = 50 }) => ({
                url: `/api/notifications/${recipientId}/${recipientType}?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),
        getMyNotifications: builder.query({
            query: ({ page = 1, limit = 50 } = {}) => ({
                url: `/api/notifications/my-notifications?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),
        markNotificationAsRead: builder.mutation({
            query: (nId) => ({
                url: `/api/notifications/mark-as-read/${nId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAllNotificationsAsRead: builder.mutation({
            query: () => ({
                url: `/api/notifications/mark-all-as-read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
        sendAdminNotification: builder.mutation({
            query: (body) => ({
                url: `/api/notifications/admin/send`,
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useGetMyNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
    useSendAdminNotificationMutation,
} = notificationsApi;
