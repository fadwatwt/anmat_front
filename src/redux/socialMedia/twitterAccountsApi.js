// RTK Query slice for the external tweetAPI service.
// Uses ExternalServer because tweetAPI lives on a different origin than the
// main anmat backend — we cannot reuse apiSlice's baseUrl, but we share the
// auth token so the anmat JWT is forwarded transparently.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ExternalServer } from "@/Root.Route";

export const twitterAccountsApi = createApi({
    reducerPath: "twitterAccountsApi",
    tagTypes: ["TwitterAccounts", "TwitterAccount", "AccountCategories"],
    baseQuery: fetchBaseQuery({
        baseUrl: ExternalServer,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token;
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getTwitterAccounts: builder.query({
            query: (params = {}) => {
                const search = new URLSearchParams();
                if (params.page) search.append("page", params.page);
                if (params.limit) search.append("limit", params.limit);
                if (params.Category) search.append("Category", params.Category);
                const qs = search.toString();
                return `/accounts/tweet${qs ? `?${qs}` : ""}`;
            },
            transformResponse: (response) => ({
                data: response?.data || [],
                results: response?.results || 0,
                pagination: response?.paginationResult || null,
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                          ...result.data.map((a) => ({ type: "TwitterAccount", id: a._id })),
                          { type: "TwitterAccounts", id: "LIST" },
                      ]
                    : [{ type: "TwitterAccounts", id: "LIST" }],
        }),
        getTwitterAccount: builder.query({
            query: (id) => `/accounts/${id}`,
            transformResponse: (response) => response?.data,
            providesTags: (result, error, id) => [{ type: "TwitterAccount", id }],
        }),
        getTwitterAccountsCount: builder.query({
            query: () => "/accounts/tweet/count",
            transformResponse: (response) => response?.data?.count ?? 0,
            providesTags: [{ type: "TwitterAccounts", id: "COUNT" }],
        }),
        createTwitterAccount: builder.mutation({
            query: (body) => ({
                url: "/accounts/tweet",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                { type: "TwitterAccounts", id: "LIST" },
                { type: "TwitterAccounts", id: "COUNT" },
            ],
        }),
        updateTwitterAccount: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/accounts/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "TwitterAccount", id },
                { type: "TwitterAccounts", id: "LIST" },
            ],
        }),
        deleteTwitterAccount: builder.mutation({
            query: (id) => ({
                url: `/accounts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                { type: "TwitterAccounts", id: "LIST" },
                { type: "TwitterAccounts", id: "COUNT" },
            ],
        }),
        deleteTwitterAccounts: builder.mutation({
            query: (ids) => ({
                url: "/accounts/delete/tweet",
                method: "POST",
                body: { ids },
            }),
            invalidatesTags: [
                { type: "TwitterAccounts", id: "LIST" },
                { type: "TwitterAccounts", id: "COUNT" },
            ],
        }),
        importTwitterAccounts: builder.mutation({
            query: (formData) => ({
                url: "/accounts/import/tweet",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [
                { type: "TwitterAccounts", id: "LIST" },
                { type: "TwitterAccounts", id: "COUNT" },
            ],
        }),
        getAccountCategories: builder.query({
            query: () => "/accountcategories",
            transformResponse: (response) => response?.data || [],
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                          ...result.map((c) => ({ type: "AccountCategories", id: c._id })),
                          { type: "AccountCategories", id: "LIST" },
                      ]
                    : [{ type: "AccountCategories", id: "LIST" }],
        }),
        createAccountCategory: builder.mutation({
            query: (body) => ({
                url: "/accountcategories",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "AccountCategories", id: "LIST" }],
        }),
        updateAccountCategory: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/accountcategories/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "AccountCategories", id },
                { type: "AccountCategories", id: "LIST" },
            ],
        }),
        deleteAccountCategory: builder.mutation({
            query: (id) => ({
                url: `/accountcategories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                { type: "AccountCategories", id: "LIST" },
                { type: "TwitterAccounts", id: "LIST" },
                { type: "TwitterAccounts", id: "COUNT" },
            ],
        }),
        // Twitter actions (post, follow, like, reply, ...) — bodies depend on the action.
        // Single-account post; multipart so we can attach images.
        postTweetSingle: builder.mutation({
            query: (formData) => ({
                url: "/methods/tweet",
                method: "POST",
                body: formData,
            }),
        }),
        // Bulk post across multiple accounts (CSV-driven; kept for parity).
        postTweet: builder.mutation({
            query: (body) => ({
                url: "/methods/tweetAccounts",
                method: "POST",
                body,
            }),
        }),
        submitTweetForApproval: builder.mutation({
            query: (body) => ({
                url: "/methods/tweetAccountsPublisher",
                method: "POST",
                body,
            }),
        }),
        deleteTweet: builder.mutation({
            query: (body) => ({
                url: "/methods/tweet/delete",
                method: "POST",
                body,
            }),
        }),
        likeTweet: builder.mutation({
            query: (body) => ({
                url: "/methods/like",
                method: "POST",
                body,
            }),
        }),
        unlikeTweet: builder.mutation({
            query: (body) => ({
                url: "/methods/like/delete",
                method: "POST",
                body,
            }),
        }),
        retweet: builder.mutation({
            query: (body) => ({
                url: "/methods/retweet",
                method: "POST",
                body,
            }),
        }),
        followAccount: builder.mutation({
            query: (body) => ({
                url: "/methods/follow",
                method: "POST",
                body,
            }),
        }),
        unfollowAccount: builder.mutation({
            query: (body) => ({
                url: "/methods/follow/delete",
                method: "POST",
                body,
            }),
        }),
        // Reply endpoint expects multipart: `accounts[]`, `url`, and a txt
        // file whose lines are reply texts separated by '/'.
        replyToTweet: builder.mutation({
            query: (formData) => ({
                url: "/methods/reply",
                method: "POST",
                body: formData,
            }),
        }),
        checkTwitterAccounts: builder.mutation({
            query: (body) => ({
                url: "/accounts/check",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "TwitterAccounts", id: "LIST" }],
        }),
    }),
});

export const {
    useGetTwitterAccountsQuery,
    useGetTwitterAccountQuery,
    useGetTwitterAccountsCountQuery,
    useCreateTwitterAccountMutation,
    useUpdateTwitterAccountMutation,
    useDeleteTwitterAccountMutation,
    useDeleteTwitterAccountsMutation,
    useImportTwitterAccountsMutation,
    useGetAccountCategoriesQuery,
    useCreateAccountCategoryMutation,
    useUpdateAccountCategoryMutation,
    useDeleteAccountCategoryMutation,
    usePostTweetMutation,
    usePostTweetSingleMutation,
    useSubmitTweetForApprovalMutation,
    useDeleteTweetMutation,
    useLikeTweetMutation,
    useUnlikeTweetMutation,
    useRetweetMutation,
    useFollowAccountMutation,
    useUnfollowAccountMutation,
    useReplyToTweetMutation,
    useCheckTwitterAccountsMutation,
} = twitterAccountsApi;
