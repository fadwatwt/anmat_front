// src/redux/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false, // Added authentication flag
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      const { access_token, user } = action.payload.data;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
      state.error = null;

      // Store auth data in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", access_token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userData", JSON.stringify(user));
      }
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage on logout
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
      }
    },
    // Add this to load auth state from localStorage on page refresh
    loadAuthState: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const userData = localStorage.getItem("userData");

        if (token && userId) {
          state.token = token;
          state.user = userData ? JSON.parse(userData) : { _id: userId };
          state.isAuthenticated = true;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  loadAuthState,
  clearError,
} = authSlice.actions;

// Add this selector to easily access userId
export const selectUserId = (state) => state.auth.user?._id;

export default authSlice.reducer;
