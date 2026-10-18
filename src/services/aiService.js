import { getToken } from "@/utils/tokenStorage";

import axios from "axios";
import { RootRoute } from "@/Root.Route";

const client = axios.create({
  baseURL: `${RootRoute}/api/ai`,
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const aiService = {
  sendMessage: ({ message, conversation_id, attachment_urls, model, mode } = {}) =>
    client
      .post("/chat", { message, conversation_id, attachment_urls, model, mode })
      .then((r) => r.data?.data),

  confirmAction: (pending_action_id) =>
    client
      .post("/pending-actions/confirm", { pending_action_id })
      .then((r) => r.data?.data),

  cancelAction: (pending_action_id) =>
    client
      .post("/pending-actions/cancel", { pending_action_id })
      .then((r) => r.data?.data),

  listConversations: () =>
    client.get("/conversations").then((r) => r.data?.data),

  getConversationMessages: (conversationId) =>
    client
      .get(`/conversations/${conversationId}/messages`)
      .then((r) => r.data?.data),
};
