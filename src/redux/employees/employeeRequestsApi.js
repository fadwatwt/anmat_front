import { apiSlice } from "../api/apiSlice";

export const employeeRequestsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployeeRequests: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/employees-requests",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["EmployeeRequests"],
        }),
        updateEmployeeRequestStatus: builder.mutation({
            query: ({ id, status, comment }) => ({
                url: `api/subscriber/organization/employees-requests/${id}/status`,
                method: "PUT",
                body: { status, comment },
            }),
            invalidatesTags: ["EmployeeRequests"],
        }),
        deleteEmployeeRequest: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/employees-requests/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["EmployeeRequests"],
        }),
        restoreEmployeeRequest: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/employees-requests/${id}/restore`,
                method: "PUT",
            }),
            invalidatesTags: ["EmployeeRequests"],
        }),
        getRequestAttachments: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/employees-requests/${id}/attachments`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => ["EmployeeRequests", { type: "RequestAttachments", id }],
        }),
        uploadRequestAttachment: builder.mutation({
            query: ({ id, formData }) => ({
                url: `api/subscriber/organization/employees-requests/${id}/attachments`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => ["EmployeeRequests", { type: "RequestAttachments", id }],
        }),
        deleteRequestAttachment: builder.mutation({
            query: ({ id, attachmentId }) => ({
                url: `api/subscriber/organization/employees-requests/${id}/attachments/${attachmentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { id }) => ["EmployeeRequests", { type: "RequestAttachments", id }],
        }),
    }),
});

export const {
    useGetEmployeeRequestsQuery,
    useUpdateEmployeeRequestStatusMutation,
    useDeleteEmployeeRequestMutation,
    useRestoreEmployeeRequestMutation,
    useGetRequestAttachmentsQuery,
    useUploadRequestAttachmentMutation,
    useDeleteRequestAttachmentMutation,
} = employeeRequestsApi;
