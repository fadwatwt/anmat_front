import { apiSlice } from "../api/apiSlice";

export const industriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getIndustries: builder.query({
            query: () => ({
                url: "api/admin/industries",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Industries"],
        }),
        createIndustry: builder.mutation({
            query: (newIndustry) => ({
                url: "api/admin/industries",
                method: "POST",
                body: newIndustry,
            }),
            invalidatesTags: ["Industries"],
        }),
        updateIndustry: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `api/admin/industries/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Industries"],
        }),
        deleteIndustry: builder.mutation({
            query: (id) => ({
                url: `api/admin/industries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Industries"],
        }),
        getIndustriesOrganizationsCount: builder.query({
            query: () => ({
                url: "api/admin/industries/organizations-count",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Industries"],
        }),
        getIndustriesForSubscribers: builder.query({
            query: () => ({
                url: "api/subscriber/industries",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Industries"],
        }),
    }),
});

export const {
    useGetIndustriesQuery,
    useCreateIndustryMutation,
    useUpdateIndustryMutation,
    useDeleteIndustryMutation,
    useGetIndustriesOrganizationsCountQuery,
    useGetIndustriesForSubscribersQuery,
} = industriesApi;
