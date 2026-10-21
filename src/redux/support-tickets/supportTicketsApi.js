import { apiSlice } from "../api/apiSlice";

export const supportTicketsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSupportTickets: builder.query({
            query: (params = {}) => ({
                url: "api/support-tickets",
                method: "GET",
                params,
            }),
            providesTags: [{ type: "SupportTickets", id: "LIST" }],
        }),
        getSupportMetrics: builder.query({
            query: () => ({
                url: "api/support-tickets/admin/metrics",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: [{ type: "SupportTickets", id: "METRICS" }],
        }),
        getSupportTicketDetails: builder.query({
            query: (id) => ({
                url: `api/support-tickets/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "SupportTickets", id }],
        }),
        createSupportTicket: builder.mutation({
            query: (data) => ({
                url: "api/support-tickets",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [
                { type: "SupportTickets", id: "LIST" },
                { type: "SupportTickets", id: "METRICS" },
            ],
        }),
        updateSupportTicketStatus: builder.mutation({
            query: ({ id, ...changes }) => ({
                url: `api/support-tickets/${id}`,
                method: "PATCH",
                body: changes,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "SupportTickets", id },
                { type: "SupportTickets", id: "LIST" },
                { type: "SupportTickets", id: "METRICS" },
                { type: "SupportTicketEvents", id },
            ],
        }),
        addSupportTicketMessage: builder.mutation({
            query: ({ id, data }) => ({
                url: `api/support-tickets/${id}/messages`,
                method: "POST",
                body: data,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "SupportTicketMessages", id },
                { type: "SupportTickets", id },
                { type: "SupportTickets", id: "LIST" },
                { type: "SupportTickets", id: "METRICS" },
            ],
        }),
        getSupportTicketMessages: builder.query({
            query: (id) => ({
                url: `api/support-tickets/${id}/messages`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "SupportTicketMessages", id }],
        }),
        getSupportTicketEvents: builder.query({
            query: (id) => ({
                url: `api/support-tickets/${id}/events`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "SupportTicketEvents", id }],
        }),
        deleteSupportTicket: builder.mutation({
            query: (id) => ({
                url: `api/support-tickets/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                { type: "SupportTickets", id: "LIST" },
                { type: "SupportTickets", id: "METRICS" },
            ],
        }),
    }),
});

export const {
    useGetSupportTicketsQuery,
    useGetSupportMetricsQuery,
    useGetSupportTicketDetailsQuery,
    useCreateSupportTicketMutation,
    useUpdateSupportTicketStatusMutation,
    useAddSupportTicketMessageMutation,
    useGetSupportTicketMessagesQuery,
    useGetSupportTicketEventsQuery,
    useDeleteSupportTicketMutation,
} = supportTicketsApi;
