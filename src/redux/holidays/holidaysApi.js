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
        getGroupHolidays: builder.query({
            query: () => ({ url: "api/subscriber/organization/group-holidays", method: "GET" }),
            transformResponse: (response) => response.data,
            providesTags: ["Holidays"],
        }),
        previewGroupHoliday: builder.mutation({
            query: (body) => ({ url: "api/subscriber/organization/group-holidays/preview", method: "POST", body }),
        }),
        createGroupHoliday: builder.mutation({
            query: (body) => ({ url: "api/subscriber/organization/group-holidays", method: "POST", body }),
            invalidatesTags: ["Holidays"],
        }),
        cancelGroupHoliday: builder.mutation({
            query: ({ id, reason }) => ({ url: `api/subscriber/organization/group-holidays/${id}/cancel`, method: "POST", body: { reason } }),
            invalidatesTags: ["Holidays"],
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
    useGetGroupHolidaysQuery,
    usePreviewGroupHolidayMutation,
    useCreateGroupHolidayMutation,
    useCancelGroupHolidayMutation,
    useCreateHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
} = holidaysApi;
