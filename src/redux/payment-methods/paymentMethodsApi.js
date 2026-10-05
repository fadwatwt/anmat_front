import { apiSlice } from "../api/apiSlice";

export const paymentMethodsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPaymentMethods: builder.query({
            query: () => ({
                url: "api/subscriber/payment-methods/",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["PaymentMethods"],
        }),
        createPaymentMethod: builder.mutation({
            query: (body) => ({
                url: "api/subscriber/payment-methods/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PaymentMethods"],
        }),
        createStripePaymentMethod: builder.mutation({
            query: (body) => ({
                url: "api/subscriber/payment-methods/stripe",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PaymentMethods"],
        }),
        setDefaultPaymentMethod: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/payment-methods/${id}/default`,
                method: "PATCH",
            }),
            invalidatesTags: ["PaymentMethods"],
        }),
        updatePaymentMethod: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `api/subscriber/payment-methods/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PaymentMethods"],
        }),
        deletePaymentMethod: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/payment-methods/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PaymentMethods"],
        }),
    }),
});

export const {
    useGetPaymentMethodsQuery,
    useCreatePaymentMethodMutation,
    useCreateStripePaymentMethodMutation,
    useSetDefaultPaymentMethodMutation,
    useUpdatePaymentMethodMutation,
    useDeletePaymentMethodMutation,
} = paymentMethodsApi;
