import { apiSlice } from "../api/apiSlice";

export const subscriberRolesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriberRoles: builder.query({
            query: () => ({
                url: "api/subscriber/organization/roles",
                method: "GET",
            }),
            providesTags: ["Roles"],
            transformResponse: (response) => response.data || response,
        }),
        createSubscriberRole: builder.mutation({
            query: (newRole) => ({
                url: "api/subscriber/organization/roles",
                method: "POST",
                body: newRole,
            }),
            invalidatesTags: ["Roles"],
        }),
        syncSubscriberRolePermissions: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `api/subscriber/organization/roles/${id}/permissions/sync`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Roles"],
        }),
        deleteSubscriberRole: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/roles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Roles"],
        }),
    }),
});

export const {
    useGetSubscriberRolesQuery,
    useCreateSubscriberRoleMutation,
    useSyncSubscriberRolePermissionsMutation,
    useDeleteSubscriberRoleMutation,
} = subscriberRolesApi;
