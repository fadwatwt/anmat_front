import { apiSlice } from "../api/apiSlice";

export const subscriberProjectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriberProjects: builder.query({
            query: (filters) => ({
                url: "api/subscriber/organization/projects",
                method: "GET",
                params: filters || undefined,
            }),
            providesTags: ["Projects"],
            transformResponse: (response) => response.data || response,
        }),
        getSubscriberProjectDetails: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/projects/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [
                { type: "Projects", id: result?._id || id },
                { type: "Projects", id },
                "Projects"
            ],
            transformResponse: (response) => response.data || response,
        }),
        getProjectScheduleOverview: builder.query({
            query: () => ({ url: "api/subscriber/organization/project-schedules", method: "GET" }),
            providesTags: ["Projects"],
            transformResponse: (response) => response.data || response,
        }),
        createSubscriberProject: builder.mutation({
            query: (newProject) => ({
                url: "api/subscriber/organization/projects",
                method: "POST",
                body: newProject,
            }),
            invalidatesTags: ["Projects", "ActivityLogs"],
        }),
        updateSubscriberProject: builder.mutation({
            query: ({ id, data }) => ({
                url: `api/subscriber/organization/projects/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Projects", { type: "Projects", id }, "ActivityLogs"],
        }),
        bulkEstimateProjectTasks: builder.mutation({
            query: ({ id, estimates, apply }) => ({
                url: `api/subscriber/organization/projects/${id}/task-estimates`,
                method: "POST",
                body: { estimates, apply },
            }),
            invalidatesTags: (result, error, { id, apply }) => apply ? ["Projects", { type: "Projects", id }] : [],
        }),
        addSubscriberProjectComment: builder.mutation({
            query: ({ projectId, text }) => ({
                url: `api/subscriber/organization/projects/${projectId}/comments`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }],
        }),
        editSubscriberProjectComment: builder.mutation({
            query: ({ projectId, commentId, text }) => ({
                url: `api/subscriber/organization/projects/${projectId}/comments/${commentId}`,
                method: "PUT",
                body: { text },
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }],
        }),
        deleteSubscriberProjectComment: builder.mutation({
            query: ({ projectId, commentId }) => ({
                url: `api/subscriber/organization/projects/${projectId}/comments/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }],
        }),
        uploadSubscriberProjectAttachment: builder.mutation({
            query: ({ projectId, formData }) => ({
                url: `api/subscriber/organization/projects/${projectId}/upload`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }],
        }),
        deleteSubscriberProjectAttachment: builder.mutation({
            query: ({ projectId, attachmentId }) => ({
                url: `api/subscriber/organization/projects/${projectId}/upload/${attachmentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }],
        }),
        deleteSubscriberProject: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Projects", "ActivityLogs"],
        }),
        deleteManySubscriberProjects: builder.mutation({
            query: (ids) => ({
                url: "api/subscriber/organization/projects/delete-many",
                method: "POST",
                body: { ids },
            }),
            invalidatesTags: ["Projects", "ActivityLogs"],
        }),
    }),
});

export const {
    useGetSubscriberProjectsQuery,
    useGetSubscriberProjectDetailsQuery,
    useGetProjectScheduleOverviewQuery,
    useCreateSubscriberProjectMutation,
    useUpdateSubscriberProjectMutation,
    useBulkEstimateProjectTasksMutation,
    useDeleteSubscriberProjectMutation,
    useDeleteManySubscriberProjectsMutation,
    useAddSubscriberProjectCommentMutation,
    useEditSubscriberProjectCommentMutation,
    useDeleteSubscriberProjectCommentMutation,
    useUploadSubscriberProjectAttachmentMutation,
    useDeleteSubscriberProjectAttachmentMutation,
} = subscriberProjectsApi;
