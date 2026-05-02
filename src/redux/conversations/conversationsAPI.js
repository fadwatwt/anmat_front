import { RootRoute } from "@/Root.Route";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const conversationsAPI = createApi({
  reducerPath: "conversationsAPI",
  tagTypes: ["Chats", "UnreadChats", "Messages", "Threads"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${RootRoute}/api/chats`,
    prepareHeaders: (headers) => {
      const token = typeof window !== "undefined" && localStorage.getItem("token");

      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getChats: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.is_archived !== undefined) queryParams.append("is_archived", params.is_archived);
        if (params?.project_id) queryParams.append("project_id", params.project_id);
        const queryString = queryParams.toString();
        return queryString ? `/?${queryString}` : "/";
      },
      providesTags: ["Chats"],
    }),
    getUnreadChats: builder.query({
      query: () => "/unread",
      providesTags: ["UnreadChats"],
    }),
    getMessages: builder.query({
      query: (chatId) => `/${chatId}/messages`,
      providesTags: (result, error, arg) => [{ type: "Messages", id: arg }],
    }),
    sendMessage: builder.mutation({
      query: ({ chatId, content, attachment }) => ({
        url: `/${chatId}/messages`,
        method: "POST",
        body: { content, attachment },
      }),
      // We might want to invalidate messages or use optimistic updates
      invalidatesTags: (result, error, arg) => [{ type: "Messages", id: arg.chatId }],
    }),
    editMessage: builder.mutation({
      query: ({ messageId, content }) => ({
        url: `/messages/${messageId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["Messages"],
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Messages"],
    }),
    addReaction: builder.mutation({
      query: ({ messageId, emoji }) => ({
        url: `/messages/${messageId}/reactions`,
        method: "POST",
        body: { emoji },
      }),
      invalidatesTags: ["Messages"],
    }),
    removeReaction: builder.mutation({
      query: ({ messageId, emoji }) => ({
        url: `/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Messages"],
    }),
    getThreadReplies: builder.query({
      query: (messageId) => `/messages/${messageId}/replies`,
      providesTags: (result, error, arg) => [{ type: "Threads", id: arg }],
    }),
    createThreadReply: builder.mutation({
      query: ({ messageId, content, attachment }) => ({
        url: `/messages/${messageId}/replies`,
        method: "POST",
        body: { content, attachment },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Threads", id: arg.messageId }],
    }),
    searchMessages: builder.query({
      query: ({ chatId, q }) => `/${chatId}/messages/search?q=${encodeURIComponent(q)}`,
    }),
    archiveChat: builder.mutation({
      query: ({ chatId, is_archived }) => ({
        url: `/${chatId}/archive`,
        method: "PATCH",
        body: { is_archived },
      }),
      invalidatesTags: ["Chats"],
    }),
    getChatActivity: builder.query({
      query: (chatId) => `/${chatId}/activity`,
    }),
    addParticipants: builder.mutation({
      query: ({ chatId, participantIds }) => ({
        url: `/${chatId}/participants`,
        method: "POST",
        body: { participantIds },
      }),
      invalidatesTags: ["Chats"],
    }),
    removeParticipant: builder.mutation({
      query: ({ chatId, userId }) => ({
        url: `/${chatId}/participants/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chats"],
    }),
    createPoll: builder.mutation({
      query: ({ chatId, question, options, allow_multiple_choice }) => ({
        url: `/${chatId}/polls`,
        method: "POST",
        body: { question, options, allow_multiple_choice },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Messages", id: arg.chatId }],
    }),
    listPolls: builder.query({
      query: (chatId) => `/${chatId}/polls`,
    }),
    votePoll: builder.mutation({
      query: ({ pollId, option_ids }) => ({
        url: `/polls/${pollId}/vote`,
        method: "POST",
        body: { option_ids },
      }),
    }),
    closePoll: builder.mutation({
      query: (pollId) => ({
        url: `/polls/${pollId}/close`,
        method: "PATCH",
      }),
    }),
    createChat: builder.mutation({
      query: (newChat) => ({
        url: "/",
        method: "POST",
        body: newChat,
      }),
      invalidatesTags: ["Chats"],
    }),
    markChatAsRead: builder.mutation({
      query: (chatId) => ({
        url: `/${chatId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["UnreadChats"],
    }),
    uploadFile: builder.mutation({
      query: ({ chatId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/${chatId}/upload`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetUnreadChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useAddReactionMutation,
  useRemoveReactionMutation,
  useGetThreadRepliesQuery,
  useCreateThreadReplyMutation,
  useLazySearchMessagesQuery,
  useArchiveChatMutation,
  useGetChatActivityQuery,
  useAddParticipantsMutation,
  useRemoveParticipantMutation,
  useCreatePollMutation,
  useListPollsQuery,
  useVotePollMutation,
  useClosePollMutation,
  useCreateChatMutation,
  useMarkChatAsReadMutation,
  useUploadFileMutation,
} = conversationsAPI;