import { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "../../../components/Tables/Table.jsx";
import { employees } from "../../../functions/FactoryData.jsx";

function RotationTap() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("week");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentDate] = useState(new Date());
  const viewModalList = [
      {id:"week",title:"Week"},
      {id:"month",title:"Month"},
  ]

  // Generate day headers
  const daysOfWeek = [
    { day: t("Sunday"), number: 1 },
    { day: t("Monday"), number: 2 },
    { day: t("Tuesday"), number: 3 },
    { day: t("Wednesday"), number: 4 },
    { day: t("Thursday"), number: 5 },
    { day: t("Friday"), number: 6 },
    { day: t("Saturday"), number: 7 },
  ];

  const headers = [
    { label: t("Employee"), width: "200px" },
    ...daysOfWeek.map(({ day, number }) => ({
      label: (
        <div className="flex flex-col items-center">
          <span className="dark:text-gray-400">{day}</span>
          <span className="text-start text-sm dark:bg-gray-900 text-gray-400">
            {number}
          </span>
        </div>
      ),
      width: "150px",
    })),
  ];

  const OffBadge = () => (
    <div className="w-full flex justify-center">
      <div className="flex items-center justify-center gap-1 w-14 h-6 px-1 py-1 bg-weak-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 text-xs">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        <span>OFF</span>
      </div>
    </div>
  );
  // Mock shift data generator
  const generateShifts = () => {
    return daysOfWeek.map(() => {
      const random = Math.random();
      return random > 0.3 ? (
        <div className="flex flex-col text-sm dark:text-sub-300 text-center">
          <span>10:00 AM to</span>
          <span>6:00 PM</span>
        </div>
      ) : (
        <OffBadge />
      );
    });
  };

  const filteredEmployees = employees.filter((employee) =>
    selectedDepartment === "all"
      ? true
      : employee.department === selectedDepartment
  );
  const rows = filteredEmployees.map((employee) => [
    <div key={employee.id} className={`flex items-center gap-2`}>
      <img
        src={employee.imageProfile}
        alt={employee.name}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-sm text-sub-500 dark:text-sub-300">
          {employee.name}
        </span>
        <span className="text-gray-500 text-sm">{employee.role}</span>
      </div>
    </div>,
    ...generateShifts().map((shift, index) => (
      <div key={index} className="text-sm dark:text-sub-300 ">
        {shift}
      </div>
    )),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        <Table
          headers={headers}
          rows={rows}
          isCheckInput={false}
          isActions={false}
          isTitle={true}
          classContainer="w-full"
          viewModalList={viewModalList}
          // New props for control bar
          showControlBar={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={(e) => setSelectedDepartment(e.target.value)}
          currentDate={currentDate}
          showListOfDepartments={true}
        />
      </div>
    </div>
  );
}

export default RotationTap;
