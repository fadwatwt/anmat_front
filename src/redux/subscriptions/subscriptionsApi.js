import { apiSlice } from "../api/apiSlice";

export const subscriptionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptions: builder.query({
            query: (params) => ({
                url: "api/admin/subscriptions",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Subscriptions"],
        }),
        getSubscription: builder.query({
            query: (id) => ({
                url: `api/admin/subscriptions/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "Subscriptions", id }],
        }),
        updateSubscriptionStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `api/admin/subscriptions/${id}/update-status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Subscriptions"],
        }),
        getSubscriptionsBasicDetails: builder.query({
            query: () => ({
                url: "api/admin/subscriptions/basic-details",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Subscriptions"],
        }),
    }),
});

export const {
    useGetSubscriptionsQuery,
    useGetSubscriptionQuery,
    useUpdateSubscriptionStatusMutation,
    useGetSubscriptionsBasicDetailsQuery,
} = subscriptionsApi;
