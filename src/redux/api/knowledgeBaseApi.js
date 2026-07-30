import { apiSlice } from "./apiSlice";

export const knowledgeBaseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getKbEntries: builder.query({
            query: ({ page = 1, limit = 20, search, category } = {}) => ({
                url: "api/knowledge-base/entries",
                method: "GET",
                params: { page, limit, search, category },
            }),
            providesTags: ["KB"],
            transformResponse: (response) => response,
        }),
        getKbEntry: builder.query({
            query: (id) => ({
                url: `api/knowledge-base/entries/${id}`,
                method: "GET",
            }),
            providesTags: ["KB"],
            transformResponse: (response) => response.data || response,
        }),
        createKbEntry: builder.mutation({
            query: (body) => ({
                url: "api/knowledge-base/entries",
                method: "POST",
                body,
            }),
            invalidatesTags: ["KB"],
            transformResponse: (response) => response.data || response,
        }),
        updateKbEntry: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `api/knowledge-base/entries/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["KB"],
            transformResponse: (response) => response.data || response,
        }),
        deleteKbEntry: builder.mutation({
            query: (id) => ({
                url: `api/knowledge-base/entries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["KB"],
        }),
        uploadKbFile: builder.mutation({
            query: ({ title, category, file }) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("title", title);
                if (category) formData.append("category", category);
                return {
                    url: "api/knowledge-base/upload",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["KB"],
            transformResponse: (response) => response.data || response,
        }),
    }),
});

export const {
    useGetKbEntriesQuery,
    useGetKbEntryQuery,
    useCreateKbEntryMutation,
    useUpdateKbEntryMutation,
    useDeleteKbEntryMutation,
    useUploadKbFileMutation,
} = knowledgeBaseApi;
