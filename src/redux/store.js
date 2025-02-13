import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./projects/projectSlice";
import employeeReduce from "./employees/employeeSlice";
export const store = configureStore({
  reducer: {
    projects: projectReducer,
    employees: employeeReduce,
  },
});
