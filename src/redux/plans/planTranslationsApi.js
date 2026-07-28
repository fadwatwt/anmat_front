import { apiSlice } from "../api/apiSlice";

export const planTranslationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlanTranslations: builder.query({
            query: (planId) => ({
                url: `api/admin/subscription-plans/${planId}/translations`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, planId) => [
                { type: "PlanTranslations", id: planId },
            ],
        }),
        getPlanTranslationByLocale: builder.query({
            query: ({ planId, locale }) => ({
                url: `api/admin/subscription-plans/${planId}/translations/${locale}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, { planId }) => [
                { type: "PlanTranslations", id: planId },
            ],
        }),
        createPlanTranslation: builder.mutation({
            query: ({ planId, ...body }) => ({
                url: `api/admin/subscription-plans/${planId}/translations`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { planId }) => [
                { type: "PlanTranslations", id: planId },
            ],
        }),
        updatePlanTranslation: builder.mutation({
            query: ({ planId, locale, ...body }) => ({
                url: `api/admin/subscription-plans/${planId}/translations/${locale}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { planId }) => [
                { type: "PlanTranslations", id: planId },
            ],
        }),
        deletePlanTranslation: builder.mutation({
            query: ({ planId, locale }) => ({
                url: `api/admin/subscription-plans/${planId}/translations/${locale}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { planId }) => [
                { type: "PlanTranslations", id: planId },
            ],
        }),
    }),
});

export const {
    useGetPlanTranslationsQuery,
    useGetPlanTranslationByLocaleQuery,
    useCreatePlanTranslationMutation,
    useUpdatePlanTranslationMutation,
    useDeletePlanTranslationMutation,
} = planTranslationsApi;
