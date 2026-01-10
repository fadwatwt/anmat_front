import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "api/admin/auth/login",
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
  }),
});

export const { useLoginMutation, useLazyGetUserQuery } = authApi;
