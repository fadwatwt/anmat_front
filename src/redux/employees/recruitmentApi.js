import { apiSlice } from "../api/apiSlice";

const base = "api/subscriber/organization/recruitment";
export const recruitmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecruitmentJobs: builder.query({ query: () => `${base}/jobs`, providesTags: ["RecruitmentJobs"] }),
    createRecruitmentJob: builder.mutation({ query: (body) => ({ url: `${base}/jobs`, method: "POST", body }), invalidatesTags: ["RecruitmentJobs", "RecruitmentReport"] }),
    setRecruitmentJobStatus: builder.mutation({ query: ({ id, status }) => ({ url: `${base}/jobs/${id}/status`, method: "PATCH", body: { status } }), invalidatesTags: ["RecruitmentJobs", "RecruitmentReport"] }),
    getRecruitmentCandidates: builder.query({ query: () => `${base}/candidates`, providesTags: ["RecruitmentCandidates"] }),
    createRecruitmentCandidate: builder.mutation({ query: (body) => ({ url: `${base}/candidates`, method: "POST", body }), invalidatesTags: ["RecruitmentCandidates"] }),
    getCandidateFiles: builder.query({ query: (id) => `${base}/candidates/${id}/files`, providesTags: ["RecruitmentFiles"] }),
    uploadCandidateFile: builder.mutation({ query: ({ id, body }) => ({ url: `${base}/candidates/${id}/files`, method: "POST", body }), invalidatesTags: ["RecruitmentFiles"] }),
    getRecruitmentApplications: builder.query({ query: () => `${base}/applications`, providesTags: ["RecruitmentApplications"] }),
    createRecruitmentApplication: builder.mutation({ query: (body) => ({ url: `${base}/applications`, method: "POST", body }), invalidatesTags: ["RecruitmentApplications", "RecruitmentReport"] }),
    moveRecruitmentStage: builder.mutation({ query: ({ id, stage }) => ({ url: `${base}/applications/${id}/stage`, method: "PATCH", body: { stage } }), invalidatesTags: ["RecruitmentApplications"] }),
    setRecruitmentApplicationStatus: builder.mutation({ query: ({ id, status }) => ({ url: `${base}/applications/${id}/status`, method: "PATCH", body: { status } }), invalidatesTags: ["RecruitmentApplications", "RecruitmentReport"] }),
    scheduleRecruitmentInterview: builder.mutation({ query: ({ id, body }) => ({ url: `${base}/applications/${id}/interviews`, method: "POST", body }), invalidatesTags: ["RecruitmentApplications"] }),
    evaluateRecruitmentInterview: builder.mutation({ query: ({ id, interviewId, body }) => ({ url: `${base}/applications/${id}/interviews/${interviewId}/evaluation`, method: "POST", body }), invalidatesTags: ["RecruitmentApplications"] }),
    createRecruitmentOffer: builder.mutation({ query: ({ id, body }) => ({ url: `${base}/applications/${id}/offer`, method: "POST", body }), invalidatesTags: ["RecruitmentApplications"] }),
    setRecruitmentOfferStatus: builder.mutation({ query: ({ id, status }) => ({ url: `${base}/applications/${id}/offer/status`, method: "PATCH", body: { status } }), invalidatesTags: ["RecruitmentApplications"] }),
    convertRecruitmentApplication: builder.mutation({ query: (id) => ({ url: `${base}/applications/${id}/convert`, method: "POST" }), invalidatesTags: ["RecruitmentApplications", "RecruitmentCandidates", "RecruitmentReport"] }),
    getRecruitmentReport: builder.query({ query: () => `${base}/report`, providesTags: ["RecruitmentReport"] }),
  }),
});

export const {
  useGetRecruitmentJobsQuery, useCreateRecruitmentJobMutation, useSetRecruitmentJobStatusMutation,
  useGetRecruitmentCandidatesQuery, useCreateRecruitmentCandidateMutation,
  useGetCandidateFilesQuery, useUploadCandidateFileMutation,
  useGetRecruitmentApplicationsQuery, useCreateRecruitmentApplicationMutation,
  useMoveRecruitmentStageMutation, useSetRecruitmentApplicationStatusMutation,
  useScheduleRecruitmentInterviewMutation, useEvaluateRecruitmentInterviewMutation,
  useCreateRecruitmentOfferMutation, useSetRecruitmentOfferStatusMutation,
  useConvertRecruitmentApplicationMutation, useGetRecruitmentReportQuery,
} = recruitmentApi;
