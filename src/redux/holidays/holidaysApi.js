import { apiSlice } from "../api/apiSlice";

export const holidaysApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHolidays: builder.query({
            query: (params) => ({
                url: "api/subscriber/organization/holidays",
                method: "GET",
                params,
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Holidays"],
        }),
        createHoliday: builder.mutation({
            query: (body) => ({
                url: "api/subscriber/organization/holidays",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Holidays"],
        }),
        updateHoliday: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `api/subscriber/organization/holidays/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Holidays"],
        }),
        deleteHoliday: builder.mutation({
            query: (id) => ({
                url: `api/subscriber/organization/holidays/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Holidays"],
        }),
    }),
});

export const {
    useGetHolidaysQuery,
    useCreateHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
} = holidaysApi;
