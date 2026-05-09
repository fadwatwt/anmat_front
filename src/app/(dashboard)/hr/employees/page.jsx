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
import CreateADepartmentModal from "@/app/(dashboard)/hr/_modals/CreateADepartmentModal.jsx";
import InviteEmployeeModal from "@/app/(dashboard)/hr/_modals/InviteEmployeeModal";
import { usePermission } from "@/Hooks/usePermission";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";

function HRPage() {
    const [isInviteEmployeeModal, setIsInviteEmployeeModal] = useState(false);
    const [isAddDepartmentModal, setIsAddDepartmentModal] = useState(false);
    const [activeTab, setActiveTab] = useState("Employees");

    const authUserType = useSelector(selectUserType);
    const isEmployee = authUserType === "Employee";

    const canViewEmployees = usePermission("employee_details.list");
    const canViewAttendances = usePermission("attendances.track_all") || usePermission("attendances.track_department");
    const canViewLeaves = usePermission("leaves.track_all") || usePermission("leaves.track_department");
    const canViewRequests = usePermission("employee_requests.track_all") || usePermission("employee_requests.track_department");
    const canViewSalary = usePermission("salary_transactions.track_all") || usePermission("salary_transactions.track_department");

    const tabsData = [
        ...(canViewEmployees ? [{
            title: "Employees",
            content: <EmployeesTap />,
        }] : []),
        ...(!isEmployee && canViewAttendances ? [{
            title: "Attendances",
            content: <AttendanceTab />,
        }] : []),
        ...(!isEmployee && canViewLeaves ? [{
            title: "Short Leaves",
            content: <LeavesTab />,
        }] : []),
        ...(!isEmployee && canViewRequests ? [{
            title: "Requests",
            content: <RequestsTab />,
        }] : []),
        ...(!isEmployee && canViewSalary ? [{
            title: "Salary",
            content: <SalaryTab />,
        }] : []),
        ...(canViewAttendances ? [{
            title: "Rotations",
            content: <RotationTap />,
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
                title={"HR - Employees Management"}
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
