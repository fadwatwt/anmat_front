import Page from "../Page.jsx";
import Tabs from "../../components/Tabs.jsx";
import EmployeesTap from "./Tabs/Employees.tap.jsx";
import { useState } from "react";
import AddingAnEmployeeModal from "./modals/AddingAnEmployeeModal.jsx";
import DepartmentsTab from "./Tabs/DepartmentsTab.jsx";
import RotationTap from "./Tabs/RotationTap.jsx";
import AttendanceTab from "./Tabs/AttendanceTab.jsx";
import FinancialsTab from "./Tabs/financialData.jsx";

function HrManagementPage() {
  const [isAddEmployeeModal, setIsAddEmployeeModal] = useState(false);
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
    {
      title: "Youtube",
      content: <div>Youtube content goes here</div>,
    },
  ];

  const handelAddEmployeeModal = () => {
    setIsAddEmployeeModal(!isAddEmployeeModal);
  };

  return (
    <>
      <Page
        title={"HR Management"}
        isBtn={true}
        btnOnClick={handelAddEmployeeModal}
        btnTitle={"Add an Employee"}
      >
        <Tabs tabs={tabsData} />
      </Page>

      <AddingAnEmployeeModal
        isOpen={isAddEmployeeModal}
        onClose={handelAddEmployeeModal}
      />
    </>
  );
}

export default HrManagementPage;
