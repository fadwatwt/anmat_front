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
            invalidatesTags: ["Leaves"],
        }),
        updateLeave: builder.mutation({
            query: ({ id, ...updatedLeave }) => ({
                url: `api/subscriber/organization/leaves/${id}`,
                method: "PATCH",
                body: updatedLeave,
            }),
            invalidatesTags: ["Leaves"],
        }),
        deleteLeave: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/leaves/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Leaves"],
        }),
    }),
});

export const {
    useGetLeavesQuery,
    useCreateLeaveMutation,
    useUpdateLeaveMutation,
    useDeleteLeaveMutation,
} = leavesApi;
