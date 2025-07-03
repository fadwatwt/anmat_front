import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootRoute } from "../../Root.Route";

export const fetchFinancials = createAsyncThunk(
  "financials/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${RootRoute}/financials`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateFinancialRecord = createAsyncThunk(
  "financials/update",
  async ({ id, employeeId, financialData }, { rejectWithValue }) => {
    try {
      // Use employeeId as the parameter for the update endpoint
      // Fall back to id if employeeId is not provided
      const idToUse = employeeId || id;

      // Validate that we have a valid ID
      if (!idToUse || idToUse === "undefined") {
        throw new Error("No valid ID provided for financial record update");
      }

      const response = await axios.patch(
        `${RootRoute}/financials/${idToUse}`,
        financialData
      );
      return response.data.data;
    } catch (error) {
      console.error("Update financial error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFinancialRecord = createAsyncThunk(
  "financials/delete",
  async (id, { rejectWithValue }) => {
    try {
      // The backend expects the employee ID as part of the URL
      await axios.delete(`${RootRoute}/financials/${id}`);
      return id; // Return the ID for state updates
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSalaryAdvanceRequest = createAsyncThunk(
  "financials/createAdvanceRequest",
  async ({ employeeId, requestData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${RootRoute}/financials/${employeeId}/advance-requests`,
        requestData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createLeaveRequest = createAsyncThunk(
  "financials/createLeaveRequest",
  async ({ employeeId, requestData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${RootRoute}/financials/${employeeId}/leave-requests`,
        requestData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSalaryAdvanceStatus = createAsyncThunk(
  "financials/updateAdvanceStatus",
  async ({ employeeId, requestId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${RootRoute}/financials/advance/${employeeId}/${requestId}`,
        { status }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
