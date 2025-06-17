import {Route, Routes, Navigate} from "react-router";
import DashboardPage from "../pages/Dashboard.page.jsx";
import ConversationsPage from "../pages/Conversations/Conversations.page.jsx";
import AnalyticsPage from "../pages/Analytics.page.jsx";
import HRManagementPage from "../pages/HR/HRManagement.page.jsx";
import ProjectsPage from "../pages/Projects/Projects.page.jsx";
import TasksPage from "../pages/Tasks/Tasks.page.jsx";
import SocialMediaPage from "../pages/SocialMedia/SocialMedia.page.jsx";
import SettingPage from "../pages/Setting/Setting.page.jsx";
import CreateProjectForm from "../pages/Projects/Components/CreateProjectForm/CreateProjectForm.jsx";
import ProjectDetailes from "../pages/Projects/Components/ProjectDetails/ProjectDetailes.jsx";
import TaskDetails from "../pages/Tasks/TaskDetailes/TaskDetails.jsx";
import CreateTask from "../pages/Tasks/CreateTask.jsx";
import EmployeeProfilePage from "../pages/Profile/EmployeeProfile.page.jsx";
import TimeLinePage from "../pages/TimeLine.page.jsx";
import Notifications from "../pages/Notifications/Notifications.jsx";
import MangerProfilePage from "../pages/Profile/MangerProfile.page.jsx";
import LoginPage from "../pages/Login/Login.page.jsx";
import RegisterPage from "../pages/Register/Register.page.jsx";
import EmailVerificationPage from "../pages/Register/EmailVerification.page.jsx";
import { useSelector } from "react-redux";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoute() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/email-verification-company" element={<EmailVerificationPage />} />

            {/* Protected Routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/conversations" element={
                <ProtectedRoute>
                    <ConversationsPage />
                </ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute>
                    <AnalyticsPage />
                </ProtectedRoute>
            } />
            <Route path="/projects" element={
                <ProtectedRoute>
                    <ProjectsPage />
                </ProtectedRoute>
            } />
            <Route path="projects/create" element={
                <ProtectedRoute>
                    <CreateProjectForm />
                </ProtectedRoute>
            } />
            <Route path="projects/:slug" element={
                <ProtectedRoute>
                    <ProjectDetailes />
                </ProtectedRoute>
            } />
            <Route path="/tasks" element={
                <ProtectedRoute>
                    <TasksPage />
                </ProtectedRoute>
            } />
            <Route path="/tasks/:slug" element={
                <ProtectedRoute>
                    <TaskDetails />
                </ProtectedRoute>
            } />
            <Route path="/tasks/create" element={
                <ProtectedRoute>
                    <CreateTask />
                </ProtectedRoute>
            } />
            <Route path="/social-media" element={
                <ProtectedRoute>
                    <SocialMediaPage />
                </ProtectedRoute>
            } />
            <Route path="/time-line" element={
                <ProtectedRoute>
                    <TimeLinePage />
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute>
                    <SettingPage />
                </ProtectedRoute>
            } />
            <Route path="/hr-management" element={
                <ProtectedRoute>
                    <HRManagementPage />
                </ProtectedRoute>
            } />
            <Route path="/notifications" element={
                <ProtectedRoute>
                    <Notifications />
                </ProtectedRoute>
            } />
            <Route path="/employee-profile/:slug" element={
                <ProtectedRoute>
                    <EmployeeProfilePage />
                </ProtectedRoute>
            } />
            <Route path="/manager-profile/:slug" element={
                <ProtectedRoute>
                    <MangerProfilePage />
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default AppRoute;