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
    }),
});

export const {
    useGetEmployeeRequestsQuery,
    useUpdateEmployeeRequestStatusMutation,
    useDeleteEmployeeRequestMutation,
} = employeeRequestsApi;
