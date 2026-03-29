"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import { GoPlus } from "react-icons/go";
import { useProcessing } from "@/app/providers";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert.jsx";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { RiEditLine, RiDeleteBin7Line } from "@remixicon/react";

import Page from "@/components/Page.jsx";
import CreatePositionModal from "./modals/CreatePositionModal.jsx";
import EditPositionModal from "./modals/EditPositionModal.jsx";

import { useGetPositionsQuery, useDeletePositionMutation } from "@/redux/positions/positionsApi";

function PositionsPage() {
    const { t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();
    const { data: positions = [], isLoading } = useGetPositionsQuery();
    const [deletePosition] = useDeletePositionMutation();

    const [selectedPosition, setSelectedPosition] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: "",
        message: "",
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const headers = [
        { label: t("Positions"), width: "30%" },
        { label: t("Description"), width: "65%" },
        { label: t(""), width: "5%" }
    ];

    const handleCreatePosition = () => {
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const handleEdit = (index) => {
        setSelectedPosition(positions[index]);
        setIsEditModalOpen(true);
    };

    const handleDelete = (index) => {
        setSelectedPosition(positions[index]);
        setIsDeleteAlertOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedPosition) return;
        setIsDeleteAlertOpen(false);
        showProcessing(t("Deleting position..."));

        try {
            const response = await deletePosition(selectedPosition._id).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || t("Position deleted successfully"),
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to delete position"),
            });
        } finally {
            hideProcessing();
        }
    };

    const rows = positions.map((pos) => [
        <span key={`name-${pos._id}`} className="text-sm font-semibold text-cell-primary">
            {pos.title}
        </span>,
        <span key={`desc-${pos._id}`} className="text-sm text-cell-secondary whitespace-normal">
            {pos.description}
        </span>,
    ]);

    const headerActions = (
        <button onClick={handleCreatePosition} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm">
            <GoPlus size={18} />
            {t("Create a Position")}
        </button>
    );

    return (
        <Page title={t("HR - Positions Management")}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 h-full">
                    <Table
                        title={"Positions"}
                        headers={headers}
                        rows={rows}
                        isCheckInput={true}
                        isTitle={true}
                        classContainer="w-full"
                        isActions={false}
                        customActions={(index) => (
                            <StatusActions
                                states={[
                                    {
                                        text: t("Edit"),
                                        icon: <RiEditLine className="text-primary-base" />,
                                        onClick: () => handleEdit(index),
                                    },
                                    {
                                        text: t("Delete"),
                                        icon: <RiDeleteBin7Line className="text-red-500" />,
                                        onClick: () => handleDelete(index),
                                    },
                                ]}
                            />
                        )}
                        headerActions={headerActions}
                        showControlBar={false}
                        hideSearchInput={false}
                    />
                </div>

                <CreatePositionModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />

                <EditPositionModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    position={selectedPosition}
                />

                <ApprovalAlert
                    type="danger"
                    title="Delete Position?"
                    message={`Are you sure you want to Delete ${selectedPosition?.title} position?`}
                    isOpen={isDeleteAlertOpen}
                    onClose={() => setIsDeleteAlertOpen(false)}
                    onConfirm={confirmDelete}
                    cancelBtnText="Cancel"
                    confirmBtnText="Yes, Delete"
                />

                <ApiResponseAlert
                    isOpen={apiResponse.isOpen}
                    status={apiResponse.status}
                    message={apiResponse.message}
                    onClose={() => setApiResponse((prev) => ({ ...prev, isOpen: false }))}
                />
            </div>
        </Page>
    );
}

export default PositionsPage;
