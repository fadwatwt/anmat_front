import { apiSlice } from "../api/apiSlice";

export const leavesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLeaves: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/leaves",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Leaves"],
        }),
        createLeave: builder.mutation({
            query: (newLeave) => ({
                url: "api/subscriber/organization/leaves",
                method: "POST",
                body: newLeave,
            }),
            invalidatesTags: ["Leaves", "EmployeeRequests"],
        }),
        updateLeave: builder.mutation({
            query: ({ id, ...updatedLeave }) => ({
                url: `api/subscriber/organization/leaves/${id}`,
                method: "PATCH",
                body: updatedLeave,
            }),
            invalidatesTags: ["Leaves", "EmployeeRequests"],
        }),
        deleteLeave: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/leaves/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Leaves", "EmployeeRequests"],
        }),
        getLeavePolicies: builder.query({
            query: () => ({ url: "api/subscriber/organization/leave-policies", method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: ["LeavePolicies"],
        }),
        createLeavePolicy: builder.mutation({
            query: (body) => ({ url: "api/subscriber/organization/leave-policies", method: "POST", body }),
            invalidatesTags: ["LeavePolicies"],
        }),
        getMyLeaveBalances: builder.query({
            query: () => ({ url: "api/employee/leave-balances", method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: ["LeaveBalances"],
        }),
        getEmployeeLeaveBalances: builder.query({
            query: (employeeId) => ({ url: `api/subscriber/organization/employees/${employeeId}/leave-balances`, method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, employeeId) => [{ type: "LeaveBalances", id: employeeId }],
        }),
        addLeaveBalanceEntry: builder.mutation({
            query: (body) => ({ url: "api/subscriber/organization/leave-balances/entries", method: "POST", body }),
            invalidatesTags: ["LeaveBalances"],
        }),
    }),
});

export const {
    useGetLeavesQuery,
    useCreateLeaveMutation,
    useUpdateLeaveMutation,
    useDeleteLeaveMutation,
    useGetLeavePoliciesQuery,
    useCreateLeavePolicyMutation,
    useGetMyLeaveBalancesQuery,
    useGetEmployeeLeaveBalancesQuery,
    useAddLeaveBalanceEntryMutation,
} = leavesApi;
