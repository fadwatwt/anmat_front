import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ExternalServer, RootRoute } from "../../Root.Route";

// Helper function for auth headers
const getAuthConfig = (getState) => {
  const token = getState()?.auth?.token || localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${RootRoute}/employees`,
        getAuthConfig(getState)
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new employee
export const createEmployee = createAsyncThunk(
  "employees/create",
  async (employeeData, { rejectWithValue, getState }) => {
    try {
      // Validate required fields
      if (!employeeData.name || !employeeData.email) {
        throw new Error("Name and email are required");
      }

      const config = getAuthConfig(getState);
      const response = await axios.post(
        `${RootRoute}/employees`,
        employeeData,
        config
      );

      // Sync with external server (if needed)
      try {
        await axios.post(
          `${ExternalServer}/users`,
          { ...employeeData, id: response.data.data._id },
          config
        );
      } catch (externalError) {
        console.warn("External server sync failed:", externalError);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        details: error.response?.data,
      });
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, employeeData }, { rejectWithValue, getState }) => {
    try {
      if (!id) throw new Error("Employee ID is required");

      const response = await axios.patch(
        `${RootRoute}/employees/${id}`,
        employeeData,
        getAuthConfig(getState)
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        details: error.response?.data,
      });
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      if (!id) throw new Error("Employee ID is required");

      await axios.delete(
        `${RootRoute}/employees/${id}`,
        getAuthConfig(getState)
      );
      return id;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        details: error.response?.data,
      });
    }
  }
);
