import { apiSlice } from "../api/apiSlice";

export const appointmentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAppointments: builder.query({
            query: ({ date, status, category, type } = {}) => {
                const params = new URLSearchParams();
                if (date) params.append("date", date);
                if (status) params.append("status", status);
                if (category) params.append("category", category);
                if (type) params.append("type", type);
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

        getMonthAppointments: builder.query({
            query: ({ year, month }) => ({
                url: `api/subscriber/organization/appointments/month/${year}/${month}`,
                method: "GET",
            }),
            providesTags: ["Appointments"],
            transformResponse: (response) => response.data || response,
        }),

        searchAppointments: builder.query({
            query: ({ search }) => ({
                url: `api/subscriber/organization/appointments/search?q=${encodeURIComponent(search)}`,
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

        addAppointmentNotes: builder.mutation({
            query: ({ id, notes }) => ({
                url: `api/subscriber/organization/appointments/${id}/notes`,
                method: "PATCH",
                body: { notes },
            }),
            invalidatesTags: (result, error, { id }) => ["Appointments", { type: "Appointments", id }],
        }),

        // Employee endpoints
        getEmployeeAppointments: builder.query({
            query: ({ date, status, category, type } = {}) => {
                const params = new URLSearchParams();
                if (date) params.append("date", date);
                if (status) params.append("status", status);
                if (category) params.append("category", category);
                if (type) params.append("type", type);
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

        getEmployeeMonthAppointments: builder.query({
            query: ({ year, month }) => ({
                url: `api/employee/appointments/month/${year}/${month}`,
                method: "GET",
            }),
            providesTags: ["Appointments"],
            transformResponse: (response) => response.data || response,
        }),

        searchEmployeeAppointments: builder.query({
            query: ({ search }) => ({
                url: `api/employee/appointments/search?q=${encodeURIComponent(search)}`,
                method: "GET",
            }),
            providesTags: ["Appointments"],
            transformResponse: (response) => response.data || response,
        }),

        addEmployeeAppointmentNotes: builder.mutation({
            query: ({ id, notes }) => ({
                url: `api/employee/appointments/${id}/notes`,
                method: "PATCH",
                body: { notes },
            }),
            invalidatesTags: (result, error, { id }) => ["Appointments", { type: "Appointments", id }],
        }),

        // Daily Tasks endpoints
        getDailyTasks: builder.query({
            query: ({ date, status, category, month } = {}) => {
                const params = new URLSearchParams();
                if (date) params.append("date", date);
                if (status) params.append("status", status);
                if (category) params.append("category", category);
                if (month) params.append("month", month);
                const queryString = params.toString();
                return {
                    url: `api/subscriber/organization/daily-tasks${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["DailyTasks"],
            transformResponse: (response) => response.data || response,
        }),

        getDailyTaskDetails: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/daily-tasks/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "DailyTasks", id }],
            transformResponse: (response) => response.data || response,
        }),

        createDailyTask: builder.mutation({
            query: (newTask) => ({
                url: "api/subscriber/organization/daily-tasks",
                method: "POST",
                body: newTask,
            }),
            invalidatesTags: ["DailyTasks"],
        }),

        updateDailyTask: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `api/subscriber/organization/daily-tasks/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["DailyTasks", { type: "DailyTasks", id }],
        }),

        deleteDailyTask: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/daily-tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DailyTasks"],
        }),

        completeDailyTask: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/daily-tasks/${id}/complete`,
                method: "PATCH",
            }),
            invalidatesTags: ["DailyTasks"],
        }),

        addDailyTaskNotes: builder.mutation({
            query: ({ id, notes }) => ({
                url: `api/subscriber/organization/daily-tasks/${id}/notes`,
                method: "PATCH",
                body: { notes },
            }),
            invalidatesTags: (result, error, { id }) => ["DailyTasks", { type: "DailyTasks", id }],
        }),

        getMonthDailyTasks: builder.query({
            query: ({ year, month }) => ({
                url: `api/subscriber/organization/daily-tasks/month/${year}/${month}`,
                method: "GET",
            }),
            providesTags: ["DailyTasks"],
            transformResponse: (response) => response.data || response,
        }),

        searchDailyTasks: builder.query({
            query: ({ search }) => ({
                url: `api/subscriber/organization/daily-tasks/search?q=${encodeURIComponent(search)}`,
                method: "GET",
            }),
            providesTags: ["DailyTasks"],
            transformResponse: (response) => response.data || response,
        }),

        // Employee Daily Tasks endpoints
        getEmployeeDailyTasks: builder.query({
            query: ({ date, status, category, month } = {}) => {
                const params = new URLSearchParams();
                if (date) params.append("date", date);
                if (status) params.append("status", status);
                if (category) params.append("category", category);
                if (month) params.append("month", month);
                const queryString = params.toString();
                return {
                    url: `api/employee/daily-tasks${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["DailyTasks"],
            transformResponse: (response) => response.data || response,
        }),

        createEmployeeDailyTask: builder.mutation({
            query: (newTask) => ({
                url: "api/employee/daily-tasks",
                method: "POST",
                body: newTask,
            }),
            invalidatesTags: ["DailyTasks"],
        }),

        updateEmployeeDailyTask: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `api/employee/daily-tasks/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["DailyTasks", { type: "DailyTasks", id }],
        }),

        deleteEmployeeDailyTask: builder.mutation({
            query: (id) => ({
                url: `api/employee/daily-tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DailyTasks"],
        }),

        completeEmployeeDailyTask: builder.mutation({
            query: (id) => ({
                url: `api/employee/daily-tasks/${id}/complete`,
                method: "PATCH",
            }),
            invalidatesTags: ["DailyTasks"],
        }),
    }),
});

export const {
    useGetAppointmentsQuery,
    useGetTodayAppointmentsQuery,
    useGetWeekAppointmentsQuery,
    useGetCountdownAppointmentsQuery,
    useGetMonthAppointmentsQuery,
    useSearchAppointmentsQuery,
    useGetAppointmentDetailsQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    useCompleteAppointmentMutation,
    useCancelAppointmentMutation,
    useLinkTaskToAppointmentMutation,
    useUnlinkTaskFromAppointmentMutation,
    useAddAppointmentNotesMutation,
    useGetEmployeeAppointmentsQuery,
    useCreateEmployeeAppointmentMutation,
    useGetEmployeeAppointmentDetailsQuery,
    useUpdateEmployeeAppointmentMutation,
    useDeleteEmployeeAppointmentMutation,
    useGetEmployeeMonthAppointmentsQuery,
    useSearchEmployeeAppointmentsQuery,
    useAddEmployeeAppointmentNotesMutation,
    useGetDailyTasksQuery,
    useGetDailyTaskDetailsQuery,
    useCreateDailyTaskMutation,
    useUpdateDailyTaskMutation,
    useDeleteDailyTaskMutation,
    useCompleteDailyTaskMutation,
    useAddDailyTaskNotesMutation,
    useGetMonthDailyTasksQuery,
    useSearchDailyTasksQuery,
    useGetEmployeeDailyTasksQuery,
    useCreateEmployeeDailyTaskMutation,
    useUpdateEmployeeDailyTaskMutation,
    useDeleteEmployeeDailyTaskMutation,
    useCompleteEmployeeDailyTaskMutation,
} = appointmentsApi;
