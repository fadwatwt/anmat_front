import { apiSlice } from "../api/apiSlice";

export const employeeProjectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get the authenticated employee's own projects
        getMyProjects: builder.query({
            query: () => ({
                url: "api/employee/projects",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Projects"],
        }),
    }),
});

export const {
    useGetMyProjectsQuery,
} = employeeProjectsApi;
