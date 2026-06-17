"use client";
import Page from "@/components/Page";
import Table from "@/components/Tables/Table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiPlus } from "react-icons/hi";
import AddHolidayModal from "./modals/AddHolidayModal";
import DeleteHolidayModal from "./modals/DeleteHolidayModal";
import {
    useGetHolidaysQuery,
    useCreateHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
} from "@/redux/holidays/holidaysApi";

const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

function HolidaysPage() {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState("month");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    const { data: holidaysData = [], isLoading } = useGetHolidaysQuery();
    const [createHoliday, { isLoading: isCreating }] = useCreateHolidayMutation();
    const [updateHoliday, { isLoading: isUpdating }] = useUpdateHolidayMutation();
    const [deleteHoliday] = useDeleteHolidayMutation();

    const headers = [
        { label: t("Holiday Name"), width: "20%" },
        { label: t("Description"), width: "40%" },
        { label: t("Date"), width: "20%" },
        { label: "", width: "50px" },
    ];

    const rows = holidaysData.map((holiday) => [
        <span key="name" className="font-medium text-gray-900 dark:text-gray-200">{holiday.name}</span>,
        <span key="desc" className="text-gray-500">{holiday.description || "-"}</span>,
        <span key="date" className="text-gray-500">{formatDate(holiday.date)}</span>,
    ]);

    const viewModalList = [
        { id: "week", title: t("Week") },
        { id: "month", title: t("Month") },
    ];

    const handleEdit = (index) => {
        setSelectedHoliday(holidaysData[index]);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (index) => {
        setSelectedHoliday(holidaysData[index]);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedHoliday?._id) {
                await updateHoliday({ id: selectedHoliday._id, ...formData }).unwrap();
            } else {
                await createHoliday(formData).unwrap();
            }
            setIsAddModalOpen(false);
            setSelectedHoliday(null);
        } catch {
            // RTK Query surfaces the error; keep modal open for retry
        }
    };

    const handleConfirmDelete = async () => {
        try {
            if (selectedHoliday?._id) {
                await deleteHoliday(selectedHoliday._id).unwrap();
            }
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedHoliday(null);
        }
    };

    const HeaderButtons = (
        <button
            onClick={() => { setSelectedHoliday(null); setIsAddModalOpen(true); }}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
            <HiPlus size={18} />
            {t("Add Holiday")}
        </button>
    );

    return (
        <>
            <Page title={t("HR - Holidays Management")}>
                <Table
                    title={t("Holidays")}
                    isTitle={true}
                    headers={headers}
                    rows={rows}
                    isLoading={isLoading}
                    isActions={true}
                    handelEdit={handleEdit}
                    handelDelete={handleDeleteClick}
                    showControlBar={true}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    viewModalList={viewModalList}
                    currentDate={new Date()}
                    headerActions={HeaderButtons}
                    isCheckInput={true}
                    hideSearchInput={false}
                />
            </Page>

            <AddHolidayModal
                isOpen={isAddModalOpen}
                onClose={() => { setIsAddModalOpen(false); setSelectedHoliday(null); }}
                onSubmit={handleSubmit}
                editData={selectedHoliday}
                isSaving={isCreating || isUpdating}
            />

            <DeleteHolidayModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
                holidayName={selectedHoliday?.name}
            />
        </>
    );
}

export default HolidaysPage;
