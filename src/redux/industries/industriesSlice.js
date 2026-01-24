import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedIndustryId: null,
};

const industriesSlice = createSlice({
    name: "industries",
    initialState,
    reducers: {
        setSelectedIndustryId: (state, action) => {
            state.selectedIndustryId = action.payload;
        },
        clearSelectedIndustryId: (state) => {
            state.selectedIndustryId = null;
        },
    },
});

export const { setSelectedIndustryId, clearSelectedIndustryId } = industriesSlice.actions;

export const selectSelectedIndustryId = (state) => state.industries.selectedIndustryId;

export default industriesSlice.reducer;
