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
import { useTranslation } from "react-i18next";

function HRPage() {
  const { t } = useTranslation();
  const [isEditEmployeeModal, setIsEditEmployeeModal] = useState(false);
  const [isInviteEmployeeModal, setIsInviteEmployeeModal] = useState(false);
  const [isAddDepartmentModal, setIsAddDepartmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Employees");
  const canCreateDepartment = usePermission("departments.create");
  const canCreateEmployee = usePermission("employee_details.create");

  const canListEmployees = usePermission("employee_details.list");
  const canListDepartments = usePermission("departments.list");
  const canTrackAllAttendances = usePermission("attendances.track_all");
  const canTrackDeptAttendances = usePermission("attendances.track_department");
  const canViewAttendances = canTrackAllAttendances || canTrackDeptAttendances;
  const canTrackAllFinancials = usePermission("salary_transactions.track_all");
  const canTrackDeptFinancials = usePermission("salary_transactions.track_department");
  const canViewFinancials = canTrackAllFinancials || canTrackDeptFinancials;

  const tabsData = [
    ...(canListEmployees ? [{
      title: t("Employees"),
      content: <EmployeesTap />,
    }] : []),
    ...(canListDepartments ? [{
      title: t("Departments"),
      content: <DepartmentsTab />,
    }] : []),
    ...(canViewAttendances ? [{
      title: t("Rotation"),
      content: <RotationTap />,
    }] : []),
    ...(canViewAttendances ? [{
      title: t("Attendance"),
      content: <AttendanceTab />,
    }] : []),
    ...(canViewFinancials ? [{
      title: t("Financials"),
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
        title={t("HR Management")}
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
            ? t("Create a Department")
            : t("Add an Employee")
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
