import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootRoute } from "@/Root.Route";

export const apiSlice = createApi({
    reducerPath: "api", // The single key for all API data in the store
    baseQuery: fetchBaseQuery({
        baseUrl: RootRoute,
        prepareHeaders: (headers, { getState }) => {
            // Global header configuration (e.g. Auth Tokens)
            const token = getState().auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // Initialize generic tag types here. 
    // Features can add their own tags later (e.g. 'Projects', 'Tasks')
    tagTypes: ["User", "Auth", "SystemAdmins", "AdminRoles", "AdminPermissions", "Industries", "SubscriptionPlans", "SubscriptionFeatureTypes", "Subscriptions", "Organizations", "MoneyReceivingMethods", "Positions", "Departments"],
    endpoints: () => ({}), // Start empty, inject endpoints in other files
});
