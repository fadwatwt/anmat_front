import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./projects/projectSlice";
import employeeReduce from "./employees/employeeSlice";
import departmentReduce from "./departments/departmentSlice";
import rolesReducer from "./roles/rolesSlice"; // Import roles reducer

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    employees: employeeReduce,
    departments: departmentReduce,
    roles: rolesReducer,
  },
});
