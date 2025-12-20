"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Tables/Table";
import { fetchEmployees } from "@/redux/employees/employeeAPI";
import { deleteFinancialRecord } from "@/redux/financial/financialAPI";
import Alert from "@/components/Alerts/Alert";
import EditFinancialModal from "../_modals/EditFinancialModal";

const RequestTag = ({ request }) => (
  <span
    className="inline-flex items-center rounded-full px-2 py-1 mr-2 mb-1 text-sm"
    style={{
      backgroundColor: request.startsWith("Money") ? "#C2EFFF" : "#FFDAC2",
      color: request.startsWith("Money") ? "#164564" : "#6E330C",
    }}
  >
    {request}
  </span>
);

export default function FinancialsTab() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.employees);
  const [selectedFinancial, setSelectedFinancial] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const headers = [
    { label: t("Employee"), width: "200px" },
    { label: t("Department"), width: "140px" },
    { label: t("Work Type"), width: "120px" },
    { label: t("Salary"), width: "100px" },
    { label: t("Adjustments"), width: "120px" },
    { label: t("Requests"), width: "200px" },
    { label: "", width: "100px" },
  ];

  const formatFinancialData = () => {
    return employees.map((employee) => {
      const financial = employee.financial || {};
      const adjustments =
        (financial.bonuses || 0) - (financial.deductions || 0);
      const requests = [];

      financial.salaryAdvanceRequests?.forEach((req) => {
        if (req.status === "In Process") {
          requests.push(`Money: $${req.requestAmount}`);
        }
      });

      financial.leaveRequests?.forEach((req) => {
        if (req.status === "Pending") {
          requests.push("Leave");
        }
      });

      return {
        id: financial._id,
        employeeId: employee._id,
        employee: {
          imageProfile: employee.profilePicture || "",
          name: employee.name,
          department: employee.department?.name || "N/A",
        },
        department: employee.department?.name || "N/A",
        workType: financial.workType || "N/A",
        salary: financial.salary || 0,
        adjustments,
        requests,
      };
    });
  };

  const rows = formatFinancialData().map((row) => [
    <div key={`employee-${row.id}`} className="flex items-center gap-2">
      <img
        src={row.employee.imageProfile}
        alt={row.employee.name}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-sm">{row.employee.name}</span>
        <span className="text-gray-500 text-xs">{row.employee.department}</span>
      </div>
    </div>,
    <span key={`department-${row.id}`} className="text-sm">
      {row.department}
    </span>,
    <span key={`workType-${row.id}`} className="text-sm">
      {row.workType}
    </span>,
    <span key={`salary-${row.id}`} className="text-sm">
      ${row.salary.toLocaleString()}
    </span>,
    <span key={`adjustments-${row.id}`} className="text-sm">
      ${row.adjustments.toLocaleString()}
    </span>,
    <div key={`requests-${row.id}`} className="flex flex-wrap gap-1">
      {row.requests.map((request, i) => (
        <RequestTag key={`request-${i}`} request={request} />
      ))}
    </div>,
  ]);

  const handleEdit = (index) => {
    const financialData = formatFinancialData()[index];
    setSelectedFinancial(financialData);
    setIsEditModalOpen(true);
  };

  const handleDelete = (index) => {
    const financialData = formatFinancialData()[index];
    setSelectedFinancial(financialData);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteFinancialRecord(selectedFinancial.id)).then(() => {
      setIsDeleteAlertOpen(false);
      setIsSuccessAlertOpen(true);
      dispatch(fetchEmployees());
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        <Table
          title="Financial Records"
          headers={headers}
          rows={rows}
          isCheckInput={false}
          isTitle={true}
          classContainer="w-full"
          isActions={true}
          handelEdit={handleEdit}
          handelDelete={handleDelete}
        />
      </div>

      <EditFinancialModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        financialId={selectedFinancial?.id}
        employeeId={selectedFinancial?.employeeId}
      />

      <Alert
        type="warning"
        title="Delete Financial Record?"
        message="Are you sure you want to delete this financial record? This action cannot be undone."
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onSubmit={confirmDelete}
        titleCancelBtn="Cancel"
        titleSubmitBtn="Delete"
        isBtns={true}
      />

      <Alert
        type="success"
        title="Financial Record Deleted"
        message="The financial record has been successfully deleted."
        isOpen={isSuccessAlertOpen}
        onClose={() => setIsSuccessAlertOpen(false)}
        isBtns={false}
      />
    </div>
  );
}
