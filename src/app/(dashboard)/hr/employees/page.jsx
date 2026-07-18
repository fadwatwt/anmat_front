"use client";
import Page from "@/components/Page.jsx";
import Tabs from "@/components/Tabs.jsx";
import EmployeesTap from "@/app/(dashboard)/hr/employees/tabs/Employees.tap.jsx";
import { useState } from "react";
import RotationTap from "@/app/(dashboard)/hr/_Tabs/RotationTap.jsx";
import AttendanceTab from "@/app/(dashboard)/hr/employees/tabs/AttendanceTab.jsx";
import SalaryTab from "@/app/(dashboard)/hr/employees/tabs/SalaryTab.jsx";
import RequestsTab from "@/app/(dashboard)/hr/employees/tabs/RequestsTab.jsx";
import LeavesTab from "@/app/(dashboard)/hr/employees/tabs/LeavesTab.jsx";
import NotificationsTap from "@/app/(dashboard)/hr/employees/tabs/NotificationsTap.jsx";
import CreateADepartmentModal from "@/app/(dashboard)/hr/_modals/CreateADepartmentModal.jsx";
import InviteEmployeeModal from "@/app/(dashboard)/hr/_modals/InviteEmployeeModal";
import { usePermission } from "@/Hooks/usePermission";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";
import { useTranslation } from "react-i18next";

function HRPage() {
    const { t } = useTranslation();
    const [isInviteEmployeeModal, setIsInviteEmployeeModal] = useState(false);
    const [isAddDepartmentModal, setIsAddDepartmentModal] = useState(false);
    const [activeTab, setActiveTab] = useState("Employees");

    const authUserType = useSelector(selectUserType);
    const isEmployee = authUserType === "Employee";

    const canViewEmployees = usePermission("employee_details.list");
    const canTrackAllAttendances = usePermission("attendances.track_all");
    const canTrackDeptAttendances = usePermission("attendances.track_department");
    const canViewAttendances = canTrackAllAttendances || canTrackDeptAttendances;
    const canTrackAllLeaves = usePermission("leaves.track_all");
    const canTrackDeptLeaves = usePermission("leaves.track_department");
    const canViewLeaves = canTrackAllLeaves || canTrackDeptLeaves;
    const canTrackAllRequests = usePermission("employee_requests.track_all");
    const canTrackDeptRequests = usePermission("employee_requests.track_department");
    const canViewRequests = canTrackAllRequests || canTrackDeptRequests;
    const canTrackAllSalary = usePermission("salary_transactions.track_all");
    const canTrackDeptSalary = usePermission("salary_transactions.track_department");
    const canViewSalary = canTrackAllSalary || canTrackDeptSalary;
    const canSendNotification = usePermission("notifications.create");

    const tabsData = [
        ...(canViewEmployees ? [{
            title: t("Employees"),
            content: <EmployeesTap />,
        }] : []),
        ...(!isEmployee && canViewAttendances ? [{
            title: t("Attendances"),
            content: <AttendanceTab />,
        }] : []),
        ...(!isEmployee && canViewLeaves ? [{
            title: t("Short Leaves"),
            content: <LeavesTab />,
        }] : []),
        ...(!isEmployee && canViewRequests ? [{
            title: t("Requests"),
            content: <RequestsTab />,
        }] : []),
        ...(!isEmployee && canViewSalary ? [{
            title: t("Salary"),
            content: <SalaryTab />,
        }] : []),
        ...(canViewAttendances ? [{
            title: t("Rotations"),
            content: <RotationTap />,
        }] : []),
        ...(canSendNotification ? [{
            title: t("Notifications"),
            content: <NotificationsTap />,
        }] : []),
    ];

    const handleInviteEmployeeModal = () => {
        setIsInviteEmployeeModal(!isInviteEmployeeModal);
    };

    const handelAddDepartmentModal = () => {
        setIsAddDepartmentModal(!isAddDepartmentModal);
    };

    return (
        <>
            {/* <LoginPage /> */}
            <Page
                title={t("HR - Employees Management")}
            >
                <Tabs tabs={tabsData} setActiveTitleTab={setActiveTab} />
            </Page>

            <InviteEmployeeModal
                isOpen={isInviteEmployeeModal}
                onClose={handleInviteEmployeeModal} />

            <CreateADepartmentModal
                isOpen={isAddDepartmentModal}
                onClose={handelAddDepartmentModal}
            />
        </>
    );
}

export default HRPage;
