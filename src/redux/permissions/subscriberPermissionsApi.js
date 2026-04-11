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
    }),
});

export const {
    useGetPermissionsQuery,
} = subscriberPermissionsApi;
