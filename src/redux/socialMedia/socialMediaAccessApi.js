// Social media platform access management for subscribers.
// Uses the anmat backend (RootRoute) via the shared apiSlice.
import { apiSlice } from "../api/apiSlice";

export const socialMediaAccessApi = apiSlice.enhanceEndpoints({ addTagTypes: ["SocialMediaAccess"] }).injectEndpoints({
    endpoints: (builder) => ({
        getMySocialMediaAccess: builder.query({
            query: () => ({ url: "api/user/auth/me", method: "GET" }),
            transformResponse: (response) => response?.data || response,
            providesTags: ["SocialMediaAccess"],
        }),
        // Admin: read the platforms (account types) granted to a subscriber.
        getSubscriberSocialMediaAccess: builder.query({
            query: (subscriberId) => ({
                url: `api/admin/subscribers/${subscriberId}/social-media-access`,
                method: "GET",
            }),
            transformResponse: (response) => response?.data || response,
            providesTags: (result, error, id) => [{ type: "SocialMediaAccess", id }],
        }),
        // Admin: grant (granted=true) or revoke (granted=false) a platform for a subscriber.
        updateSubscriberSocialMediaAccess: builder.mutation({
            query: ({ subscriberId, platforms, granted }) => ({
                url: `api/admin/subscribers/${subscriberId}/social-media-access`,
                method: "PATCH",
                body: { platforms, granted },
            }),
            transformResponse: (response) => response?.data || response,
            invalidatesTags: (result, error, { subscriberId }) => [
                "SocialMediaAccess",
                { type: "SocialMediaAccess", id: subscriberId },
            ],
        }),
    }),
});

export const {
    useGetMySocialMediaAccessQuery,
    useGetSubscriberSocialMediaAccessQuery,
    useUpdateSubscriberSocialMediaAccessMutation,
} = socialMediaAccessApi;
