import React, { useState } from "react";
import Table from "@/components/Tables/Table";
import CreateChatGroupModal from "@/app/(dashboard)/hr/chats/modals/CreateChatGroupModal";
import { statusCell } from "@/components/StatusCell";
import { useTranslation } from "react-i18next";
import { RiEyeLine, RiPencilLine, RiDeleteBinLine } from "@remixicon/react";
import Modal from "@/components/Modal/Modal";
import { IoAdd } from "react-icons/io5";

function ChatsTab() {
    const { t } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    // Mock Data
    const [rows, setRows] = useState([
        {
            id: 1,
            title: "IP Lover Group",
            admins: ["user1", "user2"],
            participantsCount: 4,
            status: "Active",
        },
        {
            id: 2,
            title: "IP Lover Group",
            admins: ["user3"],
            participantsCount: 16,
            status: "Active",
        },
        {
            id: 3,
            title: "IP Lover Group",
            admins: ["user1"],
            participantsCount: 22,
            status: "In-active",
        },
        {
            id: 4,
            title: "IP Lover Group",
            admins: ["user1"],
            participantsCount: 22,
            status: "Active",
        },
        {
            id: 5,
            title: "IP Lover Group",
            admins: ["user1"],
            participantsCount: 22,
            status: "In-active",
        },
    ]);

    const headers = [
        { label: "Chat Group Title", width: "100px" },
        { label: "Admins", width: "100px" },
        { label: "No. of Participants", width: "100px" },
        { label: "Status", width: "50px" },
        { label: "", width: "50px" },
    ];

    const handleOpenCreateModal = () => {
        setIsEdit(false);
        setSelectedChat(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (index) => {
        setIsEdit(true);
        setSelectedChat(rows[index]);
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (index) => {
        setSelectedChat(rows[index]);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setRows(rows.filter((r) => r.id !== selectedChat.id));
        setIsDeleteModalOpen(false);
        setSelectedChat(null);
    };

    const renderAdmins = (admins) => {
        return (
            <div className="flex -space-x-2">
                {admins.map((admin, idx) => (
                    <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-700"
                        title={admin}
                    >
                        {admin.charAt(0).toUpperCase()}
                        {/* Replace with <img src={...} /> if avatar URL is available */}
                    </div>
                ))}
            </div>
        );
    };

    const tableRows = rows.map((row) => [
        <div key={row.id} className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"> <span className="text-xs">IMG</span> </div>
            {row.title}
        </div>,
        renderAdmins(row.admins),
        row.participantsCount,
        statusCell(row.status, row.id)
    ]);

    const customActions = (index) => (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiEyeLine size={16} className="text-blue-500" /> {t("View")}
            </button>
            <button onClick={() => handleEdit(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiPencilLine size={16} className="text-blue-500" /> {t("Edit")}
            </button>
            <button onClick={() => handleDeleteClick(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left rounded-md">
                <RiDeleteBinLine size={16} className="text-red-500" /> {t("Delete")}
            </button>
        </div>
    );

    return (
        <>
            <Table
                title="HR - Chats Management - Chats"
                headers={headers}
                rows={tableRows}
                isActions={false}
                customActions={customActions}
                showStatusFilter={true}
                showListOfDepartments={true}
                headerActions={
                    <button
                        onClick={handleOpenCreateModal}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        <IoAdd size={18} />
                        {t("Create Chat Group")}
                    </button>
                }
            />

            <CreateChatGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                isEdit={isEdit}
                editData={selectedChat}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Chat Group"
                isBtns={true}
                btnApplyTitle="Yes, Save"
                onClick={confirmDelete}
                className="lg:w-[30%] md:w-1/2 w-11/12 p-6"
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-2">
                        <RiDeleteBinLine size={32} />
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
                        Are you sure you want to delete <span className="font-bold">"{selectedChat?.title}"</span> Group Chat?
                    </p>
                </div>
            </Modal>
        </>
    );
}

export default ChatsTab;
