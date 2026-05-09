"use client";
import Page from "@/components/Page.jsx";
import Tabs from "@/components/Tabs.jsx";
import EmployeesTap from "@/app/(dashboard)/hr/employees/tabs/Employees.tap.jsx";
import { useState } from "react";
import AddingAnEmployeeModal from "@/app/(dashboard)/hr/_modals/AddingAnEmployeeModal.jsx";
import DepartmentsTab from "@/app/(dashboard)/hr/_Tabs/DepartmentsTab.jsx";
import RotationTap from "@/app/(dashboard)/hr/_Tabs/RotationTap.jsx";
import AttendanceTab from "@/app/(dashboard)/hr/employees/tabs/AttendanceTab.jsx";
import FinancialsTab from "@/app/(dashboard)/hr/_Tabs/financialData.jsx";
import CreateADepartmentModal from "@/app/(dashboard)/hr/_modals/CreateADepartmentModal.jsx";
import InviteEmployeeModal from "./_modals/InviteEmployeeModal";
import EditAnEmployeeModal from "@/app/(dashboard)/hr/_modals/AddingAnEmployeeModal.jsx";
import { usePermission } from "@/Hooks/usePermission";

function HRPage() {
  const [isEditEmployeeModal, setIsEditEmployeeModal] = useState(false);
  const [isInviteEmployeeModal, setIsInviteEmployeeModal] = useState(false);
  const [isAddDepartmentModal, setIsAddDepartmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Employees");
  const canCreateDepartment = usePermission("departments.create");
  const canCreateEmployee = usePermission("employee_details.create");

  const canListEmployees = usePermission("employee_details.list");
  const canListDepartments = usePermission("departments.list");
  const canViewAttendances = usePermission("attendances.track_all") || usePermission("attendances.track_department");
  const canViewFinancials = usePermission("salary_transactions.track_all") || usePermission("salary_transactions.track_department");

  const tabsData = [
    ...(canListEmployees ? [{
      title: "Employees",
      content: <EmployeesTap />,
    }] : []),
    ...(canListDepartments ? [{
      title: "Departments",
      content: <DepartmentsTab />,
    }] : []),
    ...(canViewAttendances ? [{
      title: "Rotation",
      content: <RotationTap />,
    }] : []),
    ...(canViewAttendances ? [{
      title: "Attendance",
      content: <AttendanceTab />,
    }] : []),
    ...(canViewFinancials ? [{
      title: "Financials",
      content: <FinancialsTab />,
    }] : []),
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
        title={"HR Management"}
        isBtn={
          activeTab === "Departments"
            ? canCreateDepartment
            : activeTab === "Employees"
              ? canCreateEmployee
              : false
        }
        btnOnClick={
          activeTab === "Departments"
            ? handelAddDepartmentModal
            : handleInviteEmployeeModal
        }
        btnTitle={
          activeTab === "Departments"
            ? "Create a Department"
            : "Add an Employee"
        }
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
