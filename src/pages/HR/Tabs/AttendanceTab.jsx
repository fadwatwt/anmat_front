import { useTranslation } from "react-i18next";
import Table from "../../../components/Tables/Table.jsx";
import { employees } from "../../../functions/FactoryData.jsx";
import { BsCheckCircleFill, BsClockFill, BsSlashCircleFill } from "react-icons/bs";
import { GoCheckCircleFill, GoClockFill } from "react-icons/go";

// Mock attendance data
const attendanceData = [
  {
    employee: employees[0],
    date: "2024-03-01",
    workingHours: "9:00 AM - 5:00 PM",
    checkIn: "8:55 AM",
    checkOut: "5:05 PM",
    status: "On Time"
  },
  {
    employee: employees[1],
    date: "2024-03-01",
    workingHours: "9:00 AM - 5:00 PM",
    checkIn: "9:15 AM",
    checkOut: "5:00 PM",
    status: "Late"
  },
  {
    employee: employees[2],
    date: "2024-03-01",
    workingHours: "9:00 AM - 5:00 PM",
    checkIn: null,
    checkOut: null,
    status: "Absent"
  },
  // Add more mock data as needed
];

function AttendanceTab() {
  const { t } = useTranslation();

  const headers = [
    { label: "Employee", width: "200px" },
    { label: "Date", width: "120px" },
    { label: "Official Working Hours", width: "180px" },
    { label: "Check In", width: "120px" },
    { label: "Check Out", width: "120px" },
    { label: "Late Status", width: "140px" },
  ];

  
  const StatusBadge = ({ status }) => {
    let borderColor, Icon;
  
    switch (status) {
      case "On Time":
        
        Icon = <GoCheckCircleFill className="text-green-600 dark:text-green-300" />;
        break;
      case "Late":
        Icon = <BsClockFill className="text-[#C2540A] dark:text-yellow-300" />;
        break;
      case "Absent":
        Icon = <BsSlashCircleFill className="text-[#757C8A] dark:text-red-300" />;
        break;
    
    }
  
    return (
        <div className="flex items-center gap-2 border rounded-md px-2 py-1 w-fit">
        {Icon}
        <span className="text-sm">{status}</span>
      </div>
    );
  };
  

  const rows = attendanceData.map((record, index) => [
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
        <span className="text-gray-500 text-sm">{record.employee.department}</span>
      </div>
    </div>,
 <span className="text-sm dark:text-sub-300">
 {new Date(record.date).toLocaleDateString("en-GB", {
   day: "2-digit",
   month: "short",
   year: "numeric",
 })}
</span>,

    <span className="text-sm dark:text-sub-300">{record.workingHours}</span>,
    <span className="text-sm dark:text-sub-300">{record.checkIn || '-'}</span>,
    <span className="text-sm dark:text-sub-300">{record.checkOut || '-'}</span>,
    <StatusBadge status={record.status} />
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        <Table
        title={"Attendance"}
          headers={headers}
          rows={rows}
          isCheckInput={true}
          isActions={false}
          isTitle={true}
          classContainer="w-full"
          showListOfDepartments={true}
          showStatusFilter={true}
          showDatePicker={true}

           // New props for control bar
         
        />
      </div>
    </div>
  );
}

export default AttendanceTab;