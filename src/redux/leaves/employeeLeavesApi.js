import { apiSlice } from "../api/apiSlice";

export const employeeLeavesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get the authenticated employee's own leave records
        getMyLeaves: builder.query({
            query: (params) => ({
                url: "api/employee/leaves",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Leaves"],
        }),
    }),
});

export const {
    useGetMyLeavesQuery,
} = employeeLeavesApi;
