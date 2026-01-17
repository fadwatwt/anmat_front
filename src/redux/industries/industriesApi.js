import { apiSlice } from "../api/apiSlice";

export const industriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getIndustries: builder.query({
            query: () => ({
                url: "api/admin/industries",
                method: "GET",
            }),
            providesTags: ["Industries"],
        }),
        createIndustry: builder.mutation({
            query: (newIndustry) => ({
                url: "api/admin/industries",
                method: "POST",
                body: newIndustry,
            }),
            invalidatesTags: ["Industries"],
        }),
        deleteIndustry: builder.mutation({
            query: (id) => ({
                url: `api/admin/industries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Industries"],
        }),
    }),
});

export const {
    useGetIndustriesQuery,
    useCreateIndustryMutation,
    useDeleteIndustryMutation,
} = industriesApi;
