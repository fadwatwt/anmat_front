import { apiSlice } from "../api/apiSlice";

export const subscriberTasksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriberTasks: builder.query({
            query: () => ({
                url: "api/subscriber/organization/tasks",
                method: "GET",
            }),
            providesTags: ["Tasks"],
            transformResponse: (response) => response.data || response,
        }),
        createSubscriberTask: builder.mutation({
            query: (newTask) => ({
                url: "api/subscriber/organization/tasks",
                method: "POST",
                body: newTask,
            }),
            invalidatesTags: ["Tasks"],
        }),
    }),
});

export const {
    useGetSubscriberTasksQuery,
    useCreateSubscriberTaskMutation,
} = subscriberTasksApi;
