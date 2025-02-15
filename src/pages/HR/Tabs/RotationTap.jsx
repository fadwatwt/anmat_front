import { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "../../../components/Tables/Table.jsx";
import AccountDetails from "../../Projects/Components/TableInfo/AccountDetails.jsx";
import { employees } from "../../../functions/FactoryData.jsx";

function RotationTap() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("week");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentDate] = useState(new Date());
  const [options, setOptions] = useState([
    { value: "all", name: "All Departments" },
    { value: "Development", name: "Development" },
    { value: "Design", name: "Design" },
    { value: "Publishing", name: "Publishing" },
  ]);
  // Generate day headers
  const daysOfWeek = [
    "Sunday 1 ",
    "Monday 2 ",
    "Tuesday 3",
    "Wednesday 4 ",
    "Thursday 5 ",
    "Friday 6 ",
    "Saturday 7 ",
  ];

  const headers = [
    { label: "Employee", width: "200px" },
    ...daysOfWeek.map((day) => ({ label: t(day), width: "150px" })),
  ];

  const OffBadge = () => (
    <div className="flex items-center gap-1 w-14 h-6 px-1 py-1 bg-weak-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 text-xs">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
      <span>OFF</span>
    </div>
  );
  // Mock shift data generator
  const generateShifts = () => {
    return daysOfWeek.map((day) => {
      const random = Math.random();
      return random > 0.3 ? "10:00 AM - 6:00 PM" : <OffBadge />;
    });
  };

  const filteredEmployees = employees.filter((employee) =>
    selectedDepartment === "all"
      ? true
      : employee.department === selectedDepartment
  );

  const rows = filteredEmployees.map((employee) => [
    <AccountDetails
      key={employee.id}
      account={{
        name: employee.name,
        rule: employee.role,
        imageProfile: employee.imageProfile,
      }}
    />,
    ...generateShifts().map((shift, index) => (
      <p key={index} className="text-sm dark:text-sub-300">
        {shift}
      </p>
    )),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        <Table
          title="Rotation Schedule"
          headers={headers}
          rows={rows}
          isCheckInput={false}
          isActions={false}
          isTitle={true}
          classContainer="w-full"
          // New props for control bar
          showControlBar={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={(e) => setSelectedDepartment(e.target.value)}
          currentDate={currentDate}
          neededOptions={options}
        />
      </div>
    </div>
  );
}

export default RotationTap;
