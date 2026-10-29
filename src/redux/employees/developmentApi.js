import { apiSlice } from "../api/apiSlice";

const base = "api/subscriber/organization/development-plans";

export const developmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevelopmentPlans: builder.query({ query: () => base, providesTags: ["DevelopmentPlans"] }),
    createDevelopmentPlan: builder.mutation({
      query: (body) => ({ url: base, method: "POST", body }),
      invalidatesTags: ["DevelopmentPlans"],
    }),
    activateDevelopmentPlan: builder.mutation({
      query: (planId) => ({ url: `${base}/${planId}/activate`, method: "PATCH" }),
      invalidatesTags: ["DevelopmentPlans"],
    }),
    updateDevelopmentSkill: builder.mutation({
      query: ({ planId, skillId, body }) => ({ url: `${base}/${planId}/skills/${skillId}`, method: "PATCH", body }),
      invalidatesTags: ["DevelopmentPlans"],
    }),
    updateDevelopmentAction: builder.mutation({
      query: ({ planId, actionId, body }) => ({ url: `${base}/${planId}/actions/${actionId}`, method: "PATCH", body }),
      invalidatesTags: ["DevelopmentPlans"],
    }),
    addDevelopmentCheckIn: builder.mutation({
      query: ({ planId, body }) => ({ url: `${base}/${planId}/check-ins`, method: "POST", body }),
      invalidatesTags: ["DevelopmentPlans"],
    }),
    completeDevelopmentPlan: builder.mutation({
      query: (planId) => ({ url: `${base}/${planId}/complete`, method: "PATCH" }),
      invalidatesTags: ["DevelopmentPlans"],
    }),
  }),
});

export const {
  useGetDevelopmentPlansQuery, useCreateDevelopmentPlanMutation,
  useActivateDevelopmentPlanMutation, useUpdateDevelopmentSkillMutation,
  useUpdateDevelopmentActionMutation, useAddDevelopmentCheckInMutation,
  useCompleteDevelopmentPlanMutation,
} = developmentApi;
