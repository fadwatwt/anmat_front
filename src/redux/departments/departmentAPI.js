import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootRoute } from "../../Root.Route";
const getAuthConfig = (getState) => {
  const token = getState()?.auth?.token || localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
// Fetch all departments
export const fetchDepartments = createAsyncThunk(
  "departments/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `${RootRoute}/departments`,
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

// Update department
export const updateDepartment = createAsyncThunk(
  "departments/update",
  async ({ id, departmentData }, { rejectWithValue, getState }) => {
    try {
      if (!id) throw new Error("Department ID is required");

      const response = await axios.patch(
        `${RootRoute}/departments/${id}`,
        departmentData,
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

// Delete department
export const deleteDepartment = createAsyncThunk(
  "departments/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      if (!id) throw new Error("Department ID is required");

      await axios.delete(
        `${RootRoute}/departments/${id}`,
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
