import { mutationStarted, mutationSettled } from "./processingSlice";

// Endpoints that intentionally run "silently" and must NOT trigger the global
// processing overlay (optimistic / background / high-frequency / streaming).
// Match is by RTK Query endpoint name (the key used in `injectEndpoints`).
const SILENT_ENDPOINTS = new Set([
    // Read receipts / presence — fire constantly in the background.
    "markChatAsRead",
    "markAsRead",
    "markAllNotificationsAsRead",
    "markNotificationAsRead",
    "markSubscriberNotificationAsRead",
    "markAllSubscriberNotificationsAsRead",
    // Chat reactions — optimistic, should feel instant.
    "addReaction",
    "removeReaction",
    // AI chat is streamed / handled with its own in-conversation indicators.
    "sendMessage",
    "uploadAiFiles",
    "confirmPendingAction",
    "cancelPendingAction",
]);

const isMutationAction = (action) =>
    typeof action?.type === "string" &&
    action.type.includes("executeMutation") &&
    action?.meta?.arg?.type === "mutation";

const getEndpointName = (action) => action?.meta?.arg?.endpointName;

const isSilent = (action) => SILENT_ENDPOINTS.has(getEndpointName(action));

// Redux middleware that converts RTK Query mutation lifecycle actions
// (pending / fulfilled / rejected) into a global pending-mutation counter.
export const processingMiddleware = (storeApi) => (next) => (action) => {
    if (isMutationAction(action) && !isSilent(action)) {
        if (action.type.endsWith("/pending")) {
            storeApi.dispatch(mutationStarted());
        } else if (
            action.type.endsWith("/fulfilled") ||
            action.type.endsWith("/rejected")
        ) {
            storeApi.dispatch(mutationSettled());
        }
    }
    return next(action);
};
