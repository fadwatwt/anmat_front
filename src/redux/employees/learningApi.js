import { apiSlice } from "../api/apiSlice";

const base = "api/subscriber/organization/learning";
export const learningApi = apiSlice.enhanceEndpoints({ addTagTypes: ["LearningSkills", "PositionSkills", "EmployeeSkills", "LearningCourses", "LearningEnrollments", "LearningGaps"] }).injectEndpoints({ endpoints: (builder) => ({
  getLearningSkills: builder.query({ query: () => `${base}/skills`, providesTags: ["LearningSkills"] }),
  createLearningSkill: builder.mutation({ query: (body) => ({ url: `${base}/skills`, method: "POST", body }), invalidatesTags: ["LearningSkills"] }),
  setLearningSkillStatus: builder.mutation({ query: ({ id, active }) => ({ url: `${base}/skills/${id}/status`, method: "PATCH", body: { active } }), invalidatesTags: ["LearningSkills", "LearningGaps"] }),
  getPositionSkills: builder.query({ query: () => `${base}/position-skills`, providesTags: ["PositionSkills"] }),
  setPositionSkill: builder.mutation({ query: (body) => ({ url: `${base}/position-skills`, method: "POST", body }), invalidatesTags: ["PositionSkills", "LearningGaps"] }),
  removePositionSkill: builder.mutation({ query: (id) => ({ url: `${base}/position-skills/${id}`, method: "DELETE" }), invalidatesTags: ["PositionSkills", "LearningGaps"] }),
  getEmployeeSkills: builder.query({ query: () => `${base}/employee-skills`, providesTags: ["EmployeeSkills"] }),
  assessEmployeeSkill: builder.mutation({ query: (body) => ({ url: `${base}/employee-skills`, method: "POST", body }), invalidatesTags: ["EmployeeSkills", "LearningGaps"] }),
  getLearningCourses: builder.query({ query: () => `${base}/courses`, providesTags: ["LearningCourses"] }),
  createLearningCourse: builder.mutation({ query: (body) => ({ url: `${base}/courses`, method: "POST", body }), invalidatesTags: ["LearningCourses"] }),
  setLearningCourseStatus: builder.mutation({ query: ({ id, active }) => ({ url: `${base}/courses/${id}/status`, method: "PATCH", body: { active } }), invalidatesTags: ["LearningCourses"] }),
  getLearningEnrollments: builder.query({ query: () => `${base}/enrollments`, providesTags: ["LearningEnrollments"] }),
  enrollLearningEmployee: builder.mutation({ query: (body) => ({ url: `${base}/enrollments`, method: "POST", body }), invalidatesTags: ["LearningEnrollments"] }),
  completeLearningEnrollment: builder.mutation({ query: ({ id, body }) => ({ url: `${base}/enrollments/${id}/complete`, method: "PATCH", body }), invalidatesTags: ["LearningEnrollments", "DevelopmentPlans"] }),
  getLearningGaps: builder.query({ query: () => `${base}/gaps`, providesTags: ["LearningGaps"] }),
  getMyLearningGaps: builder.query({ query: () => `${base}/my-gaps`, providesTags: ["LearningGaps"] }),
}) });

export const { useGetLearningSkillsQuery, useCreateLearningSkillMutation, useSetLearningSkillStatusMutation,
  useGetPositionSkillsQuery, useSetPositionSkillMutation, useRemovePositionSkillMutation, useGetEmployeeSkillsQuery, useAssessEmployeeSkillMutation,
  useGetLearningCoursesQuery, useCreateLearningCourseMutation, useSetLearningCourseStatusMutation,
  useGetLearningEnrollmentsQuery, useEnrollLearningEmployeeMutation, useCompleteLearningEnrollmentMutation,
  useGetLearningGapsQuery, useGetMyLearningGapsQuery } = learningApi;
