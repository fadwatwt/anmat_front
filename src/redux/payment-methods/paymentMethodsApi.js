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
        setDefaultPaymentMethod: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/payment-methods/${id}/default`,
                method: "PATCH",
            }),
            invalidatesTags: ["PaymentMethods"],
        }),
    }),
});

export const {
    useGetPaymentMethodsQuery,
    useSetDefaultPaymentMethodMutation,
} = paymentMethodsApi;
