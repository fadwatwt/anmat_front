import { apiSlice } from "../api/apiSlice";

export const positionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPositions: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/positions",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Positions"],
        }),
        createPosition: builder.mutation({
            query: (newPosition) => ({
                url: "api/subscriber/organization/positions",
                method: "POST",
                body: newPosition,
            }),
            invalidatesTags: ["Positions"],
        }),
    }),
});

export const {
    useGetPositionsQuery,
    useCreatePositionMutation,
} = positionsApi;
