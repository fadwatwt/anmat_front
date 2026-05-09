import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootRoute } from "@/Root.Route";
import { toast } from "react-toastify";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: RootRoute,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Wraps fetchBaseQuery so a backend 403 surfaces a toast — the user sees
// why the action failed even when an over-permissive UI exposed it.
const baseQueryWithForbiddenHandler = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result?.error?.status === 403) {
        const message =
            result.error?.data?.message ||
            "You don't have permission to perform this action.";
        toast.error(message, { toastId: "forbidden-action" });
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: "api", // The single key for all API data in the store
    baseQuery: baseQueryWithForbiddenHandler,
    // Initialize generic tag types here. 
    // Features can add their own tags later (e.g. 'Projects', 'Tasks')
    tagTypes: ["User", "Auth", "SystemAdmins", "AdminRoles", "AdminPermissions", "Industries", "SubscriptionPlans", "SubscriptionPlansHistory", "SubscriptionFeatureTypes", "Subscriptions", "Subscribers", "Organizations", "MoneyReceivingMethods", "Positions", "Departments", "Employees", "Attendances", "Leaves", "Salaries", "EmployeeRequests", "Permissions", "Roles", "Projects", "Tasks", "Notifications", "Analytics", "ActivityLogs", "SubscriberNotifications", "SubscriberNotificationTypes", "PaymentMethods", "SupportTickets"],
    endpoints: () => ({}), // Start empty, inject endpoints in other files
});
