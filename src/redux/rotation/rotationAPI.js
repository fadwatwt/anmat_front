import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootRoute } from "../../Root.Route";

export const fetchAllRotations = createAsyncThunk(
  "rotation/fetchAll",
  async (dateRange, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.token) {
        return rejectWithValue('No authentication token found. Please log in again.');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get(`${RootRoute}/rotation`, {
        params: dateRange,
        ...config,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
