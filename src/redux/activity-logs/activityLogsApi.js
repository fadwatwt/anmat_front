import { apiSlice } from "../api/apiSlice";

export const activityLogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationLogs: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        return `api/activity-logs/my-organization?${queryParams.toString()}`;
      },
      providesTags: ["ActivityLogs"],
    }),
    getMyLogs: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        return `api/activity-logs/my-logs?${queryParams.toString()}`;
      },
      providesTags: ["ActivityLogs"],
    }),
    getDepartmentLogs: builder.query({
      query: ({ departmentId, ...params }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        return `api/activity-logs/department/${departmentId}?${queryParams.toString()}`;
      },
      providesTags: ["ActivityLogs"],
    }),
    getEmployeeLogs: builder.query({
      query: ({ employeeId, ...params }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        return `api/activity-logs/employee/${employeeId}?${queryParams.toString()}`;
      },
      providesTags: ["ActivityLogs"],
    }),
    getTaskLogs: builder.query({
      query: ({ taskId, ...params }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        return `api/activity-logs/task/${taskId}?${queryParams.toString()}`;
      },
      providesTags: ["ActivityLogs"],
    }),
    getProjectLogs: builder.query({
      query: ({ projectId, ...params }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        return `api/activity-logs/project/${projectId}?${queryParams.toString()}`;
      },
      providesTags: ["ActivityLogs"],
    }),
    getEmployeeDashboardLogs: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        return `api/activity-logs/my-employee-scope?${queryParams.toString()}`;
      },
      providesTags: ["ActivityLogs"],
    }),
  }),
});

export const {
  useGetOrganizationLogsQuery,
  useGetMyLogsQuery,
  useGetDepartmentLogsQuery,
  useGetEmployeeLogsQuery,
  useGetTaskLogsQuery,
  useGetProjectLogsQuery,
  useGetEmployeeDashboardLogsQuery,
} = activityLogsApi;
