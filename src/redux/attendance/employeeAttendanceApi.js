import { apiSlice } from "../api/apiSlice";

export const employeeAttendanceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get the authenticated employee's own attendance records
        getMyAttendances: builder.query({
            query: (params) => ({
                url: "api/employee/attendances",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Attendances"],
        }),

        // Check in – creates a new attendance record with the current time as start_time
        checkIn: builder.mutation({
            query: ({ start_time }) => ({
                url: "api/employee/attendances/check-in",
                method: "POST",
                body: { start_time },
            }),
            invalidatesTags: ["Attendances"],
        }),

        // Check out – updates the current open attendance record
        checkOut: builder.mutation({
            query: ({ end_time }) => ({
                url: "api/employee/attendances/check-out",
                method: "PUT",
                body: { end_time },
            }),
            invalidatesTags: ["Attendances"],
        }),
    }),
});

export const {
    useGetMyAttendancesQuery,
    useCheckInMutation,
    useCheckOutMutation,
} = employeeAttendanceApi;
