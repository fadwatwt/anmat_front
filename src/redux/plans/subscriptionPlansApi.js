import { apiSlice } from "../api/apiSlice";

export const subscriptionPlansApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionPlans: builder.query({
            query: () => ({
                url: "api/admin/subscription-plans",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["SubscriptionPlans"],
        }),
        getSubscriberSubscriptionPlans: builder.query({
            query: () => ({
                url: "api/subscriber/subscription-plans",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["SubscriptionPlans"],
        }),
        getSubscriptionPlan: builder.query({
            query: (id) => ({
                url: `api/admin/subscription-plans/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "SubscriptionPlans", id }],
        }),
        createSubscriptionPlan: builder.mutation({
            query: (newPlan) => ({
                url: "api/admin/subscription-plans",
                method: "POST",
                body: newPlan,
            }),
            invalidatesTags: ["SubscriptionPlans"],
        }),
        deleteSubscriptionPlan: builder.mutation({
            query: (id) => ({
                url: `api/admin/subscription-plans/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SubscriptionPlans"],
        }),
        toggleSubscriptionPlanActiveStatus: builder.mutation({
            query: (id) => ({
                url: `api/admin/subscription-plans/${id}/toggle-activity`,
                method: "PATCH",
            }),
            invalidatesTags: ["SubscriptionPlans"],
        }),
        toggleSubscriptionPlanTrialStatus: builder.mutation({
            query: (id) => ({
                url: `api/admin/subscription-plans/${id}/trial/toggle-activity`,
                method: "PATCH",
            }),
            invalidatesTags: ["SubscriptionPlans"],
        }),
    }),
});

export const {
    useGetSubscriptionPlansQuery,
    useGetSubscriberSubscriptionPlansQuery,
    useGetSubscriptionPlanQuery,
    useCreateSubscriptionPlanMutation,
    useDeleteSubscriptionPlanMutation,
    useToggleSubscriptionPlanActiveStatusMutation,
    useToggleSubscriptionPlanTrialStatusMutation,
} = subscriptionPlansApi;
