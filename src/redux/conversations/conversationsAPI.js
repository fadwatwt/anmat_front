import { RootRoute } from "@/Root.Route";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const conversationsAPI = createApi({
  reducerPath: "conversationsAPI",
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${RootRoute}/chats`,
    prepareHeaders: (headers) => {
        // هذا الكود يشتغل فقط في المتصفح
        const token = typeof window !== "undefined" && localStorage.getItem("token");

      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => "/",
    }),
    getMessages: builder.query({
      query: (chatId) => `/${chatId}`,
    }),
    sendMessage: builder.mutation({
      query: ({ chatId, content }) => ({
        url: `/${chatId}/messages`,
        method: "POST",
        body: { content },
      }),
    }),
    createChat: builder.mutation({
      query: (newChat) => ({
        url: "/",
        method: "POST",
        body: newChat,
      }),
    }),
  }),
});

export const { 
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateChatMutation,
} = conversationsAPI;