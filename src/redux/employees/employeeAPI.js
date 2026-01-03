import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {ExternalServer, RootRoute} from "../../Root.Route";
import {employeesFactory} from "@/functions/FactoryData";

// Fetch all employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (_, { rejectWithValue }) => {
      console.log("employeesFactory") // For Factory Testing
      return employeesFactory
    // try {
    //   const response = await axios.get(`${RootRoute}/employees`);
    //   return response.data.data;
    // } catch (error) {
    //   return rejectWithValue(error.response.data);
    // }
  }
);

// Create a new employee
export const createEmployee = createAsyncThunk(
  "employees/create",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${RootRoute}/employees`, employeeData);
      await axios.post(`${ExternalServer}/users`, {...employeeData,id:response.data.data._id},{
          headers: { Authorization: `Bearer ${'token'}`},
      })
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      console.log({ id, employeeData }); // here the id is correct but no data

      const response = await axios.patch(
        `${RootRoute}/employees/${id}`, // Removed leading space
        employeeData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Delete employee
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${RootRoute}/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);