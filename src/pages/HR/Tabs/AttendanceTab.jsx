import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import Table from "../../../components/Tables/Table.jsx";
import { fetchAllAttendance } from "../../../redux/attendance/attendanceAPI";
import { BsClockFill, BsSlashCircleFill } from "react-icons/bs";
import { GoCheckCircleFill } from "react-icons/go";
export const StatusBadge = ({ status }) => {
  let Icon;

  switch (status) {
    case "On Time":
      Icon = (
        <GoCheckCircleFill className="text-green-600 dark:text-green-300" />
      );
      break;
    case "Late":
      Icon = <BsClockFill className="text-[#C2540A] dark:text-yellow-300" />;
      break;
    case "Absent":
      Icon = <BsSlashCircleFill className="text-[#757C8A] dark:text-red-300" />;
      break;
    case "Pending":
      Icon = <BsClockFill className="text-[#C2540A] dark:text-yellow-300" />;
      break;
  }

  return (
    <div className="flex items-center gap-2 border dark:border-gray-700 rounded-md px-2 py-1 w-fit">
      {Icon}
      <span className="text-xs dark:text-gray-200">{status}</span>
    </div>
  );
};
function AttendanceTab() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { attendance, loading, error } = useSelector(
    (state) => state.attendance
  );

  useEffect(() => {
    dispatch(fetchAllAttendance());
  }, [dispatch]);

  const headers = [
    { label: t("Employee"), width: "200px" },
    { label: t("Date"), width: "120px" },
    { label: t("Official Working Hours"), width: "180px" },
    { label: t("Check In"), width: "120px" },
    { label: t("Check Out"), width: "120px" },
    { label: t("Late"), width: "140px" },
    { label: t("Status"), width: "140px" },
    { label: "", width: "50px" },
  ];

  const calculateLateTime = (checkIn, officialStartTime) => {
    if (!checkIn || !officialStartTime) return "-"; // Add checks for undefined/null
    try {
      const checkInDate = parseISO(checkIn);
      const officialStartDate = parseISO(officialStartTime);
      const diffInMinutes = Math.round(
        (checkInDate - officialStartDate) / (1000 * 60)
      );
      return diffInMinutes > 0 ? `${diffInMinutes} min` : "-";
    } catch (error) {
      console.error("Error calculating late time:", error);
      return "-";
    }
  };
  const getStatus = (record) => {
    if (!record?.checkin || !record?.officialStartTime) return "Absent"; // Add checks for undefined/null
    try {
      const checkInTime = parseISO(record.checkin);
      const officialStartTime = parseISO(record.officialStartTime);
      return checkInTime > officialStartTime ? "Late" : "On Time";
    } catch (error) {
      console.error("Error determining status:", error);
      return "Pending";
    }
  };
  const rows = attendance?.map((record) => [
    <div key={record._id} className="flex items-center gap-2">
      <img
        src={
          record.employee?.profilePicture ||
          "https://ui-avatars.com/api/?name=John+Doe"
        }
        alt={record.employee?.name}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-sm text-sub-500 dark:text-sub-300">
          {record.employee?.name || "N/A"}
        </span>
        <span className="text-gray-500 text-sm">
          {record.employee?.department?.name || "N/A"}
        </span>
      </div>
    </div>,
    <span key={`date-${record._id}`} className="text-sm dark:text-sub-300">
      {record.date ? format(parseISO(record.date), "dd MMM yyyy") : "N/A"}
    </span>,
    <span key={`hours-${record._id}`} className="text-sm dark:text-sub-300">
      {record.officialStartTime && record.officialEndTime
        ? `${format(parseISO(record.officialStartTime), "h:mm a")} - ${format(
            parseISO(record.officialEndTime),
            "h:mm a"
          )}`
        : "N/A"}
    </span>,
    <span key={`checkin-${record._id}`} className="text-sm dark:text-sub-300">
      {record.checkin ? format(parseISO(record.checkin), "h:mm a") : "-"}
    </span>,
    <span key={`checkout-${record._id}`} className="text-sm dark:text-sub-300">
      {record.checkout ? format(parseISO(record.checkout), "h:mm a") : "-"}
    </span>,
    <span key={`late-${record._id}`} className="text-sm dark:text-sub-300">
      {calculateLateTime(record.checkin, record.officialStartTime)}
    </span>,
    <StatusBadge key={`status-${record._id}`} status={getStatus(record)} />,
  ]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        <Table
          title={"Attendance"}
          headers={headers}
          rows={rows}
          isCheckInput={true}
          isTitle={true}
          classContainer="w-full"
          showListOfDepartments={true}
          showStatusFilter={true}
          showDatePicker={true}
          isActions={true}
        />
      </div>
    </div>
  );
}

export default AttendanceTab;
