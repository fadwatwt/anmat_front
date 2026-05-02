import { apiSlice } from "../api/apiSlice";

export const subscriberProjectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriberProjects: builder.query({
            query: () => ({
                url: "api/subscriber/organization/projects",
                method: "GET",
            }),
            providesTags: ["Projects"],
            transformResponse: (response) => response.data || response,
        }),
        getSubscriberProjectDetails: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/projects/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Projects", id }],
            transformResponse: (response) => response.data || response,
        }),
        createSubscriberProject: builder.mutation({
            query: (newProject) => ({
                url: "api/subscriber/organization/projects",
                method: "POST",
                body: newProject,
            }),
            invalidatesTags: ["Projects"],
        }),
        updateSubscriberProject: builder.mutation({
            query: ({ id, data }) => ({
                url: `api/subscriber/organization/projects/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Projects", { type: "Projects", id }],
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
    }),
});

export const {
    useGetSubscriberProjectsQuery,
    useGetSubscriberProjectDetailsQuery,
    useCreateSubscriberProjectMutation,
    useUpdateSubscriberProjectMutation,
    useDeleteSubscriberProjectMutation,
    useAddSubscriberProjectCommentMutation,
    useEditSubscriberProjectCommentMutation,
    useDeleteSubscriberProjectCommentMutation,
    useUploadSubscriberProjectAttachmentMutation,
    useDeleteSubscriberProjectAttachmentMutation,
} = subscriberProjectsApi;
