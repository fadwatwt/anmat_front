import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./projects/projectSlice";
import employeeReduce from "./employees/employeeSlice";
import departmentReduce from "./departments/departmentSlice";
import accountsReducer from "./accounts/accountsSlice";
import rolesReducer from "./roles/rolesSlice";
import authReducer from "./auth/authSlice";
import attendanceReducer from "./attendance/attendanceSlice";
import tasksReducer from "./tasks/tasksSlice";
import rotationReducer from "./rotation/rotationSlice";
import financialReducer from "./financial/financialSlice";
import { conversationsAPI } from "./conversations/conversationsAPI";
import conversationsReducer from "./conversations/conversationsSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Single API Reducer
    [conversationsAPI.reducerPath]: conversationsAPI.reducer, // Keeping this if it uses a totally different URL/setup
    auth: authReducer,
    projects: projectReducer,
    employees: employeeReduce,
    departments: departmentReduce,
    roles: rolesReducer,
    attendance: attendanceReducer,
    accounts: accountsReducer,
    tasks: tasksReducer,
    rotation: rotationReducer,
    financials: financialReducer,
    conversations: conversationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      conversationsAPI.middleware
    ),
});
