import { apiSlice } from "../api/apiSlice";

export const employeeSalariesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployeeSalaryTransactions: builder.query({
            query: () => ({
                url: "api/employee/salary-transactions",
                method: "GET",
            }),
            providesTags: ["Salaries"],
            transformResponse: (response) => response.data || response,
        }),
    }),
});

export const {
    useGetEmployeeSalaryTransactionsQuery,
} = employeeSalariesApi;
