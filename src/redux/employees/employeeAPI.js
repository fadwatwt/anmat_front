import { createAsyncThunk } from "@reduxjs/toolkit";

// Dummy file to satisfy legacy imports while migrating to RTK Query
export const fetchEmployees = createAsyncThunk(
    "employees/fetchAll",
    async (_, { rejectWithValue }) => {
        return [];
    }
);

export const createEmployee = createAsyncThunk(
    "employees/create",
    async (employeeData, { rejectWithValue }) => {
        return {};
    }
);

export const updateEmployee = createAsyncThunk(
    "employees/update",
    async ({ id, employeeData }, { rejectWithValue }) => {
        return {};
    }
);

export const deleteEmployee = createAsyncThunk(
    "employees/delete",
    async (id, { rejectWithValue }) => {
        return id;
    }
);
