import { createSlice } from "@reduxjs/toolkit";
import { fetchAllRotations } from "./rotationAPI";

const initialState = {
  rotations: [],
  loading: false,
  error: null,
};

const rotationSlice = createSlice({
  name: "rotation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRotations.fulfilled, (state, action) => {
        state.loading = false;
        state.rotations = action.payload;
      })
      .addCase(fetchAllRotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default rotationSlice.reducer;