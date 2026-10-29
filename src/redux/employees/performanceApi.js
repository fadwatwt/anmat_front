import { apiSlice } from "../api/apiSlice";

const base = "api/subscriber/organization/performance";

export const performanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPerformanceCycles: builder.query({ query: () => `${base}/cycles`, providesTags: ["PerformanceCycles"] }),
    createPerformanceCycle: builder.mutation({
      query: (body) => ({ url: `${base}/cycles`, method: "POST", body }),
      invalidatesTags: ["PerformanceCycles"],
    }),
    activatePerformanceCycle: builder.mutation({
      query: (cycleId) => ({ url: `${base}/cycles/${cycleId}/activate`, method: "PATCH" }),
      invalidatesTags: ["PerformanceCycles"],
    }),
    closePerformanceCycle: builder.mutation({
      query: (cycleId) => ({ url: `${base}/cycles/${cycleId}/close`, method: "PATCH" }),
      invalidatesTags: ["PerformanceCycles"],
    }),
    assignPerformanceReviews: builder.mutation({
      query: ({ cycleId, employee_ids }) => ({ url: `${base}/cycles/${cycleId}/reviews`, method: "POST", body: { employee_ids } }),
      invalidatesTags: ["PerformanceReviews"],
    }),
    getPerformanceReviews: builder.query({ query: () => `${base}/reviews`, providesTags: ["PerformanceReviews"] }),
    addPerformanceGoal: builder.mutation({
      query: ({ reviewId, body }) => ({ url: `${base}/reviews/${reviewId}/goals`, method: "POST", body }),
      invalidatesTags: ["PerformanceReviews"],
    }),
    updatePerformanceGoal: builder.mutation({
      query: ({ reviewId, goalId, body }) => ({ url: `${base}/reviews/${reviewId}/goals/${goalId}/progress`, method: "PATCH", body }),
      invalidatesTags: ["PerformanceReviews"],
    }),
    submitSelfAssessment: builder.mutation({
      query: ({ reviewId, body }) => ({ url: `${base}/reviews/${reviewId}/self-assessment`, method: "POST", body }),
      invalidatesTags: ["PerformanceReviews"],
    }),
    submitManagerAssessment: builder.mutation({
      query: ({ reviewId, body }) => ({ url: `${base}/reviews/${reviewId}/manager-assessment`, method: "POST", body }),
      invalidatesTags: ["PerformanceReviews"],
    }),
    finalizePerformanceReview: builder.mutation({
      query: (reviewId) => ({ url: `${base}/reviews/${reviewId}/finalize`, method: "PATCH" }),
      invalidatesTags: ["PerformanceReviews"],
    }),
  }),
});

export const {
  useGetPerformanceCyclesQuery,
  useCreatePerformanceCycleMutation,
  useActivatePerformanceCycleMutation,
  useClosePerformanceCycleMutation,
  useAssignPerformanceReviewsMutation,
  useGetPerformanceReviewsQuery,
  useAddPerformanceGoalMutation,
  useUpdatePerformanceGoalMutation,
  useSubmitSelfAssessmentMutation,
  useSubmitManagerAssessmentMutation,
  useFinalizePerformanceReviewMutation,
} = performanceApi;
