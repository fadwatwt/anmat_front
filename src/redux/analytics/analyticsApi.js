import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query({
      query: () => "/api/admin/analytics",
      providesTags: ["Analytics"],
    }),
    getSubscriberAnalytics: builder.query({
      query: () => "/api/subscriber/organization/analytics",
      providesTags: ["Analytics"],
    }),
    getEmployeeAnalytics: builder.query({
      query: () => "/api/employee/analytics",
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetAdminAnalyticsQuery,
  useGetSubscriberAnalyticsQuery,
  useGetEmployeeAnalyticsQuery,
} = analyticsApi;
