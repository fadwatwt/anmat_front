import { apiSlice } from "../api/apiSlice";

export const subscriberProjectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriberProjects: builder.query({
            query: () => ({
                url: "api/subscriber/organization/projects",
                method: "GET",
            }),
            providesTags: ["Projects"],
            transformResponse: (response) => response.data || response,
        }),
        getSubscriberProjectDetails: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/projects/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Projects", id }],
            transformResponse: (response) => response.data || response,
        }),
        createSubscriberProject: builder.mutation({
            query: (newProject) => ({
                url: "api/subscriber/organization/projects",
                method: "POST",
                body: newProject,
            }),
            invalidatesTags: ["Projects"],
        }),
        updateSubscriberProject: builder.mutation({
            query: ({ id, data }) => ({
                url: `api/subscriber/organization/projects/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Projects", { type: "Projects", id }],
        }),
    }),
});

export const {
    useGetSubscriberProjectsQuery,
    useGetSubscriberProjectDetailsQuery,
    useCreateSubscriberProjectMutation,
    useUpdateSubscriberProjectMutation,
} = subscriberProjectsApi;
