import { apiSlice } from "../api/apiSlice";

export const moneyReceivingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMoneyReceivingMethods: builder.query({
            query: () => ({
                url: "api/admin/money-receiving-methods",
                method: "GET",
            }),
            providesTags: ["MoneyReceivingMethods"],
        }),
    }),
});

export const {
    useGetMoneyReceivingMethodsQuery,
} = moneyReceivingApi;
