// src/redux/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getToken, setToken, clearToken, syncAuthCookie } from "@/utils/tokenStorage";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false, // Added authentication flag
  permissions: [], // Permission names for current user; ['*'] = full access
  permissionsLoaded: false,
  socialMediaGrants: [], // Platforms (account types) granted to this subscriber
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
      const { access_token, user, remember } = action.payload.data;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
      state.error = null;

      // "Remember Me": true → localStorage (survives browser restart),
      // false → sessionStorage only (cleared when the browser closes).
      // Defaults to true so existing callers keep the persistent behavior.
      setToken(access_token, remember !== false);
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
      state.socialMediaGrants = [];

      // Clear token from both storages on logout
      clearToken();
      if (typeof window !== "undefined") {
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
      }
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload || [];
      state.permissionsLoaded = true;
    },
    setSocialMediaGrants: (state, action) => {
      state.socialMediaGrants = action.payload || [];
    },
    // Add this to load auth state from localStorage on page refresh
    loadAuthState: (state) => {
      const token = getToken();

      if (token) {
        state.token = token;
        // We don't restore user from local storage anymore
        state.isAuthenticated = true;
        // Migrate pre-middleware sessions: rewrite cookie so middleware sees it
        try {
          syncAuthCookie();
        } catch {
          // ignore — client guard in (dashboard)/layout.jsx remains fallback
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
  setSocialMediaGrants,
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
export const selectSocialMediaGrants = (state) => state.auth.socialMediaGrants;

export default authSlice.reducer;
