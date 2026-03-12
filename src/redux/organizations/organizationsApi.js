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
        createOrganizationForSubscriber: builder.mutation({
            query: (newOrg) => ({
                url: "api/subscriber/organizations",
                method: "POST",
                body: newOrg,
            }),
            invalidatesTags: ["Organizations"],
        }),
        getSubscriberOrganization: builder.query({
            query: () => ({
                url: "api/subscriber/organization",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Organizations"],
        }),
    }),
});

export const {
    useGetOrganizationsQuery,
    useCreateOrganizationForSubscriberMutation,
    useGetSubscriberOrganizationQuery,
} = organizationsApi;
