"use client";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import Table from "@/components/Tables/Table";
import {
  fetchAllAttendance,
  deleteAttendance,
} from "@/redux/attendance/attendanceAPI";
import { BsClockFill, BsSlashCircleFill } from "react-icons/bs";
import { GoCheckCircleFill, GoPlus } from "react-icons/go";

import Alert from "@/components/Alerts/Alert.jsx";
import EditAttendanceModal from "@/app/(dashboard)/hr/employees/modals/EditAttendanceModal";
import PropTypes from "prop-types";
import AddAttendanceModal from "../modals/AddAttendanceModal";

// Updated StatusBadge to match the premium design
export const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  let Icon;
  let colors = "";

  switch (status) {
    case "On Time":
      Icon = <GoCheckCircleFill size={14} className="text-green-600" />;
      colors = "bg-green-50 text-green-700 border-green-200";
      break;
    case "Late":
      Icon = <BsClockFill size={14} className="text-[#C2540A]" />;
      colors = "bg-[#FFF9F5] text-[#C2540A] border-[#FFD9C2]";
      break;
    case "Absent":
      Icon = <BsSlashCircleFill size={14} className="text-[#757C8A]" />;
      colors = "bg-gray-50 text-gray-700 border-gray-200";
      break;
    default:
      Icon = <BsClockFill size={14} className="text-[#C2540A]" />;
      colors = "bg-gray-50 text-gray-700 border-gray-200";
  }

  return (
    <div className={`flex items-center gap-1.5 border rounded-full px-2.5 py-1 w-fit ${colors}`}>
      {Icon}
      <span className="text-[11px] font-medium">{t(status)}</span>
    </div>
  );
};

