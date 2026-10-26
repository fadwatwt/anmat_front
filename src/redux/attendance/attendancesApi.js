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
        getAttendanceCorrections: builder.query({
            query: () => ({ url: "api/subscriber/organization/attendance-corrections", method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: ["AttendanceCorrections"],
        }),
        getShiftAssignments: builder.query({
            query: (params) => ({ url: "api/subscriber/organization/shift-assignments", method: "GET", params }),
            transformResponse: (response) => response.data,
            providesTags: ["Attendances"],
        }),
        createShiftAssignment: builder.mutation({
            query: (body) => ({ url: "api/subscriber/organization/shift-assignments", method: "POST", body }),
            invalidatesTags: ["Attendances"],
        }),
        reviewAttendanceCorrection: builder.mutation({
            query: ({ id, ...body }) => ({ url: `api/subscriber/organization/attendance-corrections/${id}/review`, method: "PATCH", body }),
            invalidatesTags: ["AttendanceCorrections", "Attendances"],
        }),
    }),
});

export const {
    useGetAttendancesQuery,
    useCreateAttendanceMutation,
    useUpdateAttendanceMutation,
    useDeleteAttendanceMutation,
    useGetAttendanceCorrectionsQuery,
    useReviewAttendanceCorrectionMutation,
    useGetShiftAssignmentsQuery,
    useCreateShiftAssignmentMutation,
} = attendancesApi;
