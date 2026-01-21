import { apiSlice } from "../api/apiSlice";

export const organizationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrganizations: builder.query({
            query: (params) => ({
                url: "api/admin/organizations",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Organizations"],
        }),
    }),
});

export const {
    useGetOrganizationsQuery,
} = organizationsApi;
