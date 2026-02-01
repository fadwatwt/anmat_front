"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import { GoPlus } from "react-icons/go";
import Alert from "@/components/Alerts/Alert.jsx";
import Page from "@/components/Page.jsx";
import CreatePositionModal from "./modals/CreatePositionModal.jsx";
import EditPositionModal from "./modals/EditPositionModal.jsx";

import { useGetPositionsQuery } from "@/redux/positions/positionsApi";

function PositionsPage() {
    const { t } = useTranslation();
    const { data: positions = [], isLoading } = useGetPositionsQuery();

    const [selectedPosition, setSelectedPosition] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
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

    const confirmDelete = () => {
        // TODO: Implement delete API
        setIsDeleteAlertOpen(false);
        setIsSuccessAlertOpen(true);
    };

    const rows = positions.map((pos) => [
        <span key={`name-${pos._id}`} className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {pos.title}
        </span>,
        <span key={`desc-${pos._id}`} className="text-sm text-gray-500 dark:text-gray-400">
            {pos.description}
        </span>,
    ]);

    const headerActions = (
        <button onClick={handleCreatePosition} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-sm">
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
                        handelEdit={handleEdit}
                        handelDelete={handleDelete}
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

                <Alert
                    type="delete"
                    title="Delete Position?"
                    message={(<div>Are you sure you want to <span className="font-bold">Delete {selectedPosition?.title}</span> position</div>)}
                    isOpen={isDeleteAlertOpen}
                    onClose={() => setIsDeleteAlertOpen(false)}
                    onSubmit={confirmDelete}
                    titleCancelBtn="Cancel"
                    titleSubmitBtn="Yes, Delete"
                    isBtns={true}
                />

                <Alert
                    type="success"
                    title="Position Deleted"
                    message="The position has been successfully deleted."
                    isOpen={isSuccessAlertOpen}
                    onClose={() => setIsSuccessAlertOpen(false)}
                    isBtns={false}
                />
            </div>
        </Page>
    );
}

export default PositionsPage;
