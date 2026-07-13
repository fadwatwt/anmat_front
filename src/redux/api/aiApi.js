import { apiSlice } from "./apiSlice";

export const aiApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTokensBalance: builder.query({
            query: () => ({
                url: "api/ai/tokens/balance",
                method: "GET",
            }),
            providesTags: ["AITokens"],
            transformResponse: (response) => response.data || response,
        }),
        getTokenHistory: builder.query({
            query: ({ page = 1, limit = 20 } = {}) => ({
                url: `api/ai/tokens/history`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["AITokens"],
            transformResponse: (response) => response.data || response,
        }),
        getTokenPackages: builder.query({
            query: () => ({
                url: "api/ai/tokens/packages",
                method: "GET",
            }),
            transformResponse: (response) => response.data || response,
        }),
        createTokenCheckout: builder.mutation({
            query: ({ package_id }) => ({
                url: "api/ai/tokens/checkout",
                method: "POST",
                body: { package_id },
            }),
            invalidatesTags: ["AITokens"],
            transformResponse: (response) => response.data || response,
        }),
        confirmTokenCheckout: builder.mutation({
            query: ({ session_id }) => ({
                url: "api/ai/tokens/confirm",
                method: "POST",
                body: { session_id },
            }),
            transformResponse: (response) => response.data || response,
        }),
        listConversations: builder.query({
            query: () => ({
                url: "api/ai/conversations",
                method: "GET",
            }),
            providesTags: ["AIConversation"],
            transformResponse: (response) => response.data || response,
        }),
        getConversationMessages: builder.query({
            query: (id) => ({
                url: `api/ai/conversations/${id}/messages`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [
                { type: "AIConversation", id: `MESSAGES-${id}` },
                "AIConversation"
            ],
            transformResponse: (response) => response.data || response,
        }),
        uploadAiFiles: builder.mutation({
            query: (files) => {
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append("files", file);
                });
                return {
                    url: "api/ai/upload",
                    method: "POST",
                    body: formData,
                };
            },
        }),
        sendMessage: builder.mutation({
            query: ({ message, conversation_id, attachments, model }) => ({
                url: "api/ai/chat",
                method: "POST",
                body: { message, conversation_id, attachments, model },
            }),
            invalidatesTags: (result, error, { conversation_id }) => [
                "AITokens",
                "AIConversation",
                { type: "AIConversation", id: `MESSAGES-${conversation_id}` }
            ],
            transformResponse: (response) => response.data || response,
        }),
        confirmPendingAction: builder.mutation({
            query: ({ pending_action_id }) => ({
                url: "api/ai/pending-actions/confirm",
                method: "POST",
                body: { pending_action_id },
            }),
            invalidatesTags: ["AITokens", "AIConversation"],
            transformResponse: (response) => response.data || response,
        }),
        cancelPendingAction: builder.mutation({
            query: ({ pending_action_id }) => ({
                url: "api/ai/pending-actions/cancel",
                method: "POST",
                body: { pending_action_id },
            }),
            invalidatesTags: ["AIConversation"],
            transformResponse: (response) => response.data || response,
        }),
        renameConversation: builder.mutation({
            query: ({ id, title }) => ({
                url: `api/ai/conversations/${id}`,
                method: "PATCH",
                body: { title },
            }),
            invalidatesTags: (result, error, { id }) => [
                "AIConversation",
                { type: "AIConversation", id: `MESSAGES-${id}` }
            ],
            transformResponse: (response) => response.data || response,
        }),
        deleteConversation: builder.mutation({
            query: (id) => ({
                url: `api/ai/conversations/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AIConversation"],
            transformResponse: (response) => response.data || response,
        }),
        getAdminTokenAnalytics: builder.query({
            query: () => ({
                url: "api/ai/admin/token-analytics",
                method: "GET",
            }),
            transformResponse: (response) => response.data || response,
        }),
        getFreeTokensLimit: builder.query({
            query: () => ({
                url: "api/admin/settings/free-tokens",
                method: "GET",
            }),
            providesTags: ["AITokensLimit"],
            transformResponse: (response) => response.data || response,
        }),
        updateFreeTokensLimit: builder.mutation({
            query: ({ limit }) => ({
                url: "api/admin/settings/free-tokens",
                method: "PATCH",
                body: { limit },
            }),
            invalidatesTags: ["AITokensLimit"],
            transformResponse: (response) => response.data || response,
        }),
        getPendingEscalations: builder.query({
            query: () => ({
                url: "api/escalation/pending",
                method: "GET",
            }),
            providesTags: ["Escalation"],
            transformResponse: (response) => response.data || response,
        }),
        approveEscalation: builder.mutation({
            query: ({ id }) => ({
                url: `api/escalation/${id}/approve`,
                method: "POST",
            }),
            invalidatesTags: ["Escalation"],
            transformResponse: (response) => response.data || response,
        }),
        rejectEscalation: builder.mutation({
            query: ({ id }) => ({
                url: `api/escalation/${id}/reject`,
                method: "POST",
            }),
            invalidatesTags: ["Escalation"],
            transformResponse: (response) => response.data || response,
        }),
    }),
});

export const {
    useGetTokensBalanceQuery,
    useGetTokenHistoryQuery,
    useGetTokenPackagesQuery,
    useCreateTokenCheckoutMutation,
    useConfirmTokenCheckoutMutation,
    useListConversationsQuery,
    useGetConversationMessagesQuery,
    useUploadAiFilesMutation,
    useSendMessageMutation,
    useConfirmPendingActionMutation,
    useCancelPendingActionMutation,
    useRenameConversationMutation,
    useDeleteConversationMutation,
    useGetAdminTokenAnalyticsQuery,
    useGetFreeTokensLimitQuery,
    useUpdateFreeTokensLimitMutation,
    useGetPendingEscalationsQuery,
    useApproveEscalationMutation,
    useRejectEscalationMutation,
} = aiApi;
