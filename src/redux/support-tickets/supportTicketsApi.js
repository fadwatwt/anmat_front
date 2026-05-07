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
            query: ({ id, status }) => ({
                url: `api/support-tickets/${id}`,
                method: "PATCH",
                body: { status },
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
    }),
});

export const {
    useGetSupportTicketsQuery,
    useGetSupportTicketDetailsQuery,
    useCreateSupportTicketMutation,
    useUpdateSupportTicketStatusMutation,
    useAddSupportTicketMessageMutation,
    useGetSupportTicketMessagesQuery,
} = supportTicketsApi;
