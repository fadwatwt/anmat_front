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
        deleteSubscriberTask: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/tasks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tasks"],
        }),
        getSubscriberTaskDetails: builder.query({
            query: (id) => ({
                url: `api/subscriber/organization/tasks/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Tasks", id }],
            transformResponse: (response) => response.data || response,
        }),
        updateSubscriberTask: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `api/subscriber/organization/tasks/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Tasks", { type: "Tasks", id }],
        }),
        getSubscriberTaskStatisticsStatus: builder.query({
            query: () => ({
                url: "api/subscriber/organization/tasks/statistics/status",
                method: "GET",
            }),
            providesTags: ["Tasks"],
        }),
    }),
});

export const {
    useGetSubscriberTasksQuery,
    useCreateSubscriberTaskMutation,
    useDeleteSubscriberTaskMutation,
    useGetSubscriberTaskDetailsQuery,
    useUpdateSubscriberTaskMutation,
    useGetSubscriberTaskStatisticsStatusQuery,
} = subscriberTasksApi;
