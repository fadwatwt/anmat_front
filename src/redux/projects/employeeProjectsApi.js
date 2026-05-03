import { apiSlice } from "../api/apiSlice";

export const employeeProjectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get the authenticated employee's own projects
        getMyProjects: builder.query({
            query: () => ({
                url: "api/employee/projects",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Projects"],
        }),
        getEmployeeProjectDetails: builder.query({
            query: (id) => ({
                url: `api/employee/projects/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [
                { type: "Projects", id: result?._id || id },
                { type: "Projects", id },
                "Projects"
            ],
        }),
        addEmployeeProjectComment: builder.mutation({
            query: ({ projectId, text }) => ({
                url: `api/employee/projects/${projectId}/comments`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }, "ActivityLogs"],
        }),
        editEmployeeProjectComment: builder.mutation({
            query: ({ projectId, commentId, text }) => ({
                url: `api/employee/projects/${projectId}/comments/${commentId}`,
                method: "PUT",
                body: { text },
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }, "ActivityLogs"],
        }),
        deleteEmployeeProjectComment: builder.mutation({
            query: ({ projectId, commentId }) => ({
                url: `api/employee/projects/${projectId}/comments/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }, "ActivityLogs"],
        }),
        uploadEmployeeProjectAttachment: builder.mutation({
            query: ({ projectId, formData }) => ({
                url: `api/employee/projects/${projectId}/upload`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }, "ActivityLogs"],
        }),
        deleteEmployeeProjectAttachment: builder.mutation({
            query: ({ projectId, attachmentId }) => ({
                url: `api/employee/projects/${projectId}/upload/${attachmentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }, "ActivityLogs"],
        }),
        evaluateEmployeeProject: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `api/subscriber/organization/projects/${projectId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => ["Projects", { type: "Projects", id: projectId }, "ActivityLogs"],
        }),
    }),
});

export const {
    useGetMyProjectsQuery,
    useGetEmployeeProjectDetailsQuery,
    useAddEmployeeProjectCommentMutation,
    useEditEmployeeProjectCommentMutation,
    useDeleteEmployeeProjectCommentMutation,
    useUploadEmployeeProjectAttachmentMutation,
    useDeleteEmployeeProjectAttachmentMutation,
    useEvaluateEmployeeProjectMutation,
} = employeeProjectsApi;
