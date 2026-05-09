import { apiSlice } from "../api/apiSlice";

export const subscriberPermissionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPermissions: builder.query({
            query: () => ({
                url: "api/subscriber/permissions",
                method: "GET",
            }),
            providesTags: ["Permissions"],
            transformResponse: (response) => response.data || response,
        }),
        // Returns the list of permission names for the authenticated user.
        // ['*'] means full access (Subscriber/owner or super-admin).
        getMyPermissions: builder.query({
            query: () => ({
                url: "api/user/auth/permissions",
                method: "GET",
            }),
            providesTags: ["Permissions"],
            transformResponse: (response) => response?.data?.permissions ?? [],
        }),
    }),
});

export const {
    useGetPermissionsQuery,
    useGetMyPermissionsQuery,
    useLazyGetMyPermissionsQuery,
} = subscriberPermissionsApi;
