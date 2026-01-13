"use client";
import Page from "@/components/Page.jsx";
import Tabs from "@/components/Tabs.jsx";
import EmployeesTap from "@/app/(dashboard)/hr/employees/tabs/Employees.tap.jsx";
import { useState } from "react";
// import DepartmentsTab from "@/app/(dashboard)/hr/_Tabs/DepartmentsTab.jsx"; // Moved to sidebar
import RotationTap from "@/app/(dashboard)/hr/_Tabs/RotationTap.jsx";
import AttendanceTab from "@/app/(dashboard)/hr/employees/tabs/AttendanceTab.jsx";
import SalaryTab from "@/app/(dashboard)/hr/employees/tabs/SalaryTab.jsx";
import RequestsTab from "@/app/(dashboard)/hr/employees/tabs/RequestsTab.jsx";
import LeavesTab from "@/app/(dashboard)/hr/employees/tabs/LeavesTab.jsx";
import CreateADepartmentModal from "@/app/(dashboard)/hr/_modals/CreateADepartmentModal.jsx";
import EditAnEmployeeModal from "@/app/(dashboard)/hr/_modals/AddingAnEmployeeModal.jsx";
import InviteEmployeeModal from "@/app/(dashboard)/hr/_modals/InviteEmployeeModal";

function HRPage() {
    const [isEditEmployeeModal, setIsEditEmployeeModal] = useState(false);
    const [isInviteEmployeeModal, setIsInviteEmployeeModal] = useState(false);
    const [isAddDepartmentModal, setIsAddDepartmentModal] = useState(false);
    const [activeTab, setActiveTab] = useState("Employees");

    const tabsData = [
        {
            title: "Employees",
            content: <EmployeesTap />,
        },
        {
            title: "Attendances",
            content: <AttendanceTab />,
        },
        {
            title: "Leave",
            content: <LeavesTab />,
        },
        {
            title: "Requests",
            content: <RequestsTab />,
        },
        {
            title: "Salary",
            content: <SalaryTab />,
        },
        {
            title: "Rotations",
            content: <RotationTap />,
        },
    ];

    const handelEditEmployeeModal = () => {
        setIsEditEmployeeModal(!isEditEmployeeModal);
    };

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

            <EditAnEmployeeModal
                isOpen={isEditEmployeeModal}
                onClose={handelEditEmployeeModal}
                employee={{}} />

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
