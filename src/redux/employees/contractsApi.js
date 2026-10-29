import { apiSlice } from "../api/apiSlice";

const base = "api/subscriber/organization/employee-contracts";

export const contractsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeContracts: builder.query({ query: () => base, providesTags: ["EmployeeContracts"] }),
    getExpiringContracts: builder.query({ query: () => `${base}/expiring`, providesTags: ["EmployeeContracts"] }),
    getExpiringEmployeeDocuments: builder.query({ query: () => "api/subscriber/organization/employee-documents/expiring", transformResponse: (response) => response.data, providesTags: ["EmployeeDocuments"] }),
    getMyContracts: builder.query({ query: () => `${base}/mine`, providesTags: ["MyContracts"] }),
    createEmployeeContract: builder.mutation({
      query: (body) => ({ url: base, method: "POST", body }),
      invalidatesTags: ["EmployeeContracts"],
    }),
    updateEmployeeContract: builder.mutation({
      query: ({ id, body }) => ({ url: `${base}/${id}`, method: "PATCH", body }),
      invalidatesTags: ["EmployeeContracts"],
    }),
    approveEmployeeContract: builder.mutation({
      query: (id) => ({ url: `${base}/${id}/approve`, method: "POST" }),
      invalidatesTags: ["EmployeeContracts", "MyContracts"],
    }),
    acknowledgeMyContract: builder.mutation({
      query: (id) => ({ url: `${base}/mine/${id}/acknowledge`, method: "PATCH" }),
      invalidatesTags: ["MyContracts", "EmployeeContracts"],
    }),
  }),
});

export const {
  useGetEmployeeContractsQuery, useGetExpiringContractsQuery, useGetExpiringEmployeeDocumentsQuery, useGetMyContractsQuery,
  useCreateEmployeeContractMutation, useUpdateEmployeeContractMutation,
  useApproveEmployeeContractMutation, useAcknowledgeMyContractMutation,
} = contractsApi;
