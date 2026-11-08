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
            invalidatesTags: ["Salaries", "ActivityLogs"],
        }),
        updateSalaryTransaction: builder.mutation({
            query: ({ id, ...updatedTransaction }) => ({
                url: `api/subscriber/organization/employees-salary-transactions/${id}`,
                method: "PATCH",
                body: updatedTransaction,
            }),
            invalidatesTags: ["Salaries", "ActivityLogs"],
        }),
        deleteSalaryTransaction: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/employees-salary-transactions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Salaries", "ActivityLogs"],
        }),
    }),
});

export const {
    useGetSalaryTransactionsQuery,
    useCreateSalaryTransactionMutation,
    useUpdateSalaryTransactionMutation,
    useDeleteSalaryTransactionMutation,
} = salariesApi;
