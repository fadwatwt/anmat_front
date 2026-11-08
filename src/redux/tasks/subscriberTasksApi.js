import { apiSlice } from "../api/apiSlice";

export const subscriberTasksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriberTasks: builder.query({
            query: (filters) => ({
                url: "api/subscriber/organization/tasks",
                method: "GET",
                params: filters || undefined,
            }),
            providesTags: ["Tasks"],
            transformResponse: (response) => response.data || response,
        }),
        getSavedTaskFilters: builder.query({
            query: () => ({ url: "api/subscriber/organization/task-filters", method: "GET" }),
            providesTags: ["SavedTaskFilters"],
            transformResponse: (response) => response.data || response,
        }),
        saveTaskFilter: builder.mutation({
            query: (data) => ({ url: "api/subscriber/organization/task-filters", method: "POST", body: data }),
            invalidatesTags: ["SavedTaskFilters"],
        }),
        deleteSavedTaskFilter: builder.mutation({
            query: (id) => ({ url: `api/subscriber/organization/task-filters/${id}`, method: "DELETE" }),
            invalidatesTags: ["SavedTaskFilters"],
        }),
        getTaskRecurrences: builder.query({
            query: () => ({ url: "api/subscriber/organization/task-recurrences", method: "GET" }),
            providesTags: ["TaskRecurrences"],
            transformResponse: (response) => response.data || response,
        }),
        configureTaskRecurrence: builder.mutation({
            query: ({ taskId, ...data }) => ({ url: `api/subscriber/organization/task-recurrences/${taskId}`, method: "POST", body: data }),
            invalidatesTags: ["TaskRecurrences"],
        }),
        stopTaskRecurrence: builder.mutation({
            query: (taskId) => ({ url: `api/subscriber/organization/task-recurrences/${taskId}`, method: "DELETE" }),
            invalidatesTags: ["TaskRecurrences"],
        }),
        getTaskAutomations: builder.query({
            query: () => ({ url: "api/subscriber/organization/task-automations", method: "GET" }),
            providesTags: ["TaskAutomations"],
            transformResponse: (response) => response.data || response,
        }),
        getTaskAutomationHistory: builder.query({
            query: () => ({ url: "api/subscriber/organization/task-automations/history", method: "GET" }),
            providesTags: ["TaskAutomationHistory"],
            transformResponse: (response) => response.data || response,
        }),
        createTaskAutomation: builder.mutation({
            query: (data) => ({ url: "api/subscriber/organization/task-automations", method: "POST", body: data }),
            invalidatesTags: ["TaskAutomations"],
        }),
        stopTaskAutomation: builder.mutation({
            query: (id) => ({ url: `api/subscriber/organization/task-automations/${id}`, method: "DELETE" }),
            invalidatesTags: ["TaskAutomations"],
        }),
        getTaskWorkload: builder.query({
            query: (week) => ({
                url: "api/subscriber/organization/tasks/workload",
                method: "GET",
                params: week ? { week } : undefined,
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
            invalidatesTags: ["Tasks", "ActivityLogs"],
        }),
        deleteSubscriberTask: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tasks", "ActivityLogs"],
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
            invalidatesTags: (result, error, { id }) => ["Tasks", { type: "Tasks", id }, "ActivityLogs"],
        }),
        replaceTaskDependencies: builder.mutation({
            query: ({ id, blocked_by_ids }) => ({
                url: `api/subscriber/organization/tasks/${id}/dependencies`,
                method: "PUT",
                body: { blocked_by_ids },
            }),
            invalidatesTags: (result, error, { id }) => ["Tasks", { type: "Tasks", id }],
        }),
        getTaskDependencyGraph: builder.query({
            query: (id) => ({ url: `api/tasks/${id}/dependency-graph`, method: "GET" }),
            providesTags: ["Tasks"],
            transformResponse: (response) => response.data || response,
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
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }, "ActivityLogs"],
        }),
        deleteSubscriberTaskComment: builder.mutation({
            query: ({ taskId, commentId }) => ({
                url: `api/subscriber/organization/tasks/${taskId}/comments/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }, "ActivityLogs"],
        }),
        editSubscriberTaskComment: builder.mutation({
            query: ({ taskId, commentId, text }) => ({
                url: `api/subscriber/organization/tasks/${taskId}/comments/${commentId}`,
                method: "PUT",
                body: { text },
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }, "ActivityLogs"],
        }),
        evaluateSubscriberTaskStage: builder.mutation({
            query: ({ taskId, stageId, data }) => ({
                url: `api/subscriber/tasks/${taskId}/stages/${stageId}/evaluate`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", "Projects", { type: "Tasks", id: taskId }, "ActivityLogs"],
        }),
        evaluateSubscriberTask: builder.mutation({
            query: ({ taskId, data }) => ({
                url: `api/subscriber/tasks/${taskId}/evaluate`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", "Projects", { type: "Tasks", id: taskId }, "ActivityLogs"],
        }),
        uploadSubscriberTaskAttachment: builder.mutation({
            query: ({ taskId, formData }) => ({
                url: `api/subscriber/organization/tasks/${taskId}/upload`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }, "ActivityLogs"],
        }),
        deleteSubscriberTaskAttachment: builder.mutation({
            query: ({ taskId, attachmentId }) => ({
                url: `api/subscriber/organization/tasks/${taskId}/upload/${attachmentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }, "ActivityLogs"],
        }),
    }),
});

export const {
    useGetSubscriberTasksQuery,
    useGetSavedTaskFiltersQuery,
    useSaveTaskFilterMutation,
    useDeleteSavedTaskFilterMutation,
    useGetTaskRecurrencesQuery,
    useConfigureTaskRecurrenceMutation,
    useStopTaskRecurrenceMutation,
    useGetTaskAutomationsQuery,
    useGetTaskAutomationHistoryQuery,
    useCreateTaskAutomationMutation,
    useStopTaskAutomationMutation,
    useGetTaskWorkloadQuery,
    useCreateSubscriberTaskMutation,
    useDeleteSubscriberTaskMutation,
    useGetSubscriberTaskDetailsQuery,
    useUpdateSubscriberTaskMutation,
    useReplaceTaskDependenciesMutation,
    useGetTaskDependencyGraphQuery,
    useGetSubscriberTaskStatisticsStatusQuery,
    useAddSubscriberTaskCommentMutation,
    useDeleteSubscriberTaskCommentMutation,
    useEditSubscriberTaskCommentMutation,
    useEvaluateSubscriberTaskStageMutation,
    useEvaluateSubscriberTaskMutation,
    useUploadSubscriberTaskAttachmentMutation,
    useDeleteSubscriberTaskAttachmentMutation,
} = subscriberTasksApi;
