import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootRoute } from "../../Root.Route";

export const fetchAllRotations = createAsyncThunk(
  "rotation/fetchAll",
  async (dateRange, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${RootRoute}/rotation`, {
        params: dateRange,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
