import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import Table from "../../../components/Tables/Table.jsx";
import { fetchEmployees } from "../../../redux/employees/employeeAPI";

// Function to determine background color
const getRequestBgColor = (request) => {
  if (request.startsWith("Money request")) return "#C2EFFF";
  if (request === "Leave") return "#FFDAC2";
  if (/^\+\d+$/.test(request)) return "#F6F8FA";
  return "#C2EFFF";
};

function FinancialsTab() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const financialData = employees.map((employee) => {
    const financial = employee.financial || {};
    const adjustments = (financial.bonuses || 0) - (financial.deductions || 0);

    const requests = [];
    financial.salaryAdvanceRequests?.forEach((request) => {
      requests.push(`Money request: $${request.requestAmount}`);
    });
    financial.leaveRequests?.forEach(() => {
      requests.push("Leave");
    });

    return {
      employee: {
        imageProfile:
          employee.profilePicture ||
          "https://ui-avatars.com/api/?name=John+Doe",
        name: employee.name,
        department: employee.department?.name || "N/A",
      },
      department: employee.department?.name || "N/A",
      workType: employee.workType || financial.workType || "N/A",
      salary: `$${(financial.salary || 0).toLocaleString()}`,
      adjustments: `$${adjustments.toLocaleString()}`,
      requests,
    };
  });

  const headers = [
    { label: t("Employee"), width: "200px" },
    { label: t("Department"), width: "140px" },
    { label: t("Work Type"), width: "120px" },
    { label: t("Salary"), width: "100px" },
    { label: t("Adjustments"), width: "120px" },
    { label: t("Requests"), width: "200px" },
    { label: "", width: "50px" },
  ];

  const RequestTag = ({ request }) => (
    <span
      className="inline-flex items-center rounded-full px-2 py-1 mr-2 mb-1 text-sm"
      style={{
        backgroundColor: getRequestBgColor(request),
        color:
          request === "Leave"
            ? "#6E330C"
            : request.startsWith("Money request")
            ? "#164564"
            : "#000",
        fontSize: "12px",
      }}
    >
      {t(request)}
    </span>
  );

  RequestTag.propTypes = {
    request: PropTypes.string,
  };

  const rows = financialData.map((record, index) => [
    <div key={`employee-${index}`} className="flex items-center gap-2">
      <img
        src={record.employee.imageProfile}
        alt={record.employee.name}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-sm text-sub-500 dark:text-sub-300">
          {record.employee.name}
        </span>
        <span className="text-gray-500 text-sm">
          {record.employee.department}
        </span>
      </div>
    </div>,
    <span key={`department-${index}`} className="text-sm dark:text-sub-300">
      {t(record.department)}
    </span>,
    <span key={`workType-${index}`} className="text-sm dark:text-sub-300">
      {t(record.workType)}
    </span>,
    <span key={`salary-${index}`} className="text-sm dark:text-sub-300">
      {record.salary}
    </span>,
    <span key={`adjustments-${index}`} className="text-sm dark:text-sub-300">
      {record.adjustments}
    </span>,
    <div key={`requests-${index}`} className="flex flex-wrap gap-1">
      {record.requests.map((request, i) => (
        <RequestTag key={`request-${i}`} request={request} />
      ))}
    </div>,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        <Table
          title={"Financials"}
          headers={headers}
          rows={rows}
          isCheckInput={true}
          isTitle={true}
          classContainer="w-full"
          isActions={true}
          showListOfDepartments={true}
        />
      </div>
    </div>
  );
}

export default FinancialsTab;
