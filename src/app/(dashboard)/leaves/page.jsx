"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { useGetMyLeavesQuery, useDeleteMyLeaveMutation } from "@/redux/leaves/employeeLeavesApi";
import { format, parse } from "date-fns";
import { HiPlus } from "react-icons/hi";
import AddMyLeaveModal from "./modals/AddMyLeaveModal";
import EditMyLeaveModal from "./modals/EditMyLeaveModal";
import DeleteMyLeaveModal from "./modals/DeleteMyLeaveModal";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useProcessing } from "@/app/providers";

const STATUS_STYLES = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

function MyLeavesPage() {
    const { t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();
    const { data: leavesData, isLoading } = useGetMyLeavesQuery();
    const [deleteMyLeave] = useDeleteMyLeaveMutation();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const headers = [
        { label: t("Date"), width: "27%" },
        { label: t("Start Time"), width: "21%" },
        { label: t("End Time"), width: "21%" },
        { label: t("Status"), width: "25%" },
        { label: "", width: "40px" },
    ];

    const sortedLeaves = [...(leavesData || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const formatTime = (time) => {
        if (!time) return "-";
        const [h, m] = time.split(":").map(Number);
        const period = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
    };

    const rows = sortedLeaves.map((record) => [
        <div key={`date-${record._id}`} className="text-cell-primary font-medium">
            {record.date ? format(parse(record.date, "yyyy-MM-dd", new Date()), "dd MMM, yyyy") : "N/A"}
        </div>,
        <div key={`start-${record._id}`} className="text-cell-secondary">
            {formatTime(record.start_time)}
        </div>,
        <div key={`end-${record._id}`} className="text-cell-secondary">
            {formatTime(record.end_time)}
        </div>,
        <div key={`status-${record._id}`}>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[record.status] || STATUS_STYLES.pending}`}>
                {t(record.status?.charAt(0).toUpperCase() + record.status?.slice(1) || "Pending")}
            </span>
        </div>,
    ]) || [];

    const handleEdit = (index) => {
        setSelectedLeave(sortedLeaves[index]);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (index) => {
        setSelectedLeave(sortedLeaves[index]);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedLeave) return;
        showProcessing(t("Deleting Leave Request..."));
        try {
            await deleteMyLeave(selectedLeave._id).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Leave request deleted successfully")
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || error.message || t("Failed to delete leave request")
            });
        } finally {
            hideProcessing();
            setIsDeleteModalOpen(false);
            setSelectedLeave(null);
        }
    };

    const handleCloseApiResponse = () => {
        setApiResponse(prev => ({ ...prev, isOpen: false }));
    };

    const HeaderButtons = (
        <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
            <HiPlus size={18} />
            {t("Request Leave")}
        </button>
    );

    return (
        <>
            <Page title={t("My Short Leaves")}>
                <Table
                    title={t("Short Leaves History")}
                    headers={headers}
                    rows={rows}
                    isActions={true}
                    isCheckInput={false}
                    isLoading={isLoading}
                    hideSearchInput={false}
                    headerActions={HeaderButtons}
                    handelEdit={handleEdit}
                    handelDelete={handleDeleteClick}
                />
            </Page>

            <AddMyLeaveModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EditMyLeaveModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setSelectedLeave(null); }}
                leaveData={selectedLeave}
            />

            <DeleteMyLeaveModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedLeave(null); }}
                onDelete={handleConfirmDelete}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleCloseApiResponse}
                successTitle={t("Success")}
                errorTitle={t("Error")}
            />
        </>
    );
}

export default MyLeavesPage;
