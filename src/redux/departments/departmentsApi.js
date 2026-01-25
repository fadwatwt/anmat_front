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
            providesTags: ["Departments"],
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
    }),
});

export const {
    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
} = departmentsApi;
