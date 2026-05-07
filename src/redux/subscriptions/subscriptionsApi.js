import { apiSlice } from "../api/apiSlice";

export const subscriptionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptions: builder.query({
            query: (params) => ({
                url: "api/subscriptions/admin/list",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Subscriptions"],
        }),
        getSubscription: builder.query({
            query: (id) => ({
                url: `api/subscriptions/admin/${id}`, // Assuming this exists or should match the pattern
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "Subscriptions", id }],
        }),
        updateSubscriptionStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `api/subscriptions/admin/${id}/update-status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Subscriptions"],
        }),
        getSubscriptionsBasicDetails: builder.query({
            query: () => ({
                url: "api/subscriptions/admin/basic-details",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Subscriptions"],
        }),
        getMySubscription: builder.query({
            query: () => ({
                url: "api/subscriptions/subscriber/my-subscription",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Subscriptions"],
        }),
        getMyPayments: builder.query({
            query: () => ({
                url: "api/subscriptions/subscriber/my-payments",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Subscriptions"],
        }),
        updateExtraFeatures: builder.mutation({
            query: ({ id, extra_features }) => ({
                url: `api/subscriptions/admin/${id}/extra-features`,
                method: "PATCH",
                body: { extra_features },
            }),
            invalidatesTags: ["Subscriptions"],
        }),
    }),
});

export const {
    useGetSubscriptionsQuery,
    useGetSubscriptionQuery,
    useUpdateSubscriptionStatusMutation,
    useGetSubscriptionsBasicDetailsQuery,
    useGetMySubscriptionQuery,
    useGetMyPaymentsQuery,
    useUpdateExtraFeaturesMutation,
} = subscriptionsApi;
