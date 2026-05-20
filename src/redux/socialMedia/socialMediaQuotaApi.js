// Quota API uses the anmat backend (RootRoute), so we inject endpoints into
// the existing apiSlice and let it share the token + tag invalidation.
import { apiSlice } from "../api/apiSlice";

export const socialMediaQuotaApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Quota for the currently authenticated subscriber/employee.
        getMySocialMediaQuota: builder.query({
            query: () => ({
                url: "api/subscriber/social-media-quota",
                method: "GET",
            }),
            transformResponse: (response) => response?.data || response,
            providesTags: ["SocialMediaQuota"],
        }),
        // Admin: read another subscriber's quota.
        getSubscriberSocialMediaQuota: builder.query({
            query: (subscriberId) => ({
                url: `api/admin/subscribers/${subscriberId}/social-media-quota`,
                method: "GET",
            }),
            transformResponse: (response) => response?.data || response,
            providesTags: (result, error, id) => [{ type: "SocialMediaQuota", id }],
        }),
        // Admin: override / reset a subscriber's quota.
        updateSubscriberSocialMediaQuota: builder.mutation({
            query: ({ subscriberId, limit, unlimited, reset }) => ({
                url: `api/admin/subscribers/${subscriberId}/social-media-quota`,
                method: "PATCH",
                body: { limit, unlimited, reset },
            }),
            invalidatesTags: (result, error, { subscriberId }) => [
                "SocialMediaQuota",
                { type: "SocialMediaQuota", id: subscriberId },
            ],
        }),
    }),
});

export const {
    useGetMySocialMediaQuotaQuery,
    useGetSubscriberSocialMediaQuotaQuery,
    useUpdateSubscriberSocialMediaQuotaMutation,
} = socialMediaQuotaApi;
