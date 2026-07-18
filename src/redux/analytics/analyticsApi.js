import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query({
      query: (filters = {}) => {
        const params = {};
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.section) params.section = filters.section;
        return { url: "/api/admin/analytics", params };
      },
      providesTags: ["Analytics"],
    }),
    getSubscriberAnalytics: builder.query({
      query: (filters = {}) => {
        const params = {};
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.departmentId) params.departmentId = filters.departmentId;
        if (filters.employeeId) params.employeeId = filters.employeeId;
        if (filters.section) params.section = filters.section;
        return { url: "/api/subscriber/organization/analytics", params };
      },
      providesTags: ["Analytics"],
    }),
    getEmployeeAnalytics: builder.query({
      query: (filters = {}) => {
        const params = {};
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.section) params.section = filters.section;
        return { url: "/api/employee/analytics", params };
      },
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetAdminAnalyticsQuery,
  useGetSubscriberAnalyticsQuery,
  useGetEmployeeAnalyticsQuery,
} = analyticsApi;
