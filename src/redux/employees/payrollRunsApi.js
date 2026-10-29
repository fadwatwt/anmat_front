import { apiSlice } from "../api/apiSlice";

const base = "api/subscriber/organization/payroll-runs";

export const payrollRunsApi = apiSlice.enhanceEndpoints({ addTagTypes: ["AccountingDelivery"] }).injectEndpoints({
  endpoints: (builder) => ({
    getMyPayslips: builder.query({ query: () => "api/employee/payslips" }),
    getPayrollCountryPacks: builder.query({ query: () => "api/subscriber/organization/payroll-country-packs" }),
    getPayrollRuns: builder.query({ query: () => base, providesTags: ["PayrollRuns"] }),
    createPayrollRun: builder.mutation({
      query: (body) => ({ url: base, method: "POST", body }), invalidatesTags: ["PayrollRuns"],
    }),
    calculatePayrollRun: builder.mutation({
      query: (id) => ({ url: `${base}/${id}/calculate`, method: "POST" }),
      invalidatesTags: ["PayrollRuns", "PayrollRunDetails"],
    }),
    transitionPayrollRun: builder.mutation({
      query: ({ id, body }) => ({ url: `${base}/${id}/status`, method: "PATCH", body }),
      invalidatesTags: ["PayrollRuns", "PayrollRunDetails"],
    }),
    getPayrollRunItems: builder.query({
      query: (id) => `${base}/${id}/items`, providesTags: ["PayrollRunDetails"],
    }),
    getPayrollRunExceptions: builder.query({
      query: (id) => `${base}/${id}/exceptions`, providesTags: ["PayrollRunDetails"],
    }),
    resolvePayrollException: builder.mutation({
      query: ({ id, resolution_note }) => ({ url: `${base}/exceptions/${id}/resolve`, method: "PATCH", body: { resolution_note } }),
      invalidatesTags: ["PayrollRunDetails"],
    }),
    getPayrollRunPayslips: builder.query({
      query: (id) => `${base}/${id}/payslips`, providesTags: ["PayrollRunDetails"],
    }),
    getPayrollRunAdjustments: builder.query({
      query: (id) => `${base}/${id}/adjustments`, providesTags: ["PayrollRunDetails"],
    }),
    createPayrollAdjustment: builder.mutation({
      query: (body) => ({ url: `${base}/adjustments`, method: "POST", body }),
      invalidatesTags: ["PayrollRunDetails"],
    }),
    cancelPayrollAdjustment: builder.mutation({
      query: ({ id, reason }) => ({ url: `${base}/adjustments/${id}/cancel`, method: "PATCH", body: { reason } }),
      invalidatesTags: ["PayrollRunDetails"],
    }),
    getAccountingDelivery: builder.query({
      query: (id) => `${base}/${id}/accounting-delivery`, providesTags: ["AccountingDelivery"],
    }),
    enqueueAccountingDelivery: builder.mutation({
      query: (id) => ({ url: `${base}/${id}/accounting-delivery`, method: "POST" }), invalidatesTags: ["AccountingDelivery"],
    }),
    retryAccountingDelivery: builder.mutation({
      query: (id) => ({ url: `${base}/${id}/accounting-delivery/retry`, method: "POST" }), invalidatesTags: ["AccountingDelivery"],
    }),
  }),
});

export const {
  useGetMyPayslipsQuery,
  useGetPayrollCountryPacksQuery, useGetPayrollRunsQuery,
  useCreatePayrollRunMutation, useCalculatePayrollRunMutation,
  useTransitionPayrollRunMutation, useGetPayrollRunItemsQuery,
  useGetPayrollRunExceptionsQuery, useResolvePayrollExceptionMutation,
  useGetPayrollRunPayslipsQuery, useGetPayrollRunAdjustmentsQuery,
  useCreatePayrollAdjustmentMutation, useCancelPayrollAdjustmentMutation,
  useGetAccountingDeliveryQuery, useEnqueueAccountingDeliveryMutation, useRetryAccountingDeliveryMutation,
} = payrollRunsApi;
