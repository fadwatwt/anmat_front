import { apiSlice } from "../api/apiSlice";

export const adminRolesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPermissions: builder.query({
        query: () => ({
          url: "api/admin/permissions",
          method: "GET",
        }),
        providesTags: ["AdminPermissions"],
      }),
    getAdminRoles: builder.query({
      query: () => ({
        url: "api/admin/roles",
        method: "GET",
      }),
      providesTags: ["AdminRoles"],
    }),
    createAdminRole: builder.mutation({
      query: (newRole) => ({
        url: "api/admin/roles",
        method: "POST",
        body: newRole,
      }),
      invalidatesTags: ["AdminRoles"],
    }),
    updateAdminRolePermissions: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `api/admin/roles/${id}/permissions/sync`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminRoles",
        { type: "AdminRoles", id },
      ],
    }),
    deleteAdminRole: builder.mutation({
      query: (id) => ({
        url: `api/admin/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "AdminRoles",
        { type: "AdminRoles", id },
      ],
    }),
  }),
});

export const {
  useGetAdminPermissionsQuery,
  useGetAdminRolesQuery,
  useCreateAdminRoleMutation,
  useUpdateAdminRolePermissionsMutation,
  useDeleteAdminRoleMutation,
} = adminRolesApi;

