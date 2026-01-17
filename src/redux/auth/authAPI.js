import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "api/admin/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "api/user/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUser: builder.query({
      query: (token) => ({
        url: "api/user/auth",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    logout: builder.query({
      query: (token) => ({
        url: "api/user/auth/logout",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useLazyGetUserQuery, useLazyLogoutQuery, useAdminLoginMutation } = authApi;
