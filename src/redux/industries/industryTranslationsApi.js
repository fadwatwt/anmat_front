import { apiSlice } from "../api/apiSlice";

export const industryTranslationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getIndustryTranslations: builder.query({
            query: (industryId) => ({
                url: `api/admin/industries/${industryId}/translations`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, industryId) => [
                { type: "IndustryTranslations", id: industryId },
            ],
        }),
        createIndustryTranslation: builder.mutation({
            query: ({ industryId, ...body }) => ({
                url: `api/admin/industries/${industryId}/translations`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { industryId }) => [
                { type: "IndustryTranslations", id: industryId },
            ],
        }),
        updateIndustryTranslation: builder.mutation({
            query: ({ industryId, locale, ...body }) => ({
                url: `api/admin/industries/${industryId}/translations/${locale}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { industryId }) => [
                { type: "IndustryTranslations", id: industryId },
            ],
        }),
        deleteIndustryTranslation: builder.mutation({
            query: ({ industryId, locale }) => ({
                url: `api/admin/industries/${industryId}/translations/${locale}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { industryId }) => [
                { type: "IndustryTranslations", id: industryId },
            ],
        }),
    }),
});

export const {
    useGetIndustryTranslationsQuery,
    useCreateIndustryTranslationMutation,
    useUpdateIndustryTranslationMutation,
    useDeleteIndustryTranslationMutation,
} = industryTranslationsApi;
