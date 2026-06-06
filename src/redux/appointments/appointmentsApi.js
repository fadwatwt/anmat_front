import { apiSlice } from "../api/apiSlice";

export const appointmentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAppointments: builder.query({
            query: ({ date, status, category } = {}) => {
                const params = new URLSearchParams();
                if (date) params.append("date", date);
                if (status) params.append("status", status);
                if (category) params.append("category", category);
                const queryString = params.toString();
                return {
                    url: `api/subscriber/organization/appointments${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Appointments"],
            transformResponse: (response) => response.data || response,
        }),

        getTodayAppointments: builder.query({
            query: () => ({
                url: "api/subscriber/organization/appointments/today",
                method: "GET",
            }),
            providesTags: ["Appointments"],
            transformResponse: (response) => response.data || response,
        }),

        getWeekAppointments: builder.query({
            query: () => ({
                url: "api/subscriber/organization/appointments/week",
                method: "GET",
            }),
            providesTags: ["Appointments"],
            transformResponse: (response) => response.data || response,
        }),

        getCountdownAppointments: builder.query({
            query: () => ({
                url: "api/subscriber/organization/appointments/countdown",
                method: "GET",
            }),
            providesTags: ["Appointments"],
            transformResponse: (response) => response.data || response,
        }),

        getAppointmentDetails: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/appointments/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Appointments", id }],
            transformResponse: (response) => response.data || response,
        }),

        createAppointment: builder.mutation({
            query: (newAppointment) => ({
                url: "api/subscriber/organization/appointments",
                method: "POST",
                body: newAppointment,
            }),
            invalidatesTags: ["Appointments", "Tasks"],
        }),

        linkTaskToAppointment: builder.mutation({
            query: ({ appointmentId, taskId }) => ({
                url: `api/subscriber/organization/appointments/${appointmentId}`,
                method: "PUT",
                body: { task_id: taskId },
            }),
            invalidatesTags: ["Appointments", "Tasks"],
        }),

        unlinkTaskFromAppointment: builder.mutation({
            query: (appointmentId) => ({
                url: `api/subscriber/organization/appointments/${appointmentId}`,
                method: "PUT",
                body: { task_id: null },
            }),
            invalidatesTags: ["Appointments", "Tasks"],
        }),

        updateAppointment: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `api/subscriber/organization/appointments/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Appointments", { type: "Appointments", id }],
        }),

        deleteAppointment: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/appointments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Appointments"],
        }),

        completeAppointment: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/appointments/${id}/complete`,
                method: "PATCH",
            }),
            invalidatesTags: ["Appointments"],
        }),

        cancelAppointment: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/appointments/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["Appointments"],
        }),

        // Employee endpoints
        getEmployeeAppointments: builder.query({
            query: ({ date, status, category } = {}) => {
                const params = new URLSearchParams();
                if (date) params.append("date", date);
                if (status) params.append("status", status);
                if (category) params.append("category", category);
                const queryString = params.toString();
                return {
                    url: `api/employee/appointments${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Appointments"],
            transformResponse: (response) => response.data || response,
        }),

        createEmployeeAppointment: builder.mutation({
            query: (newAppointment) => ({
                url: "api/employee/appointments",
                method: "POST",
                body: newAppointment,
            }),
            invalidatesTags: ["Appointments"],
        }),

        getEmployeeAppointmentDetails: builder.query({
            query: (id) => ({
                url: `api/employee/appointments/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Appointments", id }],
            transformResponse: (response) => response.data || response,
        }),

        updateEmployeeAppointment: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `api/employee/appointments/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Appointments", { type: "Appointments", id }],
        }),

        deleteEmployeeAppointment: builder.mutation({
            query: (id) => ({
                url: `api/employee/appointments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Appointments"],
        }),
    }),
});

export const {
    useGetAppointmentsQuery,
    useGetTodayAppointmentsQuery,
    useGetWeekAppointmentsQuery,
    useGetCountdownAppointmentsQuery,
    useGetAppointmentDetailsQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    useCompleteAppointmentMutation,
    useCancelAppointmentMutation,
    useLinkTaskToAppointmentMutation,
    useUnlinkTaskFromAppointmentMutation,
    useGetEmployeeAppointmentsQuery,
    useCreateEmployeeAppointmentMutation,
    useGetEmployeeAppointmentDetailsQuery,
    useUpdateEmployeeAppointmentMutation,
    useDeleteEmployeeAppointmentMutation,
} = appointmentsApi;
