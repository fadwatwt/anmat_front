import { apiSlice } from "../api/apiSlice";

export const subscribersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscribers: builder.query({
            query: () => ({
                url: "api/admin/subscribers",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Subscribers"],
        }),
        getSubscriber: builder.query({
            query: (id) => ({
                url: `api/admin/subscribers/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "Subscribers", id }],
        }),
        toggleSubscriberActivation: builder.mutation({
            query: (id) => ({
                url: `api/admin/subscribers/${id}/toggle-activation`,
                method: "PATCH",
            }),
            invalidatesTags: ["Subscribers"],
        }),
    }),
});

export const {
    useGetSubscribersQuery,
    useGetSubscriberQuery,
    useToggleSubscriberActivationMutation,
} = subscribersApi;
