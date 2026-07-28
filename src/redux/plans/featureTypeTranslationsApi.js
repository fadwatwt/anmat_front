import { apiSlice } from "../api/apiSlice";

export const featureTypeTranslationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFeatureTypeTranslations: builder.query({
            query: (featureTypeId) => ({
                url: `api/admin/subscription-feature-types/${featureTypeId}/translations`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, featureTypeId) => [
                { type: "FeatureTypeTranslations", id: featureTypeId },
            ],
        }),
        createFeatureTypeTranslation: builder.mutation({
            query: ({ featureTypeId, ...body }) => ({
                url: `api/admin/subscription-feature-types/${featureTypeId}/translations`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { featureTypeId }) => [
                { type: "FeatureTypeTranslations", id: featureTypeId },
            ],
        }),
        updateFeatureTypeTranslation: builder.mutation({
            query: ({ featureTypeId, locale, ...body }) => ({
                url: `api/admin/subscription-feature-types/${featureTypeId}/translations/${locale}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { featureTypeId }) => [
                { type: "FeatureTypeTranslations", id: featureTypeId },
            ],
        }),
        deleteFeatureTypeTranslation: builder.mutation({
            query: ({ featureTypeId, locale }) => ({
                url: `api/admin/subscription-feature-types/${featureTypeId}/translations/${locale}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { featureTypeId }) => [
                { type: "FeatureTypeTranslations", id: featureTypeId },
            ],
        }),
    }),
});

export const {
    useGetFeatureTypeTranslationsQuery,
    useCreateFeatureTypeTranslationMutation,
    useUpdateFeatureTypeTranslationMutation,
    useDeleteFeatureTypeTranslationMutation,
} = featureTypeTranslationsApi;
