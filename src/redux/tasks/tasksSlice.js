import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getTaskAnalytics,
  getTasksByStatus
} from "./tasksAPI";

const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  analytics: null,
  statusTasks: null
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(
          task => task._id !== action.payload
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Complete Task
      .addCase(completeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        );
      })

      // Get Analytics
      .addCase(getTaskAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })

      // Get Tasks by Status
      .addCase(getTasksByStatus.fulfilled, (state, action) => {
        state.statusTasks = action.payload;
      });
  }
});

export const { setCurrentTask, clearCurrentTask } = tasksSlice.actions;
export default tasksSlice.reducer;