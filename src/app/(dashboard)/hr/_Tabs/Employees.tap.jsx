import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../../components/Tables/Table.jsx";
import EditAnEmployeeModal from "@/app/(dashboard)/hr/_modals/EditAnEmployeeModal.jsx";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import Rating from "../Rating.jsx";
import Alert from "../../../../components/Alert.jsx";
import {
  fetchEmployees,
  deleteEmployee,
} from "@/redux/employees/employeeAPI";

function EmployeesTap() {
  const dispatch = useDispatch();
  const { employees, error } = useSelector((state) => state.employees);
  const { t } = useTranslation();

  // State for modals and alerts
  const [isEditEmployeeModal, setIsEditEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDeleteEmployee, setSelectedDeleteEmployee] = useState(null);
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [isOpenSuccessDeleteAlert, setIsOpenSuccessDeleteAlert] =
    useState(false);

  // State for search and filtered employees
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  // Table headers
  const headers = [
    { label: t("Employees"), width: "200px" },
    { label: t("Department"), width: "150px" },
    { label: t("Work type"), width: "150px" },
    { label: t("Salary"), width: "100px" },
    { label: t("Score"), width: "100px" },
    { label: "", width: "50px" },
  ];

  // Fetch employees on component mount
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Update filtered employees when employees or search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [employees, searchTerm]);

  // Calculate current page's employees
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Generate table rows from filtered employees
  const EmployeeRowTable = (employeesToShow) => {
    return employeesToShow?.map((employee, index) => [
      <AccountDetails
        key={`account-details-${index}`}
        path={`/employee-profile/${employee._id}-${encodeURIComponent(
          employee.name
        )}`}
        account={{
          name: employee.name,
          rule: employee.role?.name || "N/A",
          imageProfile:
            employee?.profilePicture ||
            "https://ui-avatars.com/api/?name=John+Doe",
        }}
      />,
      <p key={`department-${index}`} className="text-sm dark:text-sub-300">
        {employee.department?.name || "N/A"}
      </p>,
      <p key={`work-type-${index}`} className="text-sm dark:text-sub-300">
        {employee.jobType || employee.workType || "N/A"}
      </p>,
      <p key={`salary-${index}`} className="text-sm dark:text-sub-300">
        ${employee.financial?.salary?.toLocaleString() || 0}
      </p>,
      <Rating key={`rating-${index}`} value={employee.score / 20} />,
    ]);
  };

  // Handle opening the edit modal
  const handleEditEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeModal(true);
  };

  // Handle opening the delete alert
  const handleDeleteEmployee = (employee) => {
    console.log("Employee selected for deletion:", employee); // Debugging
    setSelectedDeleteEmployee(employee);
    setIsOpenDeleteAlert(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = async (isConfirmed) => {
    setIsOpenDeleteAlert(false);
    if (isConfirmed && selectedDeleteEmployee) {
      try {
        await dispatch(deleteEmployee(selectedDeleteEmployee._id));
        setIsOpenSuccessDeleteAlert(true);
        dispatch(fetchEmployees()); // Refresh the employee list
      } catch (error) {
        console.error("Delete employee failed:", error);
      }
    }
  };

  // Handle search input change
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 h-full">
          <Table
            title="All Employees"
            headers={headers}
            handelDelete={(index) =>
              handleDeleteEmployee(filteredEmployees[index])
            }
            handelEdit={(index) =>
              handleEditEmployeeModal(filteredEmployees[index])
            }
            isActions={true}
            rows={EmployeeRowTable(filteredEmployees)}
            isFilter={true}
            onSearch={handleSearch} // Pass search handler to Table
          />
        </div>
      </div>

      {/* Edit Employee Modal */}
      <EditAnEmployeeModal
        isOpen={isEditEmployeeModal}
        employee={selectedEmployee}
        onClose={() => setIsEditEmployeeModal(false)}
      />

      {/* Delete Confirmation Alert */}
      <Alert
        type="warning"
        title="Delete Employee?"
        message="Are you sure you want to delete this employee?"
        onSubmit={handleDeleteConfirmation}
        titleCancelBtn="Cancel"
        titleSubmitBtn="Delete"
        isOpen={isOpenDeleteAlert}
        onClose={() => setIsOpenDeleteAlert(false)}
        isBtns={1}
      />

      {/* Success Delete Alert */}
      <Alert
        type="success"
        title="Employee Deleted"
        isBtns={false}
        message={`The employee ${selectedDeleteEmployee?.name} and all associated data have been successfully deleted.`}
        isOpen={isOpenSuccessDeleteAlert}
        onClose={() => setIsOpenSuccessDeleteAlert(false)}
      />
    </>
  );
}

export default EmployeesTap;
