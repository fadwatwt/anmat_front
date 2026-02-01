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
        createSubscriberProject: builder.mutation({
            query: (newProject) => ({
                url: "api/subscriber/organization/projects",
                method: "POST",
                body: newProject,
            }),
            invalidatesTags: ["Projects"],
        }),
    }),
});

export const {
    useGetSubscriberProjectsQuery,
    useCreateSubscriberProjectMutation,
} = subscriberProjectsApi;
