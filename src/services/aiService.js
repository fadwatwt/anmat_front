import axios from "axios";
import { RootRoute } from "@/Root.Route";

const client = axios.create({
  baseURL: `${RootRoute}/api/ai`,
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const aiService = {
  sendMessage: ({ message, conversation_id, attachment_urls, model } = {}) =>
    client
      .post("/chat", { message, conversation_id, attachment_urls, model })
      .then((r) => r.data?.data),

  confirmAction: (pending_action_id) =>
    client
      .post("/confirm", { pending_action_id })
      .then((r) => r.data?.data),

  cancelAction: (pending_action_id) =>
    client
      .post("/cancel", { pending_action_id })
      .then((r) => r.data?.data),

  listConversations: () =>
    client.get("/conversations").then((r) => r.data?.data),

  getConversationMessages: (conversationId) =>
    client
      .get(`/conversations/${conversationId}/messages`)
      .then((r) => r.data?.data),
};
