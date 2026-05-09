// src/redux/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false, // Added authentication flag
  permissions: [], // Permission names for current user; ['*'] = full access
  permissionsLoaded: false,
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
      state.permissions = [];
      state.permissionsLoaded = false;

      // Clear localStorage on logout
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
      }
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload || [];
      state.permissionsLoaded = true;
    },
    // Add this to load auth state from localStorage on page refresh
    loadAuthState: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        if (token) {
          state.token = token;
          // We don't restore user from local storage anymore
          state.isAuthenticated = true;
        }
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
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
  setUser,
  setPermissions,
  clearError,
} = authSlice.actions;

// Add this selector to easily access userId
export const selectUserId = (state) => state.auth.user?._id;
export const selectUserType = (state) => state.auth.user?.type;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuth = (state) => state.auth;
export const selectPermissions = (state) => state.auth.permissions;
export const selectPermissionsLoaded = (state) => state.auth.permissionsLoaded;

export default authSlice.reducer;
