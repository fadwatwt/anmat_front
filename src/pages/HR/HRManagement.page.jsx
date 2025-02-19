import Page from "../Page.jsx";
import Tabs from "../../components/Tabs.jsx";
import EmployeesTap from "./Tabs/Employees.tap.jsx";
import { useState} from "react";
import AddingAnEmployeeModal from "./modals/AddingAnEmployeeModal.jsx";
import DepartmentsTab from "./Tabs/DepartmentsTab.jsx";
import RotationTap from "./Tabs/RotationTap.jsx";
import AttendanceTab from "./Tabs/AttendanceTab.jsx";
import FinancialsTab from "./Tabs/financialData.jsx";
import EditDepartmentModal from "./modals/EditDepartmentModal.jsx";
import CreateADepartmentModal from "./modals/CreateADepartmentModal.jsx";

function HrManagementPage() {
  const [isAddEmployeeModal, setIsAddEmployeeModal] = useState(false);
  const [isAddDepartmentModal, setIsAddDepartmentModal] = useState(false);
  const [activeTab,setActiveTab] = useState("Employees");
  console.log(location.pathname)
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

  const handelAddDepartmentModal = () => {
    setIsAddDepartmentModal(!isAddDepartmentModal);
  };

  return (
    <>
      <Page
        title={"HR Management"}
        isBtn={true}
        btnOnClick={activeTab === "Departments" ? handelAddDepartmentModal : handelAddEmployeeModal}
        btnTitle={activeTab === "Departments" ? "Create a Department":"Add an Employee"}
      >
        <Tabs tabs={tabsData} setActiveTitleTab={setActiveTab} />
      </Page>

      <AddingAnEmployeeModal
        isOpen={isAddEmployeeModal}
        onClose={handelAddEmployeeModal}
      />
      <CreateADepartmentModal isOpen={isAddDepartmentModal} onClose={handelAddDepartmentModal} />
    </>
  );
}

export default HrManagementPage;
