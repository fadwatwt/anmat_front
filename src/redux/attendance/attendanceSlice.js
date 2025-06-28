import { createSlice } from "@reduxjs/toolkit";
import {
  deleteAttendance,
  fetchAllAttendance,
  recordCheckIn,
  recordCheckOut,
  updateAttendance,
} from "./attendanceAPI";

const initialState = {
  attendance: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendance.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.attendance[index] = action.payload;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = state.attendance.filter(
          (a) => a._id !== action.payload
        );
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(recordCheckIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordCheckIn.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendance.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.attendance[index] = action.payload;
        } else {
          state.attendance.push(action.payload);
        }
      })
      .addCase(recordCheckIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(recordCheckOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordCheckOut.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendance.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.attendance[index] = action.payload;
        } else {
          state.attendance.push(action.payload);
        }
      })
      .addCase(recordCheckOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
