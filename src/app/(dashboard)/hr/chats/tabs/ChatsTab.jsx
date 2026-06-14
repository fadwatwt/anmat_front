import { useState } from "react";
import Table from "@/components/Tables/Table";
import CreateChatGroupModal from "@/app/(dashboard)/hr/chats/modals/CreateChatGroupModal";
import { statusCell } from "@/components/StatusCell";
import { useTranslation } from "react-i18next";
import { RiEyeLine, RiPencilLine, RiDeleteBinLine } from "@remixicon/react";
import Modal from "@/components/Modal/Modal";
import { IoAdd } from "react-icons/io5";
import {
    useGetChatsQuery,
    useArchiveChatMutation,
} from "@/redux/conversations/conversationsAPI";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function ChatsTab() {
    const { t } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isView, setIsView] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const { data: chatsData } = useGetChatsQuery();
    const [archiveChat, { isLoading: isArchiving }] = useArchiveChatMutation();

    // Only group chats belong in this management screen.
    const rows = (chatsData?.data || chatsData || []).filter((c) => c.is_group);

    const headers = [
        { label: t("Chat Group Title"), width: "100px" },
        { label: t("Admins"), width: "100px" },
        { label: t("No. of Participants"), width: "100px" },
        { label: t("Status"), width: "50px" },
        { label: "", width: "50px" },
    ];

    const handleOpenCreateModal = () => {
        setIsEdit(false);
        setIsView(false);
        setSelectedChat(null);
        setIsCreateModalOpen(true);
    };

    const handleView = (index) => {
        setIsView(true);
        setIsEdit(false);
        setSelectedChat(rows[index]);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (index) => {
        setIsEdit(true);
        setIsView(false);
        setSelectedChat(rows[index]);
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (index) => {
        setSelectedChat(rows[index]);
        setIsDeleteModalOpen(true);
    };

    // The backend has no hard-delete for chats; archiving is the supported action.
    const confirmDelete = async () => {
        if (!selectedChat?._id) return;
        try {
            await archiveChat({ chatId: selectedChat._id, is_archived: true }).unwrap();
            setApiResponse({ isOpen: true, status: "success", message: t("Chat group archived successfully") });
        } catch (err) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: err?.data?.message || t("Failed to archive chat group"),
            });
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedChat(null);
        }
    };

    const renderAdmins = (chat) => {
        const adminIds = (chat?.group_details?.admins || []).map((a) =>
            typeof a === "object" ? a.toString() : a
        );
        const adminUsers = (chat?.participants_ids || []).filter((p) =>
            adminIds.includes((p?._id || p)?.toString())
        );

        if (adminUsers.length === 0) {
            return <span className="text-gray-400 text-sm">—</span>;
        }

        const visible = adminUsers.slice(0, 4);
        const extra = adminUsers.length - visible.length;

        return (
            <div className="flex -space-x-2 items-center">
                {visible.map((admin, idx) => (
                    <div
                        key={admin?._id || idx}
                        className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-gray-700"
                        title={admin?.name}
                    >
                        {(admin?.name || "?").charAt(0).toUpperCase()}
                    </div>
                ))}
                {extra > 0 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        +{extra}
                    </div>
                )}
            </div>
        );
    };

    const tableRows = rows.map((row) => [
        <div key={row._id} className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 overflow-hidden flex items-center justify-center text-blue-600">
                {row.image ? (
                    <img src={row.image} alt={row.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs">{(row.title || "G").charAt(0).toUpperCase()}</span>
                )}
            </div>
            {row.title || t("Untitled Group")}
        </div>,
        renderAdmins(row),
        (row.participants_ids || []).length,
        statusCell(row.is_archived ? "In-active" : "Active", row._id),
    ]);

    const customActions = (index) => (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
            <button onClick={() => handleView(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
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
                title={t("HR - Chats Management - Chats")}
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
                isView={isView}
                editData={selectedChat}
            />

            {/* Delete (archive) Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={t("Delete Chat Group")}
                isBtns={true}
                btnApplyTitle={isArchiving ? t("Saving...") : t("Yes, Delete")}
                onClick={confirmDelete}
                className="lg:w-[30%] md:w-1/2 w-11/12 p-6"
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-2">
                        <RiDeleteBinLine size={32} />
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
                        {t("Are you sure you want to delete")} <span className="font-bold">&quot;{selectedChat?.title}&quot;</span> {t("Group Chat?")}
                    </p>
                </div>
            </Modal>

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
            />
        </>
    );
}

export default ChatsTab;
