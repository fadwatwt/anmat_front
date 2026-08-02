import { apiSlice } from "../api/apiSlice";

export const moneyReceivingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMoneyReceivingMethods: builder.query({
            query: () => ({
                url: "api/admin/money-receiving-methods",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["MoneyReceivingMethods"],
        }),
        getPublicMoneyReceivingMethods: builder.query({
            query: () => ({
                url: "api/public/money-receiving-methods",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["MoneyReceivingMethods"],
        }),
        createMoneyReceivingMethod: builder.mutation({
            query: (body) => ({
                url: "api/admin/money-receiving-methods",
                method: "POST",
                body,
            }),
            invalidatesTags: ["MoneyReceivingMethods"],
        }),
        updateMoneyReceivingMethod: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `api/admin/money-receiving-methods/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["MoneyReceivingMethods"],
        }),
        deleteMoneyReceivingMethod: builder.mutation({
            query: (id) => ({
                url: `api/admin/money-receiving-methods/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MoneyReceivingMethods"],
        }),
        toggleMoneyReceivingMethodActiveStatus: builder.mutation({
            query: (id) => ({
                url: `api/admin/money-receiving-methods/${id}/toggle-activity`,
                method: "PATCH",
            }),
            invalidatesTags: ["MoneyReceivingMethods"],
        }),
    }),
});

export const {
    useGetMoneyReceivingMethodsQuery,
    useGetPublicMoneyReceivingMethodsQuery,
    useCreateMoneyReceivingMethodMutation,
    useUpdateMoneyReceivingMethodMutation,
    useDeleteMoneyReceivingMethodMutation,
    useToggleMoneyReceivingMethodActiveStatusMutation,
} = moneyReceivingApi;
