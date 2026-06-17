import { apiSlice } from "../api/apiSlice";

export const teamsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeams: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/teams",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Teams"],
        }),
        createTeam: builder.mutation({
            query: (body) => ({
                url: "api/subscriber/organization/teams",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Teams"],
        }),
        updateTeam: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `api/subscriber/organization/teams/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Teams"],
        }),
        rateTeam: builder.mutation({
            query: ({ id, score }) => ({
                url: `api/subscriber/organization/teams/${id}/rate`,
                method: "PATCH",
                body: { score },
            }),
            invalidatesTags: ["Teams"],
        }),
        deleteTeam: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/teams/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Teams"],
        }),
    }),
});

export const {
    useGetTeamsQuery,
    useCreateTeamMutation,
    useUpdateTeamMutation,
    useRateTeamMutation,
    useDeleteTeamMutation,
} = teamsApi;
