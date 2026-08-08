import { apiSlice } from "../api/apiSlice";

export const tokenPackageTranslationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTokenPackageTranslations: builder.query({
            query: (packageId) => ({
                url: `api/admin/token-packages/${packageId}/translations`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, packageId) => [
                { type: "TokenPackageTranslations", id: packageId },
            ],
        }),
        getTokenPackageTranslationByLocale: builder.query({
            query: ({ packageId, locale }) => ({
                url: `api/admin/token-packages/${packageId}/translations/${locale}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, { packageId }) => [
                { type: "TokenPackageTranslations", id: packageId },
            ],
        }),
        createTokenPackageTranslation: builder.mutation({
            query: ({ packageId, ...body }) => ({
                url: `api/admin/token-packages/${packageId}/translations`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { packageId }) => [
                { type: "TokenPackageTranslations", id: packageId },
            ],
        }),
        updateTokenPackageTranslation: builder.mutation({
            query: ({ packageId, locale, ...body }) => ({
                url: `api/admin/token-packages/${packageId}/translations/${locale}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { packageId }) => [
                { type: "TokenPackageTranslations", id: packageId },
            ],
        }),
        deleteTokenPackageTranslation: builder.mutation({
            query: ({ packageId, locale }) => ({
                url: `api/admin/token-packages/${packageId}/translations/${locale}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { packageId }) => [
                { type: "TokenPackageTranslations", id: packageId },
            ],
        }),
    }),
});

export const {
    useGetTokenPackageTranslationsQuery,
    useGetTokenPackageTranslationByLocaleQuery,
    useCreateTokenPackageTranslationMutation,
    useUpdateTokenPackageTranslationMutation,
    useDeleteTokenPackageTranslationMutation,
} = tokenPackageTranslationsApi;
