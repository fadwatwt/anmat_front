import { apiSlice } from "../api/apiSlice";

export const employeesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployees: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/employees",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Employees"],
        }),
        createEmployee: builder.mutation({
            query: (newEmployee) => ({
                url: "api/subscriber/organization/employees",
                method: "POST",
                body: newEmployee,
            }),
            invalidatesTags: ["Employees"],
        }),
        updateEmployee: builder.mutation({
            query: ({ id, ...updatedEmployee }) => ({
                url: `api/subscriber/organization/employees/${id}`,
                method: "PUT",
                body: updatedEmployee,
            }),
            invalidatesTags: ["Employees"],
        }),
        deleteEmployee: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/employees/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Employees"],
        }),
        cancelEmployeeInvitation: builder.mutation({
            query: (invitationId) => ({
                url: `api/subscriber/employee-invitations/${invitationId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Employees"],
        }),
        deleteManyEmployees: builder.mutation({
            query: (ids) => ({
                url: "api/subscriber/organization/employees/delete-many",
                method: "POST",
                body: { ids },
            }),
            invalidatesTags: ["Employees", "Departments", "Projects"],
        }),
        toggleEmployeeActivity: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/employees/${id}/toggle-activity`,
                method: "PUT",
            }),
            invalidatesTags: ["Employees"],
        }),
        inviteEmployee: builder.mutation({
            query: (data) => ({
                url: "api/subscriber/employee-invitations",
                method: "POST",
                body: data,
            }),
        }),
        createEmployeeInvitationShareLink: builder.mutation({
            query: (invitationId) => ({
                url: `api/subscriber/employee-invitations/${invitationId}/share-link`,
                method: "POST",
            }),
        }),
        getNewEmployees: builder.query({
            query: () => ({
                url: "api/subscriber/organization/employees/new",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Employees"],
        }),
        getEmployeeProfile: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/employees/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "Employees", id }],
        }),
        getEmploymentHistory: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/employees/${id}/employment-history`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "Employees", id: `history-${id}` }],
        }),
        createEmployeeDetail: builder.mutation({
            query: (data) => ({
                url: "api/subscriber/organization/employees/detail",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Employees"],
        }),
        getInvitationInfo: builder.query({
            query: (token) => ({
                url: `api/employee-invitations/info/${token}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getEmployeeDocuments: builder.query({
            query: (employeeId) => ({
                url: `api/subscriber/organization/employees/${employeeId}/documents`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, employeeId) => [
                { type: "EmployeeDocuments", id: employeeId },
            ],
        }),
        uploadEmployeeDocument: builder.mutation({
            query: ({ employeeId, formData }) => ({
                url: `api/subscriber/organization/employees/${employeeId}/documents`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { employeeId }) => [
                "EmployeeDocuments",
                { type: "EmployeeDocuments", id: employeeId },
                { type: "Employees", id: employeeId },
            ],
        }),
        deleteEmployeeDocument: builder.mutation({
            query: ({ employeeId, attachmentId }) => ({
                url: `api/subscriber/organization/employees/${employeeId}/documents/${attachmentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { employeeId }) => [
                "EmployeeDocuments",
                { type: "EmployeeDocuments", id: employeeId },
                { type: "Employees", id: employeeId },
            ],
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useCancelEmployeeInvitationMutation,
    useDeleteManyEmployeesMutation,
    useToggleEmployeeActivityMutation,
    useInviteEmployeeMutation,
    useCreateEmployeeInvitationShareLinkMutation,
    useGetNewEmployeesQuery,
    useCreateEmployeeDetailMutation,
    useGetEmployeeProfileQuery,
    useGetEmploymentHistoryQuery,
    useGetInvitationInfoQuery,
    useGetEmployeeDocumentsQuery,
    useUploadEmployeeDocumentMutation,
    useDeleteEmployeeDocumentMutation,
} = employeesApi;
