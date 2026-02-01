import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import {
  useGetSalaryTransactionsQuery,
  useCreateSalaryTransactionMutation,
  useDeleteSalaryTransactionMutation,
} from "@/redux/financial/salariesApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import AddSalaryModal from "../modals/AddSalaryModal";
import { GoPlus } from "react-icons/go";

export default function SalaryTab() {
  const { t } = useTranslation();
  const { data: transactions = [], isLoading: isTransactionsLoading, error } = useGetSalaryTransactionsQuery();

  const [createTransaction] = useCreateSalaryTransactionMutation();
  const [deleteTransaction] = useDeleteSalaryTransactionMutation();

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  // Filters state (Placeholder for now as per current implementation)
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const headers = [
    { label: t("Employees"), width: "250px" },
    { label: t("Salary Amount"), width: "120px" },
    { label: t("Bonus"), width: "100px" },
    { label: t("Deduction"), width: "100px" },
    { label: t("Comment"), width: "200px" },
    { label: "", width: "50px" }, // Actions column
  ];

  const formattedData = useMemo(() => {
    if (!transactions) return [];
    return transactions.map((transaction) => {
      const employeeData = transaction.employee || {};

      return {
        id: transaction._id,
        employee: {
          imageProfile: "https://ui-avatars.com/api/?name=" + (employeeData.name || "User"),
          name: employeeData.name || t("Unknown"),
          email: employeeData.email || "N/A",
        },
        salary: transaction.amount || 0,
        bonus: transaction.bonus || 0,
        deduction: transaction.discount || 0,
        comment: transaction.comment || t("N/A"),
      };
    });
  }, [transactions, t]);

  const rows = formattedData.map((row, index) => [
    <div key={`employee-${row.id || index}`} className="flex items-center gap-3">
      <img
        src={row.employee.imageProfile}
        alt={row.employee.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.employee.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{row.employee.email}</span>
      </div>
    </div>,
    <span key={`salary-${row.id || index}`} className="text-sm text-gray-700 dark:text-gray-300 font-bold">
      {row.salary?.toLocaleString()}$
    </span>,
    <span key={`bonus-${row.id || index}`} className="text-sm text-green-600 dark:text-green-400">
      +{row.bonus?.toLocaleString()}$
    </span>,
    <span key={`deduction-${row.id || index}`} className="text-sm text-red-600 dark:text-red-400">
      -{row.deduction?.toLocaleString()}$
    </span>,
    <span key={`comment-${row.id || index}`} className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]" title={row.comment}>
      {row.comment}
    </span>,
  ]);

  const handleDelete = (index) => {
    const transaction = formattedData[index];
    setSelectedTransaction(transaction);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTransaction) {
      try {
        await deleteTransaction(selectedTransaction.id).unwrap();
        setIsDeleteAlertOpen(false);
        setApiResponse({
          isOpen: true,
          status: "success",
          message: t("Salary transaction deleted successfully")
        });
      } catch (err) {
        console.error("Delete salary transaction failed:", err);
        setApiResponse({
          isOpen: true,
          status: "error",
          message: err?.data?.message || t("Failed to delete salary transaction")
        });
      }
    }
  };

  const handleAddSalary = async (values) => {
    try {
      await createTransaction(values).unwrap();
      setIsAddModalOpen(false);
      setApiResponse({
        isOpen: true,
        status: "success",
        message: t("Salary transaction added successfully")
      });
    } catch (err) {
      console.error("Create salary transaction failed:", err);
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || t("Failed to add salary transaction")
      });
      throw err; // Re-throw to be caught by Formik in AddSalaryModal
    }
  };

  if (isTransactionsLoading) return <div className="p-4">{t("Loading...")}</div>;
  if (error) return <div className="text-red-500 p-4">{t("Error loading salary transactions")}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        <Table
          title={t("Salary Transactions")}
          headers={headers}
          rows={rows}
          isCheckInput={true}
          isTitle={true}
          classContainer="w-full"
          isActions={true}
          handelDelete={handleDelete}
          isEdit={false} // Disable edit as it's not requested for transactions

          // Filters
          showDatePicker={true}
          selectedDate={selectedDate}
          onDateChange={(e) => setSelectedDate(e.target.value)}

          showStatusFilter={false} // Transactions might not have 'status' filter like employees

          showListOfDepartments={true}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={(val) => setSelectedDepartment(val)}

          headerActions={
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              onClick={() => setIsAddModalOpen(true)}
            >
              <GoPlus size={18} />
              {t("Add Transaction")}
            </button>
          }
        />
      </div>

      <AddSalaryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSalary}
      />

      <ApprovalAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={confirmDelete}
        title={t("Delete Salary Transaction?")}
        message={t("Are you sure you want to delete this salary transaction? This action cannot be undone.")}
      />

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
