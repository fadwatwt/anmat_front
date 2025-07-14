import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {ExternalServer} from "../../Root.Route.js";


export const fetchAllAccounts = createAsyncThunk(
    "accounts/fetchAll",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            };
            const response = await axios.get(`${ExternalServer}/accounts`, config);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);