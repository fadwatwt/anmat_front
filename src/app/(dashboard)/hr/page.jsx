"use client";
import Page from "@/components/Page.jsx";
import Tabs from "@/components/Tabs.jsx";
import EmployeesTap from "@/app/(dashboard)/hr/_Tabs/Employees.tap.jsx";
import { useState } from "react";
import AddingAnEmployeeModal from "@/app/(dashboard)/hr/_modals/AddingAnEmployeeModal.jsx";
import DepartmentsTab from "@/app/(dashboard)/hr/_Tabs/DepartmentsTab.jsx";
import RotationTap from "@/app/(dashboard)/hr/_Tabs/RotationTap.jsx";
import AttendanceTab from "@/app/(dashboard)/hr/_Tabs/AttendanceTab.jsx";
import FinancialsTab from "@/app/(dashboard)/hr/_Tabs/financialData.jsx";
import CreateADepartmentModal from "@/app/(dashboard)/hr/_modals/CreateADepartmentModal.jsx";
import InviteEmployeeModal from "./_modals/InviteEmployeeModal";

function HRPage() {
  const [isAddEmployeeModal, setIsAddEmployeeModal] = useState(false);
  const [isInviteEmployeeModal, setIsInviteEmployeeModal] = useState(false);
  const [isAddDepartmentModal, setIsAddDepartmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Employees");

  const tabsData = [
    {
      title: "Employees",
      content: <EmployeesTap />,
    },
    {
      title: "Departments",
      content: <DepartmentsTab />,
    },
    {
      title: "Rotation",
      content: <RotationTap />,
    },
    {
      title: "Attendance",
      content: <AttendanceTab />,
    },
    {
      title: "Financials",
      content: <FinancialsTab />,
    },
  ];

  const handelAddEmployeeModal = () => {
    setIsAddEmployeeModal(!isAddEmployeeModal);
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
        isBtn={true}
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

      <AddingAnEmployeeModal
        isOpen={isAddEmployeeModal}
        onClose={handelAddEmployeeModal}
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
