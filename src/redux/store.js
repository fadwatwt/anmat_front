import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./projects/projectSlice";
import employeeReduce from "./employees/employeeSlice";
import departmentReduce from "./departments/departmentSlice";
import accountsReducer from "./accounts/accountsSlice";
import rolesReducer from "./roles/rolesSlice"; // Import roles reducer
import { authApi } from "./auth/authAPI";
import authReducer from "./auth/authSlice";
import attendanceReducer from "./attendance/attendanceSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    projects: projectReducer,
    employees: employeeReduce,
    departments: departmentReduce,
    roles: rolesReducer,
    attendance: attendanceReducer,
    accounts:accountsReducer
  },
});
