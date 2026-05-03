import { apiSlice } from "../api/apiSlice";

export const subscriberNotificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all available notification types (Warning, Alert, Info, ...)
        getSubscriberNotificationTypes: builder.query({
            query: () => ({
                url: `/api/subscriber-notifications/types`,
                method: "GET",
            }),
            providesTags: ["SubscriberNotificationTypes"],
        }),

        // Subscriber sends a notification to employees
        sendSubscriberNotification: builder.mutation({
            query: (body) => ({
                url: `/api/subscriber-notifications/send`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["SubscriberNotifications"],
        }),

        // Subscriber views all sent notifications
        getSentSubscriberNotifications: builder.query({
            query: ({ page = 1, limit = 20, employeeId } = {}) => ({
                url: `/api/subscriber-notifications/sent?page=${page}&limit=${limit}${employeeId ? `&employee_id=${employeeId}` : ""}`,
                method: "GET",
            }),
            providesTags: ["SubscriberNotifications"],
        }),

        // Employee views their received subscriber notifications
        getMySubscriberNotifications: builder.query({
            query: ({ page = 1, limit = 20 } = {}) => ({
                url: `/api/subscriber-notifications/my?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["SubscriberNotifications"],
        }),

        // Employee marks a notification as read
        markSubscriberNotificationAsRead: builder.mutation({
            query: (id) => ({
                url: `/api/subscriber-notifications/${id}/read`,
                method: "POST",
            }),
            invalidatesTags: ["SubscriberNotifications"],
        }),
    }),
});

export const {
    useGetSubscriberNotificationTypesQuery,
    useSendSubscriberNotificationMutation,
    useGetSentSubscriberNotificationsQuery,
    useGetMySubscriberNotificationsQuery,
    useMarkSubscriberNotificationAsReadMutation,
} = subscriberNotificationsApi;
