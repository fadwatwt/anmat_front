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
        getEmployeeTaskDetails: builder.query({
            query: (id) => ({
                url: `api/employee/tasks/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Tasks", id }],
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
        addEmployeeTaskComment: builder.mutation({
            query: ({ taskId, text }) => ({
                url: `api/employee/tasks/${taskId}/comments`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }],
        }),
        deleteEmployeeTaskComment: builder.mutation({
            query: ({ taskId, commentId }) => ({
                url: `api/employee/tasks/${taskId}/comments/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }],
        }),
        editEmployeeTaskComment: builder.mutation({
            query: ({ taskId, commentId, text }) => ({
                url: `api/employee/tasks/${taskId}/comments/${commentId}`,
                method: "PUT",
                body: { text },
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }],
        }),
    }),
});

export const {
    useGetEmployeeTasksQuery,
    useUpdateTaskStatusMutation,
    useGetEmployeeTaskStatisticsStatusQuery,
    useGetEmployeeTaskDetailsQuery,
    useAddEmployeeTaskCommentMutation,
    useDeleteEmployeeTaskCommentMutation,
    useEditEmployeeTaskCommentMutation,
} = employeeTasksApi;
