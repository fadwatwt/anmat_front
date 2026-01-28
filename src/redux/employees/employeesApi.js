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
    }),
});

export const {
    useGetEmployeesQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useToggleEmployeeActivityMutation,
} = employeesApi;
