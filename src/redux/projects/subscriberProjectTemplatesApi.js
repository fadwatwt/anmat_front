import { apiSlice } from "../api/apiSlice";

export const subscriberProjectTemplatesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjectTemplates: builder.query({
            query: (status) => ({
                url: "api/subscriber/organization/project-templates",
                method: "GET",
                params: status ? { status } : {},
            }),
            providesTags: ["ProjectTemplates"],
            transformResponse: (response) => response.data || response,
        }),
        getProjectTemplateDetails: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/project-templates/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "ProjectTemplates", id }],
            transformResponse: (response) => response.data || response,
        }),
        createProjectTemplate: builder.mutation({
            query: (newTemplate) => ({
                url: "api/subscriber/organization/project-templates",
                method: "POST",
                body: newTemplate,
            }),
            invalidatesTags: ["ProjectTemplates"],
        }),
        createProjectTemplateFromProject: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `api/subscriber/organization/project-templates/from-project/${projectId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ProjectTemplates"],
        }),
        createProjectFromTemplate: builder.mutation({
            query: ({ templateId, data }) => ({
                url: `api/subscriber/projects/from-template/${templateId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Projects"],
        }),
        updateProjectTemplate: builder.mutation({
            query: ({ id, data }) => ({
                url: `api/subscriber/organization/project-templates/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["ProjectTemplates", { type: "ProjectTemplates", id }],
        }),
        deleteProjectTemplate: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/project-templates/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProjectTemplates"],
        }),
    }),
});

export const {
    useGetProjectTemplatesQuery,
    useGetProjectTemplateDetailsQuery,
    useCreateProjectTemplateMutation,
    useCreateProjectTemplateFromProjectMutation,
    useCreateProjectFromTemplateMutation,
    useUpdateProjectTemplateMutation,
    useDeleteProjectTemplateMutation,
} = subscriberProjectTemplatesApi;
