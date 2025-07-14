import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFinancials,
  updateFinancialRecord,
  deleteFinancialRecord,
  createSalaryAdvanceRequest,
  createLeaveRequest,
  updateSalaryAdvanceStatus,
} from "./financialAPI";

const initialState = {
  financials: [],
  loading: false,
  error: null,
};

const financialSlice = createSlice({
  name: "financials",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch financials
      .addCase(fetchFinancials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancials.fulfilled, (state, action) => {
        state.loading = false;
        state.financials = action.payload;
      })
      .addCase(fetchFinancials.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch financial records";
      })

      // Update financial record
      .addCase(updateFinancialRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFinancialRecord.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific financial record in the state
        state.financials = state.financials.map((financial) =>
          financial._id === action.payload._id ? action.payload : financial
        );
      })
      .addCase(updateFinancialRecord.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update financial record";
      })

      // Delete financial record
      .addCase(deleteFinancialRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFinancialRecord.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted financial record from the state
        state.financials = state.financials.filter(
          (financial) => financial._id !== action.payload
        );
      })
      .addCase(deleteFinancialRecord.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to delete financial record";
      })

      // Create salary advance request
      .addCase(createSalaryAdvanceRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSalaryAdvanceRequest.fulfilled, (state) => {
        state.loading = false;
        // The full updated state will be fetched again, no need to update here
      })
      .addCase(createSalaryAdvanceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create salary advance request";
      })

      // Create leave request
      .addCase(createLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveRequest.fulfilled, (state) => {
        state.loading = false;
        // The full updated state will be fetched again, no need to update here
      })
      .addCase(createLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create leave request";
      })

      // Update salary advance status
      .addCase(updateSalaryAdvanceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSalaryAdvanceStatus.fulfilled, (state) => {
        state.loading = false;
        // The full updated state will be fetched again, no need to update here
      })
      .addCase(updateSalaryAdvanceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update salary advance status";
      });
  },
});

export const { clearErrors } = financialSlice.actions;
export default financialSlice.reducer;
