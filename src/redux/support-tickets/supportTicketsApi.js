import { apiSlice } from "../api/apiSlice";

export const supportTicketsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSupportTickets: builder.query({
            query: () => ({
                url: "api/support-tickets",
                method: "GET",
            }),
            providesTags: ["SupportTickets"],
        }),
        getSupportMetrics: builder.query({
            query: () => ({
                url: "api/support-tickets/admin/metrics",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["SupportTickets"],
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
            invalidatesTags: ["SupportTickets"],
        }),
        updateSupportTicketStatus: builder.mutation({
            query: ({ id, ...changes }) => ({
                url: `api/support-tickets/${id}`,
                method: "PATCH",
                body: changes,
            }),
            invalidatesTags: (result, error, { id }) => ["SupportTickets", { type: "SupportTickets", id }],
        }),
        addSupportTicketMessage: builder.mutation({
            query: ({ id, data }) => ({
                url: `api/support-tickets/${id}/messages`,
                method: "POST",
                body: data,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => ["SupportTickets", { type: "SupportTickets", id }],
        }),
        getSupportTicketMessages: builder.query({
            query: (id) => ({
                url: `api/support-tickets/${id}/messages`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "SupportTickets", id }],
        }),
        deleteSupportTicket: builder.mutation({
            query: (id) => ({
                url: `api/support-tickets/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SupportTickets"],
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
    useDeleteSupportTicketMutation,
} = supportTicketsApi;
