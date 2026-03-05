
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format, parse } from "date-fns";
import Table from "@/components/Tables/Table";
import { GoPlus } from "react-icons/go";
import {
    useGetLeavesQuery,
    useDeleteLeaveMutation,
} from "@/redux/leaves/leavesApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import AddLeaveModal from "../modals/AddLeaveModal";
import PropTypes from "prop-types";

function LeavesTab() {
    const { t } = useTranslation();
    const { data: leavesData, isLoading } = useGetLeavesQuery();
    const [deleteLeave] = useDeleteLeaveMutation();

    const leaves = leavesData || [];

    // State for modals and alerts
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [isDeleteApprovalOpen, setIsDeleteApprovalOpen] = useState(false);
    const [deleteApiResponse, setDeleteApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const headers = [
        { label: t("Employee"), width: "250px" },
        { label: t("Date"), width: "120px" },
        { label: t("Start Time"), width: "120px" },
        { label: t("End Time"), width: "120px" },
        { label: "", width: "50px" },
    ];

    const handleAddLeave = () => {
        setIsAddModalOpen(!isAddModalOpen);
    };

    // Default avatar URL
    const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=random";

    const rows = leaves?.map((record) => [
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
    ]);

    const handleDelete = (index) => {
        setSelectedLeave(leaves[index]);
        setIsDeleteApprovalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteLeave(selectedLeave._id).unwrap();
            setDeleteApiResponse({
                isOpen: true,
                status: "success",
                message: t("Leave record deleted successfully")
            });
        } catch (error) {
            setDeleteApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || error.message || t("Failed to delete leave record")
            });
        }
    };

    const handleCloseDeleteApiResponse = () => {
        setDeleteApiResponse(prev => ({ ...prev, isOpen: false }));
    };

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
                    handelDelete={handleDelete}
                    headerActions={headerActions}
                />
            </div>

            <AddLeaveModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <ApprovalAlert
                isOpen={isDeleteApprovalOpen}
                onClose={() => setIsDeleteApprovalOpen(false)}
                onConfirm={confirmDelete}
                title={t("Delete Leave Record")}
                message={t("Are you sure you want to delete this leave record? This action cannot be undone.")}
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

export default LeavesTab;
