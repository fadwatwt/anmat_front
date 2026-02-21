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
                method: "PATCH",
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
        getNewEmployees: builder.query({
            query: () => ({
                url: "api/subscriber/organization/employees/new",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Employees"],
        }),
        createEmployeeDetail: builder.mutation({
            query: (data) => ({
                url: "api/subscriber/organization/employees/detail",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Employees"],
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useToggleEmployeeActivityMutation,
    useInviteEmployeeMutation,
    useGetNewEmployeesQuery,
    useCreateEmployeeDetailMutation,
} = employeesApi;
