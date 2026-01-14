import { apiSlice } from "../api/apiSlice";

export const systemAdminsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdmins: builder.query({
            query: () => ({
                url: "api/admin/admins",
                method: "GET",
            }),
            providesTags: ["SystemAdmins"],
        }),
        getAdminRoles: builder.query({
            query: () => ({
                url: "api/admin/roles",
                method: "GET",
            }),
            providesTags: ["AdminRoles"],
        }),
        createAdmin: builder.mutation({
            query: (newAdmin) => ({
                url: "api/admin/admins",
                method: "POST",
                body: newAdmin,
            }),
            invalidatesTags: ["SystemAdmins"],
        }),
    }),
});

export const {
    useGetAdminsQuery,
    useCreateAdminMutation,
    useGetAdminRolesQuery,
} = systemAdminsApi;
