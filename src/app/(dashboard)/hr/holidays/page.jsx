"use client";
import Page from "@/components/Page";
import Table from "@/components/Tables/Table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiPlus } from "react-icons/hi";
import AddHolidayModal from "./modals/AddHolidayModal";
import DeleteHolidayModal from "./modals/DeleteHolidayModal";

function HolidaysPage() {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState("month");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    // Mock Data
    const holidaysData = [
        { id: 1, name: "Eid Al-Fitr - Day 1", description: "Lorem ipsum dolor sit amet, consectetur...", date: "10 Apr 2024" },
        { id: 2, name: "Eid Al-Fitr - Day 2", description: "Lorem ipsum dolor sit amet, consectetur...", date: "11 Apr 2024" },
        { id: 3, name: "Eid Al-Fitr - Day 3", description: "Lorem ipsum dolor sit amet, consectetur...", date: "12 Apr 2024" },
        { id: 4, name: "Labor Day", description: "Lorem ipsum dolor sit amet, consectetur...", date: "1 May 2024" },
    ];

    const headers = [
        { label: "Holiday Name", width: "20%" },
        { label: "Description", width: "40%" },
        { label: "Date", width: "20%" },
        { label: "", width: "50px" },
    ];

    const rows = holidaysData.map((holiday) => [
        <span key="name" className="font-medium text-gray-900 dark:text-gray-200">{holiday.name}</span>,
        <span key="desc" className="text-gray-500">{holiday.description}</span>,
        <span key="date" className="text-gray-500">{holiday.date}</span>
    ]);

    const viewModalList = [
        { id: "week", title: "Week" },
        { id: "month", title: "Month" },
    ];

    const handleEdit = (index) => {
        console.log("Edit holiday", holidaysData[index]);
        // Implement edit logic if needed, reusing AddHolidayModal potentially
    };

    const handleDeleteClick = (index) => {
        setSelectedHoliday(holidaysData[index]);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        console.log("Deleting holiday", selectedHoliday);
        setIsDeleteModalOpen(false);
        // Dispatch delete action
    };

    const HeaderButtons = (
        <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
            <HiPlus size={18} />
            {t("Add Holiday")}
        </button>
    );

    return (
        <>
            <Page title="HR - Holidays Management">
                <Table
                    title="Holidays"
                    isTitle={true}
                    headers={headers}
                    rows={rows}
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
                onClose={() => setIsAddModalOpen(false)}
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
