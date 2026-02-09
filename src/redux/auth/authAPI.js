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
      providesTags: ["User"],
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
    registerSubscriberEmail: builder.mutation({
      query: (data) => ({
        url: "api/user/auth/register/subscriber/email",
        method: "POST",
        body: data,
      }),
    }),
    completeSubscriberProfile: builder.mutation({
      query: (data) => ({
        url: "api/user/auth/register/subscriber/account",
        method: "POST",
        body: data,
      }),
    }),
    registerEmployeeAccount: builder.mutation({
      query: (data) => ({
        url: "api/user/auth/register/employee",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useLazyGetUserQuery, useLazyLogoutQuery, useAdminLoginMutation, useRegisterSubscriberEmailMutation, useCompleteSubscriberProfileMutation, useRegisterEmployeeAccountMutation } = authApi;
