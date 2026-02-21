import { apiSlice } from "../api/apiSlice";

export const employeeAuthRequestsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployeeAuthRequests: builder.query({
            query: (params) => ({
                url: "api/employee/employee-requests",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["EmployeeRequests"],
        }),
        createEmployeeRequest: builder.mutation({
            query: (body) => ({
                url: "api/employee/employee-requests",
                method: "POST",
                body,
            }),
            invalidatesTags: ["EmployeeRequests"],
        }),
        cancelEmployeeRequest: builder.mutation({
            query: (id) => ({
                url: `api/employee/employee-requests/${id}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: ["EmployeeRequests"],
        }),
        updateEmployeeDetail: builder.mutation({
            query: (data) => ({
                url: "api/employee/details",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useGetEmployeeAuthRequestsQuery,
    useCreateEmployeeRequestMutation,
    useCancelEmployeeRequestMutation,
    useUpdateEmployeeDetailMutation,
} = employeeAuthRequestsApi;
