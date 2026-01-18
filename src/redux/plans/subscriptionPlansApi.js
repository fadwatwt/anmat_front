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
        getSubscriptionPlan: builder.query({
            query: (id) => ({
                url: `api/admin/subscription-plans/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "SubscriptionPlans", id }],
        }),
    }),
});

export const {
    useGetSubscriptionPlansQuery,
    useGetSubscriptionPlanQuery,
} = subscriptionPlansApi;
