import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchProjectsApi,
  deleteProjectApi,
  updateProjectApi,
} from "./projectApi";

const initialState = {
  projects: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    rowsPerPage: 5,
    totalPages: 1,
  },
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { getState }) => {
    const { pagination } = getState().projects;
    const response = await fetchProjectsApi(pagination);
    return response;
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId) => {
    await deleteProjectApi(projectId);
    return projectId; // Return the ID of the deleted project
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async (project) => {
    const response = await updateProjectApi(project);
    return response;
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setPagination(state, action) {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload.data; // Set projects to the `data` array
        state.pagination.totalPages = action.payload.totalPages; // Set totalPages
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        // Use the correct ID field (e.g., `_id` if that's what your project objects use)
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id // Use the correct ID field
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      });
  },
});

export const { setPagination } = projectSlice.actions;
export default projectSlice.reducer;
