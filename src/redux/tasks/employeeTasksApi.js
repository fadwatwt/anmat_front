import { apiSlice } from "../api/apiSlice";

export const employeeTasksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployeeTasks: builder.query({
            query: () => ({
                url: "api/employee/tasks",
                method: "GET",
            }),
            providesTags: ["Tasks"],
            transformResponse: (response) => response.data || response,
        }),
    }),
});

export const {
    useGetEmployeeTasksQuery,
} = employeeTasksApi;
