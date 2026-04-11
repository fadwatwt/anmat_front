import { createSlice } from "@reduxjs/toolkit";
import {
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from "./employeeAPI";

const initialState = {
    employees: [],
    loading: false,
    error: null,
};

const employeeSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.employees.push(action.payload);
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.map((emp) =>
                    emp._id === action.payload._id ? action.payload : emp
                );
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.filter(
                    (emp) => emp._id !== action.payload
                );
            });
    },
});

export default employeeSlice.reducer;
