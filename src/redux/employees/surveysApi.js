import { apiSlice } from "../api/apiSlice";

const base = "api/subscriber/organization/surveys";
export const surveysApi = apiSlice.enhanceEndpoints({ addTagTypes: ["Surveys", "SurveyResults"] }).injectEndpoints({ endpoints: (builder) => ({
  getSurveys: builder.query({ query: () => base, providesTags: ["Surveys"] }),
  createSurvey: builder.mutation({ query: (body) => ({ url: base, method: "POST", body }), invalidatesTags: ["Surveys"] }),
  openSurvey: builder.mutation({ query: (id) => ({ url: `${base}/${id}/open`, method: "PATCH" }), invalidatesTags: ["Surveys"] }),
  closeSurvey: builder.mutation({ query: (id) => ({ url: `${base}/${id}/close`, method: "PATCH" }), invalidatesTags: ["Surveys"] }),
  submitSurvey: builder.mutation({ query: ({ id, body }) => ({ url: `${base}/${id}/responses`, method: "POST", body }), invalidatesTags: ["Surveys", "SurveyResults"] }),
  getSurveyResults: builder.query({ query: (id) => `${base}/${id}/results`, providesTags: ["SurveyResults"] }),
}) });
export const { useGetSurveysQuery, useCreateSurveyMutation, useOpenSurveyMutation, useCloseSurveyMutation,
  useSubmitSurveyMutation, useGetSurveyResultsQuery } = surveysApi;
