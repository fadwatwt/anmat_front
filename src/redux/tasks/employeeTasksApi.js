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
} = employeeTasksApi;
