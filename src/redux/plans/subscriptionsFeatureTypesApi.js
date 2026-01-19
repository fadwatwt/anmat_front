import { apiSlice } from "../api/apiSlice";

export const subscriptionsFeatureTypesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionFeatureTypes: builder.query({
            query: (filter) => ({
                url: "api/admin/subscriptions-feature-types",
                method: "GET",
                params: filter ? { filter } : {},
            }),
            transformResponse: (response) => response.data,
            providesTags: ["SubscriptionFeatureTypes"],
        }),
        getSubscriptionFeatureType: builder.query({
            query: (id) => ({
                url: `api/admin/subscriptions-feature-types/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "SubscriptionFeatureTypes", id }],
        }),
    }),
});

export const {
    useGetSubscriptionFeatureTypesQuery,
    useGetSubscriptionFeatureTypeQuery,
} = subscriptionsFeatureTypesApi;
