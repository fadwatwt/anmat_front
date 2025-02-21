import { useTranslation } from "react-i18next";
import Table from "../../../components/Tables/Table.jsx";
import { employees } from "../../../functions/FactoryData.jsx";
import PropTypes from "prop-types";

// Mock financial data
const financialData = [
  {
    employee: employees[0],
    department: "Publishing",
    workType: "Full-time",
    salary: "1500$",
    adjustments: "1500$",
    requests: ["Money request: 200$", "Leave", "+2"]
  },
  {
    employee: employees[1],
    department: "Design",
    workType: "Part-time",
    salary: "1200$",
    adjustments: "1200$",
    requests: ["Bonus: 500$", "Overtime"]
  },
  {
    employee: employees[2],
    department: "Marketing",
    workType: "Contract",
    salary: "1800$",
    adjustments: "1800$",
    requests: ["Advance: 300$", "Leave"]
  },
];

// Function to determine background color
const getRequestBgColor = (request) => {
  if (request.startsWith("Money request")) return "#C2EFFF";
  if (request === "Leave") return "#FFDAC2";
  if (/^\+\d+$/.test(request)) return "#F6F8FA"; // Matches "+2", "+5", etc.
  return "#C2EFFF"; // Default color
};

function FinancialsTab() {
  const { t } = useTranslation();

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
      className="inline-flex items-center  rounded-full px-2 py-1 mr-2 mb-1 text-sm"
      style={{
        backgroundColor: getRequestBgColor(request),
        color: request === "Leave" ? "#6E330C" : request .startsWith("Money request") ? "#164564" : "#000",
        fontSize: "12px"
    }}
    >
      {t(request)}
    </span>
  );

  RequestTag.propTypes = {
    request: PropTypes.string,
  };

  const rows = financialData.map((record, index) => [
    <div key={index} className="flex items-center gap-2">
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
    <span key={index} className="text-sm dark:text-sub-300">{t(record.department)}</span>,
    <span key={index} className="text-sm dark:text-sub-300">{t(record.workType)}</span>,
    <span key={index} className="text-sm dark:text-sub-300">{record.salary}</span>,
    <span key={index} className="text-sm dark:text-sub-300">{record.adjustments}</span>,
    <div key={index} className="flex flex-wrap gap-1">
      {record.requests.map((request, i) => (
        <RequestTag key={i} request={request} />
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