function AttendanceTab() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { attendance: apiAttendance, loading, error } = useSelector(
    (state) => state.attendance
  );

  // Mock data for initial design preview matching the image
  const mockAttendance = [
    {
      _id: "1",
      employee: { name: "Fatma Ahmed Mohamed", department: { name: "Digital Publishing Division Dep Dep" }, profilePicture: "https://i.pravatar.cc/150?u=1" },
      date: "2025-01-16T10:00:00Z",
      officialStartTime: "2025-01-16T10:00:00Z",
      officialEndTime: "2025-01-16T18:00:00Z",
      checkin: "2025-01-16T10:00:00Z",
      checkout: "2025-01-16T23:00:00Z",
      lateMinutes: 0,
      status: "Late"
    },
    {
      _id: "2",
      employee: { name: "Sophia Williams", department: { name: "Publishing Dep" }, profilePicture: "https://i.pravatar.cc/150?u=2" },
      date: "2025-01-16T10:00:00Z",
      officialStartTime: "2025-01-16T10:00:00Z",
      officialEndTime: "2025-01-16T18:00:00Z",
      checkin: "2025-01-16T10:30:00Z",
      checkout: "2025-01-16T23:30:00Z",
      lateMinutes: 30,
      status: "Late"
    },
    {
      _id: "3",
      employee: { name: "Fatma Ahmed Mohamed", department: { name: "Content Management Dep" }, profilePicture: "https://i.pravatar.cc/150?u=3" },
      date: "2025-01-16T10:00:00Z",
      officialStartTime: "2025-01-16T10:00:00Z",
      officialEndTime: "2025-01-16T18:00:00Z",
      checkin: null,
      checkout: null,
      lateMinutes: 30,
      status: "Absent"
    },
    {
      _id: "4",
      employee: { name: "Fatma Ahmed Mohamed", department: { name: "Content Management Dep" }, profilePicture: "https://i.pravatar.cc/150?u=4" },
      date: "2025-01-16T10:00:00Z",
      officialStartTime: "2025-01-16T10:00:00Z",
      officialEndTime: "2025-01-16T18:00:00Z",
      checkin: null,
      checkout: null,
      lateMinutes: 30,
      status: "Absent"
    },
    {
      _id: "5",
      employee: { name: "James Brown", department: { name: "Editorial Software Dep" }, profilePicture: "https://i.pravatar.cc/150?u=5" },
      date: "2025-01-16T10:00:00Z",
      officialStartTime: "2025-01-16T10:00:00Z",
      officialEndTime: "2025-01-16T18:00:00Z",
      checkin: null,
      checkout: null,
      lateMinutes: 0,
      status: "Absent"
    }
  ];

  const attendance = apiAttendance.length > 0 ? apiAttendance : mockAttendance;

  // State for modals and alerts
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllAttendance());
  }, [dispatch]);

  const headers = [
    { label: t("Employees"), width: "250px" },
    { label: t("Date"), width: "120px" },
    { label: t("Official Working Hours"), width: "180px" },
    { label: t("Check In"), width: "180px" },
    { label: t("Late Minutes"), width: "120px" },
    { label: t("Status"), width: "120px" },
    { label: "", width: "50px" },
  ];
  const handleAddAttendance  = () => {
    setIsAddModalOpen(!isAddModalOpen)
  }

  const rows = attendance?.map((record) => [
    <div key={`emp-${record._id}`} className="flex items-center gap-3 py-1">
      <img
        src={record.employee?.profilePicture || "https://i.pravatar.cc/150"}
        alt={record.employee?.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-normal leading-tight">
          {record.employee?.name || "N/A"}
        </span>
        <span className="text-gray-500 text-[11px] whitespace-normal leading-tight mt-0.5">
          {record.employee?.department?.name || "N/A"}
        </span>
      </div>
    </div>,
    <span key={`date-${record._id}`} className="text-sm text-gray-700 dark:text-sub-300">
      {record.date ? format(parseISO(record.date), "dd MMM, yyyy") : "N/A"}
    </span>,
    <span key={`hours-${record._id}`} className="text-sm text-gray-700 dark:text-sub-300">
      {record.officialStartTime && record.officialEndTime
        ? `${format(parseISO(record.officialStartTime), "hh.mm aa")} - ${format(
          parseISO(record.officialEndTime),
          "hh.mm aa"
        )}`
        : "10.00 AM - 6.00 PM"}
    </span>,
    <div key={`checkin-${record._id}`} className="flex flex-col gap-1.5">
      {record.checkin && record.checkout ? (
        <>
          <div className="bg-[#FFF4E5] text-[#C2540A] text-[11px] font-medium px-3 py-1 rounded-full border border-[#FFD9C2] w-fit">
            {format(parseISO(record.checkin), "hh.mm aa")} - {format(parseISO(record.checkout), "hh.mm aa")}
          </div>
          <div className="bg-[#EEF2FF] text-[#4338CA] text-[11px] font-medium px-3 py-1 rounded-full border border-[#C7D2FE] w-fit">
            {format(parseISO(record.checkin), "hh.mm aa")} - {format(parseISO(record.checkout), "hh.mm aa")}
          </div>
        </>
      ) : "-"}
    </div>,
    <span key={`late-${record._id}`} className="text-sm text-gray-600 dark:text-sub-300">
      {record.lateMinutes > 0 ? `${record.lateMinutes} min` : "-"}
    </span>,
    <StatusBadge key={`status-${record._id}`} status={record.status || "Absent"} />,
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

  const headerActions = (
    <button onClick={handleAddAttendance} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-sm">
      <GoPlus size={18} />
      {t("Add an Attendance")}
    </button>
  );

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
          headerActions={headerActions}
        />
      </div>

      <AddAttendanceModal
        isOpen={isAddModalOpen}
        onClose={handleAddAttendance}
        onSubmit={handleAddAttendance}
      />

      <EditAttendanceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        attendance={selectedAttendance}
      />

      <Alert
        type="delete"
        title="Delete Attendance Record?"
        message={(<div>Are you sure you want to delete this attendance record? <span className="block font-bold">This action cannot be undone.</span></div>)}
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onSubmit={confirmDelete}
        titleCancelBtn="Cancel"
        titleSubmitBtn="Delete"
        isBtns={true}
      />

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
StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default AttendanceTab;
