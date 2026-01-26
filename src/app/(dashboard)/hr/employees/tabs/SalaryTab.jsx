import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { deleteFinancialRecord, updateFinancialRecord } from "@/redux/financial/financialAPI";
import Alert from "@/components/Alerts/Alert";
import EditSalaryModal from "../modals/EditSalaryModal";
import AddSalaryModal from "../modals/AddSalaryModal";
import { GoPlus } from "react-icons/go";

export default function SalaryTab() {
  const { t } = useTranslation();
  const { data: employees = [], isLoading, error } = useGetEmployeesQuery();
  const [selectedFinancial, setSelectedFinancial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

  // Filters state
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const headers = [
    { label: t("Employees"), width: "250px" },
    { label: t("Department"), width: "150px" },
    { label: t("Work Hours"), width: "150px" },
    { label: t("Salary Amount"), width: "120px" },
    { label: t("Bonus"), width: "100px" },
    { label: t("Deduction"), width: "100px" },
    { label: "", width: "50px" }, // Actions column
  ];

  const formattedData = useMemo(() => {
    return employees.map((employee) => {
      const detail = employee.employee_detail || {};
      return {
        id: employee._id,
        employeeId: employee._id,
        employee: {
          imageProfile: "https://ui-avatars.com/api/?name=" + (employee.name || "User"),
          name: employee.name,
          role: detail.position_id?.title || "Employee",
          department: detail.department_id?.name || "N/A",
        },
        department: detail.department_id?.name || "N/A",
        workHours: detail.work_hours ? `${detail.work_hours} hrs` : "N/A",
        salary: detail.salary || 0,
        bonus: 0, // Mocking or from other source if needed
        deduction: 0,
      };
    });
  }, [employees]);

  const rows = formattedData.map((row, index) => [
    <div key={`employee-${row.id || index}`} className="flex items-center gap-3">
      <img
        src={row.employee.imageProfile}
        alt={row.employee.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.employee.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{row.employee.role}</span>
      </div>
    </div>,
    <span key={`department-${row.id || index}`} className="text-sm text-gray-700 dark:text-gray-300">
      {row.department}
    </span>,
    <span key={`workHours-${row.id || index}`} className="text-sm text-gray-700 dark:text-gray-300">
      {row.workHours}
    </span>,
    <span key={`salary-${row.id || index}`} className="text-sm text-gray-700 dark:text-gray-300">
      {row.salary}$
    </span>,
    <span key={`bonus-${row.id || index}`} className="text-sm text-gray-700 dark:text-gray-300">
      {row.bonus}$
    </span>,
    <span key={`deduction-${row.id || index}`} className="text-sm text-gray-700 dark:text-gray-300">
      {row.deduction}$
    </span>,
  ]);

  const handleEdit = (index) => {
    const financialData = formattedData[index];
    setSelectedFinancial(financialData);
    setIsEditModalOpen(true);
  };

  const handleDelete = (index) => {
    const financialData = formattedData[index];
    setSelectedFinancial(financialData);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    // Need to implement delete for financial if needed
    setIsDeleteAlertOpen(false);
  };

  const handleUpdateSalary = (values) => {
    console.log("Update salary:", values);
  };

  const handleAddSalary = (values) => {
    console.log("Add salary:", values);
  };

  if (isLoading) return <div>{t("Loading...")}</div>;
  if (error) return <div className="text-red-500 p-4">{t("Error loading employees")}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        <Table
          title="Salary"
          headers={headers}
          rows={rows}
          isCheckInput={true}
          isTitle={true}
          classContainer="w-full"
          isActions={true}
          handelEdit={handleEdit}
          handelDelete={handleDelete}

          // Filters
          showDatePicker={true}
          selectedDate={selectedDate}
          onDateChange={(e) => setSelectedDate(e.target.value)}

          showStatusFilter={true}
          selectedStatus={selectedStatus}
          onStatusChange={(val) => setSelectedStatus(val)}

          showListOfDepartments={true}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={(val) => setSelectedDepartment(val)}

          headerActions={
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <GoPlus size={18} />
              {t("Add Salary")}
            </button>
          }
        />
      </div>

      <AddSalaryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSalary}
      />

      <EditSalaryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateSalary}
        data={selectedFinancial}
      />

      <Alert
        type="delete"
        title="Delete Salary Record?"
        message={(<div>Are you sure you want to delete this salary record?<span className="text-black font-bold">This action cannot be undone.</span></div>)}
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onSubmit={confirmDelete}
        titleCancelBtn="Cancel"
        titleSubmitBtn="Delete"
        isBtns={true}
      />

      <Alert
        type="success"
        title="Salary Record Deleted"
        message="The salary record has been successfully deleted."
        isOpen={isSuccessAlertOpen}
        onClose={() => setIsSuccessAlertOpen(false)}
        isBtns={false}
      />
    </div>
  );
}
