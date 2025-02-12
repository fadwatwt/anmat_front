import {useState} from "react";
import {useTranslation} from "react-i18next";
import Table from "../../../components/Tables/Table.jsx";
import EditAnEmployeeModal from "../modals/EditAnEmployeeModal.jsx";
import AccountDetails from "../../Projects/Components/TableInfo/AccountDetails.jsx";
import Rating from "../Rating.jsx";
import {employees} from "../../../functions/FactoryData.jsx";
import {convertToSlug} from "../../../functions/AnotherFunctions.js";
import Alert from "../../../components/Alert.jsx";

function EmployeesTap() {
    const {t} = useTranslation();
    const [isEditEmployeeModal, setIsEditEmployeeModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDeleteEmployee, setSelectedDeleteEmployee] = useState(null);
    const [isOpenDeleteAlert,setIsOpenDeleteAlert] = useState(false)
    const [isOpenSuccessDeleteAlert,setIsOpenSuccessDeleteAlert] = useState(false)

    const headers = [
        {label: t("Employees"), width: "200px"},
        {label: t("Department"), width: "150px"},
        {label: t("Work type"), width: "150px"},
        {label: t("Salary"), width: "100px"},
        {label: t("Score"), width: "100px"},
        {label: "", width: "50px"},
    ];

    const EmployeeRowTable = () => {
        return employees.map((employee,index) => [
            <AccountDetails
                key={`account-details-${index}`}
                path={`/employee-profile/${employee.id}-${encodeURIComponent(convertToSlug(employee.name))}`}
                account={{
                    name: employee.name,
                    rule: employee.role,
                    imageProfile: employee.imageProfile
                }}
            />,
            <p  key={`department-${index}`} className={"text-sm dark:text-sub-300"}>{employee.department}</p>,
            <p key={`jobType-${index}`} className={"text-sm dark:text-sub-300"}>{employee.jobType}</p>,
            <p key={`salary-${index}`} className={"text-sm dark:text-sub-300"}>{employee.salary}</p>,
            <Rating key={`rating-${index}`} value={employee.rating} />,
        ]);
    };

    const handelEditEmployeeModal = (employee) => {
        setSelectedEmployee(employee);
        setIsEditEmployeeModal(true);
    };
    const handelDeleteEmployee = (employee) => {
        setSelectedDeleteEmployee(employee)
        setIsOpenDeleteAlert(true)
    }
    const handleDeleteConfirmation = (isConfirmed) => {
        if (isConfirmed) {
            handelDeleteSuccessEmployee()
            console.log("تمت الموافقة على الحذف");
        } else {
            console.log("تم رفض الحذف");
        }
    };

    const handelDeleteSuccessEmployee = () => {
        setIsOpenSuccessDeleteAlert(true)
    }

    const rows = EmployeeRowTable()
    console.log(rows)

    return (
        <>
            <div className={"flex flex-col gap-6"}>
                <div className="flex flex-col gap-2 h-full">
                    <Table
                        className="custom-class"
                        title={"All Employees"}
                        headers={headers}
                        handelDelete={(index) => handelDeleteEmployee(employees[index])}
                        handelEdit={(index) => handelEditEmployeeModal(employees[index])}
                        isActions={true}
                        rows={rows}
                        isFilter={true}
                    />
                </div>
            </div>

            <EditAnEmployeeModal
                isOpen={isEditEmployeeModal}
                employee={selectedEmployee}
                onClose={() => setIsEditEmployeeModal(false)}
            />
            <Alert type={"warning"} title={"Delete Employee?"}
                   message={"Are you sure you want to delete this employee."}
                   onSubmit={handleDeleteConfirmation}
                   titleCancelBtn={"Cancel"}
                   titleSubmitBtn={"Delete"} isOpen={isOpenDeleteAlert} onClose={() => setIsOpenDeleteAlert(!isOpenDeleteAlert)} />

            <Alert type={"success"} title={"Employee Deleted"}
                   isBtns={false}
                   message={`The employee ${selectedDeleteEmployee?.name} and all associated data have been successfully deleted.`}
                   isOpen={isOpenSuccessDeleteAlert} onClose={() => setIsOpenSuccessDeleteAlert(false)} />
        </>
    );
}

export default EmployeesTap;
