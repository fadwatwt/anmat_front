"use client";
import { useState } from "react";

import { useTranslation } from "react-i18next";
import { format, parse } from "date-fns";
import Table from "@/components/Tables/Table";
import {
  useGetAttendancesQuery,
  useDeleteAttendanceMutation,
} from "@/redux/attendance/attendancesApi";
import { BsClockFill, BsSlashCircleFill } from "react-icons/bs";
import { GoCheckCircleFill, GoPlus } from "react-icons/go";

import Alert from "@/components/Alerts/Alert.jsx";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
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
  const { data: attendancesData, isLoading } = useGetAttendancesQuery();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const attendance = attendancesData || [];

  // State for modals and alerts
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteApprovalOpen, setIsDeleteApprovalOpen] = useState(false);
  const [deleteApiResponse, setDeleteApiResponse] = useState({ isOpen: false, status: "", message: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const headers = [
    { label: t("Employee"), width: "250px" },
    { label: t("Date"), width: "120px" },
    { label: t("Start Time"), width: "120px" },
    { label: t("End Time"), width: "120px" },
    { label: t("Late Minutes"), width: "120px" },
    { label: t("Status"), width: "120px" },
    { label: "", width: "50px" },
  ];
  const handleAddAttendance = () => {
    setIsAddModalOpen(!isAddModalOpen)
  }

  // Default avatar URL
  const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=random";

  const rows = attendance?.map((record) => [
    <div key={`emp-${record._id}`} className="flex items-center gap-3 py-1">
      <img
        src={defaultAvatar}
        alt={record.employee?.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-normal leading-tight">
          {record.employee?.name || "N/A"}
        </span>
        <span className="text-gray-500 text-[11px] whitespace-normal leading-tight mt-0.5">
          {record.employee?.email || "N/A"}
        </span>
      </div>
    </div>,
    <span key={`date-${record._id}`} className="text-sm text-gray-700 dark:text-sub-300">
      {record.date ? format(parse(record.date, "yyyy-MM-dd", new Date()), "dd MMM, yyyy") : "N/A"}
    </span>,
    <span key={`start-${record._id}`} className="text-sm text-gray-700 dark:text-sub-300">
      {record.start_time || "-"}
    </span>,
    <span key={`end-${record._id}`} className="text-sm text-gray-700 dark:text-sub-300">
      {record.end_time || "-"}
    </span>,
    <span key={`late-${record._id}`} className="text-sm text-gray-600 dark:text-sub-300">
      {record.late_in_minutes > 0 ? `${record.late_in_minutes} min` : "-"}
    </span>,
    <StatusBadge key={`status-${record._id}`} status={record.late_in_minutes > 0 ? "Late" : "On Time"} />,
  ]);

  const handleEdit = (index) => {
    setSelectedAttendance(attendance[index]);
    setIsEditModalOpen(true);
  };

  const handleDelete = (index) => {
    setSelectedAttendance(attendance[index]);
    setIsDeleteApprovalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAttendance(selectedAttendance._id).unwrap();
      setDeleteApiResponse({
        isOpen: true,
        status: "success",
        message: t("Attendance record deleted successfully")
      });
    } catch (error) {
      setDeleteApiResponse({
        isOpen: true,
        status: "error",
        message: error?.data?.message || error.message || t("Failed to delete attendance record")
      });
    }
  };

  const handleCloseDeleteApiResponse = () => {
    setDeleteApiResponse(prev => ({ ...prev, isOpen: false }));
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
          handelDelete={handleDelete}
          headerActions={headerActions}
        />
      </div>

      <AddAttendanceModal
        isOpen={isAddModalOpen}
        onClose={handleAddAttendance}
      />

      <EditAttendanceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        attendance={selectedAttendance}
      />

      <ApprovalAlert
        isOpen={isDeleteApprovalOpen}
        onClose={() => setIsDeleteApprovalOpen(false)}
        onConfirm={confirmDelete}
        title={t("Delete Attendance Record")}
        message={t("Are you sure you want to delete this attendance record? This action cannot be undone.")}
        confirmBtnText={t("Delete")}
        cancelBtnText={t("Cancel")}
        type="danger"
      />

      <ApiResponseAlert
        isOpen={deleteApiResponse.isOpen}
        status={deleteApiResponse.status}
        message={deleteApiResponse.message}
        onClose={handleCloseDeleteApiResponse}
        successTitle={t("Success")}
        errorTitle={t("Error")}
      />
    </div>
  );
}
StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default AttendanceTab;
