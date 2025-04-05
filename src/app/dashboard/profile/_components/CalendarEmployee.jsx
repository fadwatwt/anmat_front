"use client";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllAttendance } from "@/redux/attendance/attendanceAPI";
import { fetchAllRotations } from "@/redux/rotation/rotationAPI";
import Table from "@/components/Tables/Table.jsx";
import { RiCalendarLine } from "@remixicon/react";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { BsClockFill, BsSlashCircleFill } from "react-icons/bs";
import { GoCheckCircleFill } from "react-icons/go";

// StatusBadge component for displaying attendance status
const StatusBadge = ({ status }) => {
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
    default:
      Icon = null;
  }

  return status ? (
    <div className="flex items-center gap-2 border dark:border-gray-700 rounded-md px-2 py-1 w-fit">
      {Icon}
      <span className="text-xs dark:text-gray-200">{status}</span>
    </div>
  ) : null;
};

// OffBadge component for displaying off days
const OffBadge = () => (
  <div className="w-full flex justify-start">
    <div className="flex items-center justify-center gap-1 w-14 h-6 px-1 py-1 bg-weak-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 text-xs">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
      <span>OFF</span>
    </div>
  </div>
);

function CalendarEmployee() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("rotation");
  const [currentDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const dispatch = useDispatch();
  const { attendance } = useSelector((state) => state.attendance);
  const { rotations } = useSelector((state) => state.rotation);
  const { employees } = useSelector((state) => state.employees);
  const params = useParams();

  // Extract employee ID from URL params
  const employeeId = params ? params.employeeId.split("-")[0] : "";

  // Find the current employee from the employees array
  const employee = employees.find((emp) => emp._id === employeeId);

  const viewModalList = [
    { id: "rotation", title: t("Rotation") },
    { id: "attendance", title: t("Attendance") },
  ];

  // Get the start of the current week (Sunday)
  useEffect(() => {
    const today = new Date(currentDate);
    const day = today.getDay(); // 0 is Sunday
    const diff = today.getDate() - day;
    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    setWeekStartDate(startOfWeek);
  }, [currentDate]);

  // Fetch data when component mounts or when week changes or viewMode changes
  useEffect(() => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 6);

    const startDateFormatted = weekStartDate.toISOString().split("T")[0];
    const endDateFormatted = endDate.toISOString().split("T")[0];

    // Fetch data based on the current view mode
    if (viewMode === "rotation") {
      dispatch(
        fetchAllRotations({
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        })
      );
    } else if (viewMode === "attendance") {
      dispatch(
        fetchAllAttendance({
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        })
      );
    }
  }, [dispatch, weekStartDate, viewMode]);

  // Generate day headers in the style from "Correct UI"
  const daysOfWeek = [
    { day: t("Sunday") },
    { day: t("Monday") },
    { day: t("Tuesday") },
    { day: t("Wednesday") },
    { day: t("Thursday") },
    { day: t("Friday") },
    { day: t("Saturday") },
  ];

  const generateHeaders = () => {
    const headers = [
      {
        label: t("Employee"),
        width: "200px",
      },
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(date.getDate() + i);

      headers.push({
        label: (
          <div className="flex flex-col items-center">
            <span className="dark:text-gray-400">{daysOfWeek[i].day}</span>
            <span className="text-start text-sm dark:bg-gray-900 text-gray-400">
              {new Intl.DateTimeFormat(undefined, {
                day: "2-digit",
                month: "short",
              }).format(date)}
            </span>
          </div>
        ),
        width: "150px",
      });
    }
    return headers;
  };

  // Parse rotation data structure to match the calendar format
  const parseRotationData = () => {
    let parsedRotations = [];

    rotations.forEach((rotation) => {
      if (rotation.employee && rotation.employee._id === employeeId) {
        // Process schedule array and convert each item to a format compatible with the calendar
        rotation.schedule.forEach((scheduleItem) => {
          parsedRotations.push({
            employeeId: rotation.employee._id,
            employeeName: rotation.employee.name,
            employeeDepartment: rotation.employee.department?.name || "N/A",
            employeeProfilePicture: rotation.employee.profilePicture || "",
            date: scheduleItem.date,
            startTime: scheduleItem.startTime,
            endTime: scheduleItem.endTime,
            status: scheduleItem.status,
            shiftType: scheduleItem.status === "WORKING" ? "Regular" : "",
          });
        });
      }
    });

    return parsedRotations;
  };

  // Determine attendance status
  const getAttendanceStatus = (record) => {
    console.log({ record });

    if (!record?.checkin) return "Absent";

    // Compare check-in time with official start time
    try {
      const checkInTime = new Date(record.checkin);
      const officialStartTime = new Date(
        record.officialStartTime || record.scheduledStartTime
      );
      return checkInTime > officialStartTime ? "Late" : "On Time";
    } catch (error) {
      console.error("Error determining status:", error);
      return "Pending";
    }
  };

  // Filter data for the current employee only
  // Update the attendance data mapping in filterDataForEmployee
  const filterDataForEmployee = () => {
    if (viewMode === "rotation") {
      return parseRotationData();
    } else {
      return attendance
        .filter(
          (record) =>
            record.employee?._id === employeeId ||
            (typeof record.employee === "string" &&
              record.employee === employeeId)
        )
        .map((record) => ({
          ...record,
          employeeName: record.employee?.name || "N/A",
          employeeDepartment: record.employee?.department?.name || "N/A",
          employeeProfilePicture: record.employee?.profilePicture || "",
          date: record.date,
          checkInTime: record.checkin,
          checkOutTime: record.checkout,
          status: getAttendanceStatus(record),
        }));
    }
  };

  // Generate rows for the table based on filtered data
  const generateRows = () => {
    const filteredData = filterDataForEmployee();
    const employeeData = employees.find((emp) => emp._id === employeeId) || {};

    // Group data by week
    const weeks = [];
    const currentWeekData = [];

    // If we have data, create weekly data structures
    if (filteredData.length > 0) {
      // Create the employee cell only once
      const employeeCell = (
        <div key={employeeId} className="flex items-center gap-2">
          <img
            src={
              employeeData.profilePicture ||
              `https://ui-avatars.com/api/?name=${
                employeeData.name || "Unknown"
              }`
            }
            alt={employeeData.name || "Employee"}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm text-sub-500 dark:text-sub-300">
              {employeeData.name || "Unknown Employee"}
            </span>
            <span className="text-gray-500 text-sm">
              {employeeData.department?.name || "N/A"}
            </span>
          </div>
        </div>
      );

      // Create cells for each day of the week
      const weekCells = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStartDate);
        date.setDate(date.getDate() + i);
        const formattedDate = date.toISOString().split("T")[0];

        let cellContent;

        if (viewMode === "rotation") {
          // Find rotation for this day
          const dayRotation = filteredData.find((r) => {
            const rotationDate = new Date(r.date).toISOString().split("T")[0];
            return rotationDate === formattedDate;
          });

          if (dayRotation && dayRotation.status === "WORKING") {
            cellContent = (
              <div className="flex flex-col text-sm dark:text-sub-300 text-start">
                <span>{dayRotation.startTime || "10:00 AM"} to</span>
                <span>{dayRotation.endTime || "6:00 PM"}</span>
                {dayRotation.shiftType && (
                  <span className="mt-1 text-xs p-1 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 text-blue-800 rounded">
                    {dayRotation.shiftType}
                  </span>
                )}
              </div>
            );
          } else if (dayRotation && dayRotation.status === "OFF") {
            cellContent = <OffBadge />;
          } else {
            cellContent = <OffBadge />;
          }
        } else {
          // Find attendance for this day
          const dayAttendance = filteredData.find((a) => {
            const attendanceDate = new Date(a.date || a.attendanceDate)
              .toISOString()
              .split("T")[0];
            return attendanceDate === formattedDate;
          });

          if (dayAttendance) {
            const checkInTime = dayAttendance.checkInTime
              ? new Date(dayAttendance.checkInTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-";

            const checkOutTime = dayAttendance.checkOutTime
              ? new Date(dayAttendance.checkOutTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-";

            // Determine status (Late, On Time, Absent)
            const status = getAttendanceStatus(dayAttendance);

            cellContent = (
              <div className="flex flex-col text-sm dark:text-sub-300 text-start">
                <span>{checkInTime} to</span>
                <span>{checkOutTime}</span>
                <div className="mt-1">
                  <StatusBadge status={status} />
                </div>
              </div>
            );
          } else {
            cellContent = (
              <div className="flex flex-col text-sm dark:text-sub-300 text-start">
                <StatusBadge status="Absent" />
              </div>
            );
          }
        }

        weekCells.push(
          <div key={i} className="relative h-full">
            <div className="text-sm dark:text-sub-300 px-2 py-6">
              {cellContent}
            </div>
            <span className="absolute top-0 right-1 dark:text-gray-200">
              {date.getDate()}
            </span>
          </div>
        );
      }

      // Add the current week row
      currentWeekData.push([employeeCell, ...weekCells]);
      weeks.push(...currentWeekData);
    }

    return weeks;
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStartDate(newDate);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStartDate(newDate);
  };

  // Format date range for display
  const formatDateRange = () => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 6);

    const startFormatted = new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
    }).format(weekStartDate);

    const endFormatted = new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(endDate);

    return `${startFormatted} - ${endFormatted}`;
  };

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Table rows for the current page
  const rows = generateRows();
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const currentRows = rows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <RiCalendarLine size={20} className="mr-2 dark:text-gray-300" />
            <h2 className="text-lg font-medium dark:text-gray-200">
              {t("Calendar")}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex border rounded-md overflow-hidden dark:border-gray-700">
              <button
                onClick={goToPreviousWeek}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-300"
              >
                &lt;
              </button>
              <div className="px-3 py-1 bg-white dark:bg-gray-800 dark:text-gray-300">
                {formatDateRange()}
              </div>
              <button
                onClick={goToNextWeek}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-300"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex mb-4 border-b dark:border-gray-700">
          {viewModalList.map((item) => (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === item.id
                  ? "border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <Table
          headers={generateHeaders()}
          rows={currentRows}
          isCheckInput={false}
          isActions={false}
          isTitle={false}
          classContainer="w-full"
          classNameCell="border h-10 dark:border-gray-700"
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
          }}
        />
      </div>
    </div>
  );
}

export default CalendarEmployee;
