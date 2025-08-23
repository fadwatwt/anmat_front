import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootRoute } from "../../Root.Route";

// Fetch all departments
export const fetchDepartments = createAsyncThunk(
  "departments/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get(`${RootRoute}/departments`, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update department
export const updateDepartment = createAsyncThunk(
  "departments/update",
  async ({ id, departmentData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const response = await axios.patch(
        `${RootRoute}/departments/${id}`,
        departmentData,
        config
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete department
export const deleteDepartment = createAsyncThunk(
  "departments/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      await axios.delete(`${RootRoute}/departments/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
