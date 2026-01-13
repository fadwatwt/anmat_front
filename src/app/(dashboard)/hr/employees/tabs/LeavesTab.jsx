"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import Table from "@/components/Tables/Table";
import { GoPlus } from "react-icons/go";
import Alert from "@/components/Alerts/Alert.jsx";
import { statusCell as StatusCell } from "@/components/StatusCell";
import AddLeaveModal from "../modals/AddLeaveModal";
import EditLeaveModal from "../modals/EditLeaveModal";
import { GoCheckCircleFill } from "react-icons/go";
import { BsClockFill } from "react-icons/bs";
import { BsSlashCircleFill } from "react-icons/bs";

function LeavesTab() {
    const { t } = useTranslation();

    // Mock Data
    const [leaves, setLeaves] = useState([
        {
            _id: "1",
            employee: { name: "Fatma Ahmed Mohamed", department: { name: "Digital Publishing Division Dep Dep" }, profilePicture: "https://i.pravatar.cc/150?u=1" },
            date: "2025-01-16T10:00:00Z",
            checkIn: "2025-01-16T10:00:00Z",
            checkOut: "2025-01-16T18:00:00Z",
            officialStartTime: "2025-01-16T10:00:00Z",
            officialEndTime: "2025-01-16T18:00:00Z",
            lateMinutes: 0,
            status: "On Time"
        },
        {
            _id: "2",
            employee: { name: "Sophia Williams", department: { name: "Publishing Dep" }, profilePicture: "https://i.pravatar.cc/150?u=2" },
            date: "2025-01-16T10:00:00Z",
            checkIn: "2025-01-16T10:30:00Z",
            checkOut: "2025-01-16T18:30:00Z",
            officialStartTime: "2025-01-16T10:00:00Z",
            officialEndTime: "2025-01-16T18:00:00Z",
            lateMinutes: 30,
            status: "Late"
        },
        {
            _id: "3",
            employee: { name: "James Brown", department: { name: "Editorial Software Dep" }, profilePicture: "https://i.pravatar.cc/150?u=3" },
            date: "2025-01-16T10:00:00Z",
            officialStartTime: "2025-01-16T10:00:00Z",
            officialEndTime: "2025-01-16T18:00:00Z",
            checkIn: null,
            checkOut: null,
            lateMinutes: 0,
            status: "Absent"
        }
    ]);


    const StatusBadge = ({ status }) => {
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

    const [selectedLeave, setSelectedLeave] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const headers = [
        { label: t("Employees"), width: "25%" },
        { label: t("Date"), width: "15%" },
        { label: t("Official Working Hours"), width: "15%" },
        { label: t("Check In"), width: "15%" },
        { label: t("Early Leave Hours"), width: "10%" },
        { label: t("Status"), width: "10%" },
        { label: "", width: "5%" },
    ];

    const handleAddLeave = () => {
        setIsAddModalOpen(!isAddModalOpen);
    };

    const handleEdit = (index) => {
        setSelectedLeave(leaves[index]);
        setIsEditModalOpen(true);
    };

    const handleDelete = (index) => {
        setSelectedLeave(leaves[index]);
        setIsDeleteAlertOpen(true);
    };

    const confirmDelete = () => {
        setLeaves(leaves.filter(l => l.id !== selectedLeave.id));
        setIsDeleteAlertOpen(false);
        setIsSuccessAlertOpen(true);
    };

    const handleCreateSubmit = (values) => {
        // Mock create
        const newLeave = {
            id: Math.random().toString(),
            employee: { name: "New Employee", department: "IT" },
            date: values.date,
            checkIn: values.leaveStartTime,
            checkOut: values.leaveEndTime,
            totalHours: values.dailyWorkHours,
            status: "pending"
        };
        setLeaves([...leaves, newLeave]);
    };

    const handleEditSubmit = (values) => {
        // Mock update
        setLeaves(leaves.map(l => l.id === values.id ? values : l));
    };

    const rows = leaves?.map((record) => [
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
            {record.checkIn && record.checkOut ? (
                <>
                    <div className="bg-[#FFF4E5] text-[#C2540A] text-[11px] font-medium px-3 py-1 rounded-full border border-[#FFD9C2] w-fit">
                        {format(parseISO(record.checkIn), "hh.mm aa")} - {format(parseISO(record.checkOut), "hh.mm aa")}
                    </div>
                    <div className="bg-[#EEF2FF] text-[#4338CA] text-[11px] font-medium px-3 py-1 rounded-full border border-[#C7D2FE] w-fit">
                        {format(parseISO(record.checkIn), "hh.mm aa")} - {format(parseISO(record.checkOut), "hh.mm aa")}
                    </div>
                </>
            ) : "-"}
        </div>,
        <span key={`late-${record._id}`} className="text-sm text-gray-600 dark:text-sub-300">
            {record.lateMinutes > 0 ? `${record.lateMinutes} min` : "-"}
        </span>,
        <StatusBadge key={`status-${record._id}`} status={record.status || "Absent"} />,
    ]);


    const headerActions = (
        <button onClick={handleAddLeave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-sm">
            <GoPlus size={18} />
            {t("Add Leave")}
        </button>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 h-full">
                <Table
                    title={"Leaves"}
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

            <AddLeaveModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreateSubmit}
            />

            <EditLeaveModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                leave={selectedLeave}
                onSubmit={handleEditSubmit}
            />

            <Alert
                type="delete"
                title="Delete Leave Record?"
                message={(<div>Are you sure you want to delete this leave record? <span className="block font-bold">This action cannot be undone.</span></div>)}
                isOpen={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                onSubmit={confirmDelete}
                titleCancelBtn="Cancel"
                titleSubmitBtn="Delete"
                isBtns={true}
            />

            <Alert
                type="success"
                title="Leave Record Deleted"
                message="The leave record has been successfully deleted."
                isOpen={isSuccessAlertOpen}
                onClose={() => setIsSuccessAlertOpen(false)}
                isBtns={false}
            />
        </div>
    );
}

export default LeavesTab;
