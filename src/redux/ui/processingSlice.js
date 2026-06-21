import { createSlice } from "@reduxjs/toolkit";

// Tracks in-flight mutations so a global overlay can show "Processing..."
// automatically for every write request, without each call site wiring it up.
const initialState = {
    // Count of currently in-flight (non-silent) mutations.
    pendingCount: 0,
};

const processingSlice = createSlice({
    name: "processing",
    initialState,
    reducers: {
        mutationStarted: (state) => {
            state.pendingCount += 1;
        },
        mutationSettled: (state) => {
            state.pendingCount = Math.max(0, state.pendingCount - 1);
        },
    },
});

export const { mutationStarted, mutationSettled } = processingSlice.actions;

export const selectIsMutating = (state) => state.processing.pendingCount > 0;

export default processingSlice.reducer;
