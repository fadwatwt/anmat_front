// src/redux/todos/todoSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootRoute } from "../../Root.Route";

export const fetchTodosByEmployee = createAsyncThunk(
  "todos/fetchTodosByEmployee",
  async (employeeId, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${RootRoute}/todos/employee/${employeeId}/todos`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async ({ employeeId, todoData }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${RootRoute}/todos/employee/${employeeId}/todos`,
        todoData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ todoId, todoData }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${RootRoute}/todos/todos/${todoId}`,
        todoData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo", // Fixed the action name here (removed duplicate "todos/")
  async (todoId, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${RootRoute}/todos/${todoId}`, config);
      return todoId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosByEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodosByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        // Make sure we're handling the response structure correctly
        state.todos = Array.isArray(action.payload.data)
          ? action.payload.data
          : Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchTodosByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both response structures (direct or nested in data property)
        const newTodo = action.payload.data || action.payload;
        state.todos = [...state.todos, newTodo];
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both response structures (direct or nested in data property)
        const updatedTodo = action.payload.data || action.payload;
        state.todos = state.todos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo
        );
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default todoSlice.reducer;
