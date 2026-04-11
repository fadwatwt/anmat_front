import { apiSlice } from "../api/apiSlice";

export const salariesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSalaryTransactions: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/employees-salary-transactions",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Salaries"],
        }),
        createSalaryTransaction: builder.mutation({
            query: (newTransaction) => ({
                url: "api/subscriber/organization/employees-salary-transactions",
                method: "POST",
                body: newTransaction,
            }),
            invalidatesTags: ["Salaries"],
        }),
        deleteSalaryTransaction: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/employees-salary-transactions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Salaries"],
        }),
    }),
});

export const {
    useGetSalaryTransactionsQuery,
    useCreateSalaryTransactionMutation,
    useDeleteSalaryTransactionMutation,
} = salariesApi;
