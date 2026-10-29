import { apiSlice } from "../api/apiSlice";

const base = "api/subscriber/organization/org-structure";
export const orgStructureApi = apiSlice.injectEndpoints({ endpoints: (builder) => ({
  getOrgChart: builder.query({ query: (asOf) => `${base}/chart${asOf ? `?as_of=${encodeURIComponent(asOf)}` : ""}`, providesTags: ["Employees"] }),
  getCareerPaths: builder.query({ query: () => `${base}/career-paths`, providesTags: ["Positions"] }),
  createCareerPath: builder.mutation({ query: (body) => ({ url: `${base}/career-paths`, method: "POST", body }), invalidatesTags: ["Positions"] }),
  setCareerPathActive: builder.mutation({ query: ({ id, active }) => ({ url: `${base}/career-paths/${id}`, method: "PATCH", body: { active } }), invalidatesTags: ["Positions"] }),
  getDevelopmentTargets: builder.query({ query: () => `${base}/development-targets`, providesTags: ["DevelopmentPlans"] }),
  getOrgTransfers: builder.query({ query: () => `${base}/transfers`, providesTags: ["Employees"] }),
  scheduleOrgTransfer: builder.mutation({ query: (body) => ({ url: `${base}/transfers`, method: "POST", body }), invalidatesTags: ["Employees"] }),
  cancelOrgTransfer: builder.mutation({ query: (id) => ({ url: `${base}/transfers/${id}/cancel`, method: "PATCH" }), invalidatesTags: ["Employees"] }),
}) });

export const { useGetOrgChartQuery, useGetCareerPathsQuery, useCreateCareerPathMutation, useSetCareerPathActiveMutation, useGetDevelopmentTargetsQuery, useGetOrgTransfersQuery, useScheduleOrgTransferMutation, useCancelOrgTransferMutation } = orgStructureApi;
