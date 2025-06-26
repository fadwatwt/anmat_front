import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootRoute } from "../../Root.Route";

// Fetch all departments
export const fetchDepartments = createAsyncThunk(
  "departments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${RootRoute}/departments`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update department
export const updateDepartment = createAsyncThunk(
  "departments/update",
  async ({ id, departmentData }, { rejectWithValue }) => {
    try {
      console.log({ departmentData });

      const response = await axios.patch(
        `${RootRoute}/departments/${id}`,
        departmentData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete department
export const deleteDepartment = createAsyncThunk(
  "departments/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${RootRoute}/departments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
