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
        getEmployeeTaskStatisticsStatus: builder.query({
            query: () => ({
                url: "api/employee/tasks/statistics/status",
                method: "GET",
            }),
            providesTags: ["Tasks"],
        }),
        updateTaskStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `api/employee/tasks/${id}/status-update`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["Tasks"],
        }),
    }),
});

export const {
    useGetEmployeeTasksQuery,
    useUpdateTaskStatusMutation,
    useGetEmployeeTaskStatisticsStatusQuery,
} = employeeTasksApi;
