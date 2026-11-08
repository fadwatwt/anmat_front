"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import BulkDeleteButton from "@/components/Tables/BulkDeleteButton.jsx";
import { GoPlus } from "react-icons/go";
import { useProcessing } from "@/app/providers";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert.jsx";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { RiEditLine, RiDeleteBin7Line } from "@remixicon/react";

import Page from "@/components/Page.jsx";
import CreatePositionModal from "./modals/CreatePositionModal.jsx";
import ImportPositionsModal from "./modals/ImportPositionsModal.jsx";
import EditPositionModal from "./modals/EditPositionModal.jsx";

import {
    useGetPositionsQuery,
    useDeletePositionMutation,
    useDeleteManyPositionsMutation,
} from "@/redux/positions/positionsApi";
import { usePermission } from "@/Hooks/usePermission";

function PositionsPage() {
    const { t, i18n } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();
    const { data: positions = [], isLoading } = useGetPositionsQuery();
    const [deletePosition] = useDeletePositionMutation();
    const [deleteManyPositions] = useDeleteManyPositionsMutation();

    const canCreatePosition = usePermission("positions.create");
    const canUpdatePosition = usePermission("positions.update");
    const canDeletePosition = usePermission("positions.delete");

    const [selectedPosition, setSelectedPosition] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [tableKey, setTableKey] = useState(0);

    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: "",
        message: "",
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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
                message: t("Position deleted successfully"),
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

    const handleSelectionChange = (indices) => {
        setSelectedIds(indices.map((i) => positions[i]?._id).filter(Boolean));
    };

    const confirmBulkDelete = async () => {
        showProcessing(t("Deleting positions..."));
        try {
            const result = await deleteManyPositions(selectedIds).unwrap();
            const failedCount = result?.data?.failed?.length || 0;
            setApiResponse({
                isOpen: true,
                status: failedCount > 0 ? "warning" : "success",
                message:
                    failedCount > 0
                        ? t("{{count}} item(s) deleted, {{failed}} failed", {
                              count: result?.data?.deleted ?? 0,
                              failed: failedCount,
                          })
                        : t("{{count}} positions deleted successfully", {
                              count: selectedIds.length,
                          }),
            });
            setSelectedIds([]);
            setTableKey((k) => k + 1);
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to delete selected items"),
            });
        } finally {
            hideProcessing();
        }
    };

    const headerActions = (
        <>
            {canCreatePosition ? (
                <button onClick={() => setIsImportModalOpen(true)} className="rounded-lg border border-status-border px-4 py-2 text-sm font-semibold">
                    {i18n.language?.startsWith("ar") ? "استيراد المناصب" : "Import positions"}
                </button>
            ) : null}
            {canCreatePosition ? (
                <button onClick={handleCreatePosition} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm">
                    <GoPlus size={18} />
                    {t("Create a Position")}
                </button>
            ) : null}
            <BulkDeleteButton
                count={selectedIds.length}
                onConfirm={confirmBulkDelete}
                permission="positions.delete"
            />
        </>
    );

    return (
        <Page title={t("HR - Positions Management")}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 h-full">
                    <Table
                        key={tableKey}
                        title={"Positions"}
                        headers={headers}
                        rows={rows}
                        isCheckInput={true}
                        isTitle={true}
                        classContainer="w-full"
                        isActions={false}
                        customActions={(index) => {
                            const states = [];
                            if (canUpdatePosition) {
                                states.push({
                                    text: t("Edit"),
                                    icon: <RiEditLine className="text-primary-base" />,
                                    onClick: () => handleEdit(index),
                                });
                            }
                            if (canDeletePosition) {
                                states.push({
                                    text: t("Delete"),
                                    icon: <RiDeleteBin7Line className="text-red-500" />,
                                    onClick: () => handleDelete(index),
                                });
                            }
                            return states.length > 0 ? <StatusActions states={states} /> : null;
                        }}
                        headerActions={headerActions}
                        onSelectionChange={handleSelectionChange}
                        showControlBar={false}
                        hideSearchInput={false}
                    />
                </div>

                <CreatePositionModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
                <ImportPositionsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} existingPositions={positions} />

                <EditPositionModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    position={selectedPosition}
                />

                <ApprovalAlert
                    type="danger"
                    title="Delete Position?"
                    message={t("Are you sure you want to Delete {{title}} position?", { title: selectedPosition?.title })}
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
