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
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
} = notificationsApi;
