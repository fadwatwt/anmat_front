import {Route, Routes} from "react-router";
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
import Subscriptions from "../pages/Subscription/Subscriptions.page.jsx";

function AppRoute() {
    return (
        <Routes>
            <Route path={"/subscription"} element={<Subscriptions/>}></Route>
            <Route path={"/"} element={<DashboardPage/>}></Route>
            <Route path={"/conversations"} element={<ConversationsPage/>}></Route>
            <Route path={"/analytics"} element={<AnalyticsPage/>}></Route>
            <Route path={"/projects"} element={<ProjectsPage/>}></Route>
            <Route path={"projects/create"} element={<CreateProjectForm/>}></Route>
            <Route path={"projects/:slug"} element={<ProjectDetailes/>}></Route>
            <Route path={"/tasks"} element={<TasksPage/>}></Route>
            <Route path={"/tasks/:slug"} element={<TaskDetails/>}></Route>
            <Route path={"/tasks/create"} element={<CreateTask/>}></Route>
            <Route path={"/social-media"} element={<SocialMediaPage/>}></Route>
            <Route path={"/time-line"} element={<TimeLinePage/>}></Route>
            <Route path={"/settings"} element={<SettingPage/>}></Route>
            <Route path={"/hr-management"} element={<HRManagementPage/>}></Route>
                <Route path={"/notifications"} element={<Notifications />} />
            <Route path={"/employee-profile/:slug"} element={<EmployeeProfilePage />}></Route>
            <Route path={"/manager-profile/:slug"} element={<MangerProfilePage />}></Route>
        </Routes>
    );
}

export default AppRoute;