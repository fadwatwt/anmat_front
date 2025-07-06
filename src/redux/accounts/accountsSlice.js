import { createSlice } from "@reduxjs/toolkit";
import {fetchAllAccounts} from "./accountsAPI.js";

const initialState = {
    accounts: [],
    loading: false,
    error: null,
};

const accountsSlice = createSlice({
    name: "accounts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAccounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.attendance = action.payload;
            })
            .addCase(fetchAllAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default accountsSlice.reducer;
