"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {  parseISO } from "date-fns";
import Table from "@/components/Tables/Table";
import {
  fetchAllAttendance,
  deleteAttendance,
} from "@/redux/attendance/attendanceAPI";
import { BsClockFill, BsSlashCircleFill } from "react-icons/bs";
import { GoCheckCircleFill } from "react-icons/go";

import Alert from "@/components/Alerts/Alert.jsx";
import EditAttendanceModal from "@/app/(dashboard)/hr/employees/modals/EditAttendanceModal";
import PropTypes from "prop-types";

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

function AttendanceTable() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { attendance, loading, error } = useSelector(
    (state) => state.attendance
  );

  // State for modals and alerts
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

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
    if (!checkIn || !officialStartTime) return "-";
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
    if (!record?.chekinTime) return "Absent";
    try {
      const checkInTime = parseISO(record.chekinTime);
      const officialStartTime = parseISO(record.officialStartTime);
      return checkInTime > officialStartTime ? "Late" : "On Time";
    } catch (error) {
      console.error("Error determining status:", error);
      return "Pending";
    }
  };

  const dataRecords = [
    {
      _id: "emId_1",
      name: "Employee 1",
      image: "/images/users/user1.png",
      date: "16 Jan, 2025",
      officialStartTime: "10:00 AM",
      officialEndTime: "6:00 PM",
      chekinTime: "10:00 AM",
      chekoutTime: "06:00 PM",
      lateTime: "30 Min",
      status: "On-time",
      department: "Digital Publishing Division Dep Dep"
    }
  ]

  const rows = dataRecords?.map((record) => [
    <div key={record._id} className="flex items-center gap-2">
      <img
        src={
          record.image ||
          "https://ui-avatars.com/api/?name=John+Doe"
        }
        alt={record.name}
        className="w-12 h-12 rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-sm text-sub-500 dark:text-sub-300">
          {record.name || "N/A"}
        </span>
        <span className="text-gray-500 text-sm">
          {record.department || "N/A"}
        </span>
      </div>
    </div>,
    <span key={`date-${record._id}`} className="text-sm dark:text-sub-300">
      {record.date ? record.date : "N/A"}
    </span>,
    <span key={`hours-${record._id}`} className="text-sm dark:text-sub-300">
      {record.officialStartTime && record.officialEndTime
        ? `${record.officialStartTime} - ${record.officialEndTime}`
        : "N/A"}
    </span>,
    <span key={`checkin-${record._id}`} className="text-sm dark:text-sub-300">
      {record.chekinTime ? record.chekinTime : "-"}
    </span>,
    <span key={`checkout-${record._id}`} className="text-sm dark:text-sub-300">
      {record.chekoutTime ? record.chekoutTime : "-"}
    </span>,
    <span key={`late-${record._id}`} className="text-sm dark:text-sub-300">
      {calculateLateTime(record.checkin, record.officialStartTime)}
    </span>,
    <StatusBadge key={`status-${record._id}`} status={getStatus(record)} />,
  ]);

  const handleEdit = (index) => {
    setSelectedAttendance(attendance[index]);
    setIsEditModalOpen(true);
  };

  const handleDelete = (index) => {
    setSelectedAttendance(attendance[index]);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteAttendance(selectedAttendance._id)).then(() => {
      setIsDeleteAlertOpen(false);
      setIsSuccessAlertOpen(true);
      dispatch(fetchAllAttendance());
    });
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

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
          handelEdit={handleEdit}
          handelDelete={handleDelete}
        />
      </div>

      {/* Edit Modal */}
      <EditAttendanceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        attendance={selectedAttendance}
      />

      {/* Delete Confirmation Alert */}
      <Alert
        type="warning"
        title="Delete Attendance Record?"
        message="Are you sure you want to delete this attendance record? This action cannot be undone."
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onSubmit={confirmDelete}
        titleCancelBtn="Cancel"
        titleSubmitBtn="Delete"
        isBtns={true}
      />

      {/* Success Alert */}
      <Alert
        type="success"
        title="Attendance Record Deleted"
        message="The attendance record has been successfully deleted."
        isOpen={isSuccessAlertOpen}
        onClose={() => setIsSuccessAlertOpen(false)}
        isBtns={false}
      />
    </div>
  );
}
StatusBadge.prototype = {
  status: PropTypes.string.isRequired,
};

export default AttendanceTable;
