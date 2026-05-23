import { apiSlice } from "../api/apiSlice";

export const tokenPackagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTokenPackages: builder.query({
            query: () => ({
                url: "api/ai/admin/token-packages",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["TokenPackages"],
        }),
        createTokenPackage: builder.mutation({
            query: (newPackage) => ({
                url: "api/ai/admin/token-packages",
                method: "POST",
                body: newPackage,
            }),
            invalidatesTags: ["TokenPackages"],
        }),
        updateTokenPackage: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `api/ai/admin/token-packages/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["TokenPackages"],
        }),
        deleteTokenPackage: builder.mutation({
            query: (id) => ({
                url: `api/ai/admin/token-packages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TokenPackages"],
        }),
        seedTokenPackages: builder.mutation({
            query: () => ({
                url: "api/ai/admin/token-packages/seed",
                method: "POST",
            }),
            invalidatesTags: ["TokenPackages"],
        }),
    }),
});

export const {
    useGetTokenPackagesQuery,
    useCreateTokenPackageMutation,
    useUpdateTokenPackageMutation,
    useDeleteTokenPackageMutation,
    useSeedTokenPackagesMutation,
} = tokenPackagesApi;
