import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootRoute } from "../../Root.Route";

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${RootRoute}/tasks`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create new task
export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${RootRoute}/tasks`, taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${RootRoute}/tasks/${id}`, taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${RootRoute}/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Complete task
export const completeTask = createAsyncThunk(
  "tasks/complete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${RootRoute}/tasks/${id}/complete`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get task analytics
export const getTaskAnalytics = createAsyncThunk(
  "tasks/analytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${RootRoute}/tasks/analytics/task`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get tasks by status
export const getTasksByStatus = createAsyncThunk(
  "tasks/byStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${RootRoute}/tasks/status/all`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);