
import Page from "../Page.jsx";
import Tabs from "../../components/Tabs.jsx";
import EmployeesTap from "./Tabs/Employees.tap.jsx";
import {useState} from "react";
import AddingAnEmployeeModal from "./modals/AddingAnEmployeeModal.jsx";

function HrManagementPage() {
    const [isAddEmployeeModal,setIsAddEmployeeModal] = useState(false)
    const tabsData = [
        {
            title: "Employees",
            content: <EmployeesTap />,
        },
        {
            title: "Departments",
            content: <div>Departments</div>,
        },
        {
            title: "Rotation",
            content: <div>Instagram content goes here</div>,
        },
        {
            title: "Attendance",
            content: <div>Gmail content goes here</div>,
        },
        {
            title: "Financials",
            content: <div>Gmail content goes here</div>,
        },
        {
            title: "Youtube",
            content: <div>Youtube content goes here</div>,
        },
    ];

    const handelAddEmployeeModal = () => {
        setIsAddEmployeeModal(!isAddEmployeeModal)
    }

    return (
        <>
        <Page title={"HR Management"} isBtn={true} btnOnClick={handelAddEmployeeModal} btnTitle={"Add an Employee"}>
            <Tabs tabs={tabsData}/>
        </Page>

            <AddingAnEmployeeModal isOpen={isAddEmployeeModal} onClose={handelAddEmployeeModal}  />
        </>
    );
}

export default HrManagementPage;