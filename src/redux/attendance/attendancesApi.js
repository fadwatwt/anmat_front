import { apiSlice } from "../api/apiSlice";

export const attendancesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAttendances: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/attendances",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Attendances"],
        }),
        createAttendance: builder.mutation({
            query: (newAttendance) => ({
                url: "api/subscriber/organization/attendances",
                method: "POST",
                body: newAttendance,
            }),
            invalidatesTags: ["Attendances"],
        }),
        updateAttendance: builder.mutation({
            query: ({ id, ...updatedAttendance }) => ({
                url: `api/subscriber/organization/attendances/${id}`,
                method: "PATCH",
                body: updatedAttendance,
            }),
            invalidatesTags: ["Attendances"],
        }),
        deleteAttendance: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/attendances/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Attendances"],
        }),
    }),
});

export const {
    useGetAttendancesQuery,
    useCreateAttendanceMutation,
    useUpdateAttendanceMutation,
    useDeleteAttendanceMutation,
} = attendancesApi;
