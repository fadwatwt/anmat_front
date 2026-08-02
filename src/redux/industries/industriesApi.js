import { apiSlice } from "../api/apiSlice";

const localeParams = (locale) =>
  locale ? { locale: locale.split('-')[0] } : undefined;

export const industriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getIndustries: builder.query({
            query: (locale) => ({
                url: "api/admin/industries",
                method: "GET",
                params: localeParams(locale),
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
            query: (locale) => ({
                url: "api/admin/industries/organizations-count",
                method: "GET",
                params: localeParams(locale),
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Industries"],
        }),
        getIndustriesForSubscribers: builder.query({
            query: (locale) => ({
                url: "api/subscriber/industries",
                method: "GET",
                params: localeParams(locale),
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
