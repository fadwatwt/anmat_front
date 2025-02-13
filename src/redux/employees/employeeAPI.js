import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootRoute } from "../../Root.Route";

// Fetch all employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${RootRoute}/employees`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${RootRoute}/employees/${id}`,
        employeeData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${RootRoute}/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
