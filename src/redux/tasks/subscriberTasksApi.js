import { apiSlice } from "../api/apiSlice";

export const subscriberTasksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriberTasks: builder.query({
            query: () => ({
                url: "api/subscriber/organization/tasks",
                method: "GET",
            }),
            providesTags: ["Tasks"],
            transformResponse: (response) => response.data || response,
        }),
        createSubscriberTask: builder.mutation({
            query: (newTask) => ({
                url: "api/subscriber/organization/tasks",
                method: "POST",
                body: newTask,
            }),
            invalidatesTags: ["Tasks"],
        }),
        deleteSubscriberTask: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tasks"],
        }),
        getSubscriberTaskDetails: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/tasks/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Tasks", id }],
            transformResponse: (response) => response.data || response,
        }),
        updateSubscriberTask: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `api/subscriber/organization/tasks/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Tasks", { type: "Tasks", id }],
        }),
        getSubscriberTaskStatisticsStatus: builder.query({
            query: () => ({
                url: "api/subscriber/organization/tasks/statistics/status",
                method: "GET",
            }),
            providesTags: ["Tasks"],
        }),
        addSubscriberTaskComment: builder.mutation({
            query: ({ taskId, text }) => ({
                url: `api/subscriber/organization/tasks/${taskId}/comments`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }],
        }),
        deleteSubscriberTaskComment: builder.mutation({
            query: ({ taskId, commentId }) => ({
                url: `api/subscriber/organization/tasks/${taskId}/comments/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }],
        }),
        editSubscriberTaskComment: builder.mutation({
            query: ({ taskId, commentId, text }) => ({
                url: `api/subscriber/organization/tasks/${taskId}/comments/${commentId}`,
                method: "PUT",
                body: { text },
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }],
        }),
        evaluateSubscriberTaskStage: builder.mutation({
            query: ({ taskId, stageId, data }) => ({
                url: `api/subscriber/tasks/${taskId}/stages/${stageId}/evaluate`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", "Projects", { type: "Tasks", id: taskId }],
        }),
        evaluateSubscriberTask: builder.mutation({
            query: ({ taskId, data }) => ({
                url: `api/subscriber/tasks/${taskId}/evaluate`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", "Projects", { type: "Tasks", id: taskId }],
        }),
        uploadSubscriberTaskAttachment: builder.mutation({
            query: ({ taskId, formData }) => ({
                url: `api/subscriber/organization/tasks/${taskId}/upload`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }],
        }),
        deleteSubscriberTaskAttachment: builder.mutation({
            query: ({ taskId, attachmentId }) => ({
                url: `api/subscriber/organization/tasks/${taskId}/upload/${attachmentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }],
        }),
    }),
});

export const {
    useGetSubscriberTasksQuery,
    useCreateSubscriberTaskMutation,
    useDeleteSubscriberTaskMutation,
    useGetSubscriberTaskDetailsQuery,
    useUpdateSubscriberTaskMutation,
    useGetSubscriberTaskStatisticsStatusQuery,
    useAddSubscriberTaskCommentMutation,
    useDeleteSubscriberTaskCommentMutation,
    useEditSubscriberTaskCommentMutation,
    useEvaluateSubscriberTaskStageMutation,
    useEvaluateSubscriberTaskMutation,
    useUploadSubscriberTaskAttachmentMutation,
    useDeleteSubscriberTaskAttachmentMutation,
} = subscriberTasksApi;
