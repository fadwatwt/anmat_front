import { apiSlice } from "../api/apiSlice";

export const employeeLeavesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get the authenticated employee's own leave records
        getMyLeaves: builder.query({
            query: (params) => ({
                url: "api/employee/leaves",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Leaves"],
            refetchOnMountOrArgChange: true,
        }),

        // Create a new leave request as employee
        createMyLeave: builder.mutation({
            query: (newLeave) => ({
                url: "api/employee/leaves",
                method: "POST",
                body: newLeave,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Leaves", "EmployeeRequests"],
        }),

        // Update an existing leave request (only pending)
        updateMyLeave: builder.mutation({
            query: ({ id, ...updatedLeave }) => ({
                url: `api/employee/leaves/${id}`,
                method: "PATCH",
                body: updatedLeave,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Leaves", "EmployeeRequests"],
        }),

        // Delete a leave request (only pending)
        deleteMyLeave: builder.mutation({
            query: (id) => ({
                url: `api/employee/leaves/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["Leaves", "EmployeeRequests"],
        }),
    }),
});

export const {
    useGetMyLeavesQuery,
    useCreateMyLeaveMutation,
    useUpdateMyLeaveMutation,
    useDeleteMyLeaveMutation,
} = employeeLeavesApi;
