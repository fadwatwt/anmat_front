import { apiSlice } from "../api/apiSlice";

export const meetingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMeetings: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/meetings",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Meetings"],
        }),
        createMeeting: builder.mutation({
            query: (body) => ({
                url: "api/subscriber/organization/meetings",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Meetings"],
        }),
        updateMeeting: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `api/subscriber/organization/meetings/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Meetings"],
        }),
        updateMeetingStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `api/subscriber/organization/meetings/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Meetings"],
        }),
        deleteMeeting: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/meetings/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Meetings"],
        }),
    }),
});

export const {
    useGetMeetingsQuery,
    useCreateMeetingMutation,
    useUpdateMeetingMutation,
    useUpdateMeetingStatusMutation,
    useDeleteMeetingMutation,
} = meetingsApi;
