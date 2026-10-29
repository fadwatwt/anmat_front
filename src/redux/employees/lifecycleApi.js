import { apiSlice } from "../api/apiSlice";

const base = "api/subscriber/organization/employee-lifecycle";

export const lifecycleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLifecycleTemplates: builder.query({
      query: () => `${base}/templates`,
      providesTags: ["LifecycleTemplates"],
    }),
    createLifecycleTemplate: builder.mutation({
      query: (body) => ({ url: `${base}/templates`, method: "POST", body }),
      invalidatesTags: ["LifecycleTemplates"],
    }),
    getLifecycleCases: builder.query({
      query: () => `${base}/cases`,
      providesTags: ["LifecycleCases"],
    }),
    startLifecycleCase: builder.mutation({
      query: (body) => ({ url: `${base}/cases`, method: "POST", body }),
      invalidatesTags: ["LifecycleCases"],
    }),
    completeLifecycleItem: builder.mutation({
      query: ({ caseId, itemId, body }) => ({
        url: `${base}/cases/${caseId}/items/${itemId}/complete`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LifecycleCases"],
    }),
  }),
});

export const {
  useGetLifecycleTemplatesQuery,
  useCreateLifecycleTemplateMutation,
  useGetLifecycleCasesQuery,
  useStartLifecycleCaseMutation,
  useCompleteLifecycleItemMutation,
} = lifecycleApi;
