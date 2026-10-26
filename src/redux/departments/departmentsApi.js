import { apiSlice } from "../api/apiSlice";

export const departmentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDepartments: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/departments",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            // Department rows include live employee/project/task counters.
            // Refetch them whenever any of those source collections changes.
            providesTags: ["Departments", "Employees", "Projects", "Tasks"],
        }),
        createDepartment: builder.mutation({
            query: (newDept) => ({
                url: "api/subscriber/organization/departments",
                method: "POST",
                body: newDept,
            }),
            invalidatesTags: ["Departments"],
        }),
        updateDepartment: builder.mutation({
            query: ({ id, ...updatedDept }) => ({
                url: `api/subscriber/organization/departments/${id}`,
                method: "PUT",
                body: updatedDept,
            }),
            invalidatesTags: ["Departments"],
        }),
        assignEmployeesToDepartment: builder.mutation({
            query: ({ department_id, employeeIds }) => ({
                url: `api/subscriber/organization/departments/${department_id}/employees`,
                method: "PATCH",
                body: { employeeIds },
            }),
            invalidatesTags: ["Departments", "Employees"],
        }),
        unassignEmployeesFromDepartment: builder.mutation({
            query: ({ department_id, employeeIds }) => ({
                url: `api/subscriber/organization/departments/${department_id}/employees/unassign`,
                method: "PATCH",
                body: { employeeIds },
            }),
            invalidatesTags: ["Departments", "Employees"],
        }),
        deleteDepartment: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/departments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Departments"],
        }),
        deleteManyDepartments: builder.mutation({
            query: (ids) => ({
                url: "api/subscriber/organization/departments/delete-many",
                method: "POST",
                body: { ids },
            }),
            invalidatesTags: ["Departments", "Employees", "Projects"],
        }),
        getDepartmentProfile: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/departments/${id}/profile`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "Departments", id }],
        }),
        rateDepartment: builder.mutation({
            query: ({ id, ...ratingData }) => ({
                url: `api/subscriber/organization/departments/${id}/rate`,
                method: "POST",
                body: ratingData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Departments", id }],
        }),
    }),
});

export const {
    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useAssignEmployeesToDepartmentMutation,
    useUnassignEmployeesFromDepartmentMutation,
    useDeleteDepartmentMutation,
    useDeleteManyDepartmentsMutation,
    useGetDepartmentProfileQuery,
    useRateDepartmentMutation,
} = departmentsApi;
