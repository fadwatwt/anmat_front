"use client";
import React, { useState } from "react";
import Page from "@/components/Page";
import Table from "@/components/Tables/Table";
import CreateMeetingModal from "@/app/(dashboard)/hr/meetings/modals/CreateMeetingModal";
import { statusCell } from "@/components/StatusCell";
import { useTranslation } from "react-i18next";
import { RiEyeLine, RiPencilLine, RiDeleteBinLine, RiUserAddLine, RiCloseCircleLine } from "@remixicon/react";
import Modal from "@/components/Modal/Modal";
import { IoAdd } from "react-icons/io5";
import InviteNewEmployeeModal from "../employees/modals/InviteNewEmployee,modal";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import Alert from "@/components/Alerts/Alert";

function MeetingManagementPage() {
    const { t } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    // Mock Data
    const [rows, setRows] = useState([
        {
            id: 1,
            title: "Kick Off Meeting",
            departments: ["IT", "Design"],
            type: "Anything",
            scheduledAt: "15 Nov, 2024 - 12:00 PM",
            startedAt: "-",
            finishedAt: "-",
            createdBy: { name: "James Brown", role: "Hr Dep", avatar: "https://ui-avatars.com/api/?name=James+Brown" },
            status: "scheduled",
            admins: [],
            participants: [],
            topics: "Anything",
            meetingLink: "www.fgmm.com"
        },
        {
            id: 2,
            title: "Kick Off Meeting",
            departments: ["IT", "Design"],
            type: "Anything",
            scheduledAt: "15 Nov, 2024 - 12:00 PM",
            startedAt: "15 Nov, 2024 - 12:00 PM",
            finishedAt: "15 Nov, 2024 - 12:00 PM",
            createdBy: { name: "James Brown", role: "Hr Dep", avatar: "https://ui-avatars.com/api/?name=James+Brown" },
            status: "completed",
            admins: [],
            participants: [],
            topics: "Anything",
            meetingLink: "www.fgmm.com"
        },
        {
            id: 3,
            title: "Kick Off Meeting",
            departments: ["IT", "Design"],
            type: "Anything",
            scheduledAt: "15 Nov, 2024 - 12:00 PM",
            startedAt: "-",
            finishedAt: "-",
            createdBy: { name: "James Brown", role: "Hr Dep", avatar: "https://ui-avatars.com/api/?name=James+Brown" },
            status: "cancelled",
            admins: [],
            participants: [],
            topics: "Anything",
            meetingLink: "www.fgmm.com"
        },
    ]);

    const headers = [
        { label: "Meeting Title", width: "150px" },
        { label: "Departments", width: "150px" },
        { label: "Type", width: "100px" },
        { label: "Scheduled at", width: "150px" },
        { label: "Started at", width: "150px" },
        { label: "Finished at", width: "150px" },
        { label: "Created By", width: "150px" },
        { label: "Status", width: "100px" },
        { label: "", width: "50px" },
    ];

    const handleOpenCreateModal = () => {
        setIsEdit(false);
        setSelectedMeeting(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (index) => {
        setIsEdit(true);
        setSelectedMeeting(rows[index]);
        setIsCreateModalOpen(true);
    };

    const handleInvite = (index) => {
        setSelectedMeeting(rows[index]);
        setIsInviteModalOpen(true);
    }

    const handleDeleteClick = (index) => {
        setSelectedMeeting(rows[index]);
        setIsDeleteModalOpen(true);
    };

    const handleCancelClick = (index) => {
        setSelectedMeeting(rows[index]);
        setIsCancelModalOpen(true);
    };

    const confirmDelete = () => {
        setRows(rows.filter((r) => r.id !== selectedMeeting.id));
        setIsDeleteModalOpen(false);
        setSelectedMeeting(null);
    };

    const confirmCancel = () => {
        setRows(rows.map(r => r.id === selectedMeeting.id ? { ...r, status: "cancelled" } : r));
        setIsCancelModalOpen(false);
        setSelectedMeeting(null);
    };


    // Format rows for Table
    const tableRows = rows.map((row) => [
        <div key={row.id} className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-200">
            {row.title}
        </div>,
        <div key={row.id + "_dept"} className="text-gray-600 dark:text-gray-400">
            {row.departments.join(", ")}
        </div>,
        <div key={row.id + "_type"} className="text-gray-600 dark:text-gray-400">
            {row.type}
        </div>,
        <div key={row.id + "_sched"} className="text-gray-600 dark:text-gray-400 text-xs">
            {row.scheduledAt.split(" - ").map((part, i) => <div key={i}>{part}</div>)}
        </div>,
        <div key={row.id + "_start"} className="text-gray-600 dark:text-gray-400 text-xs">
            {row.startedAt === "-" ? "-" : row.startedAt.split(" - ").map((part, i) => <div key={i}>{part}</div>)}
        </div>,
        <div key={row.id + "_finish"} className="text-gray-600 dark:text-gray-400 text-xs">
            {row.finishedAt === "-" ? "-" : row.finishedAt.split(" - ").map((part, i) => <div key={i}>{part}</div>)}
        </div>,
        <div key={row.id + "_creator"} className="flex items-center gap-2">
            <img src={row.createdBy.avatar} alt={row.createdBy.name} className="w-8 h-8 rounded-full" />
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{row.createdBy.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{row.createdBy.role}</span>
            </div>
        </div>,
        statusCell(row.status, row.id),
    ])

    const customActions = (index) => (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiEyeLine size={16} className="text-blue-500" /> {t("View")}
            </button>
            <button onClick={() => handleEdit(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiPencilLine size={16} className="text-blue-500" /> {t("Edit")}
            </button>
            <button onClick={() => handleInvite(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiUserAddLine size={16} className="text-blue-500" /> {t("Invite Employee")}
            </button>
            <button onClick={() => handleCancelClick(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left rounded-md">
                <RiDeleteBinLine size={16} className="text-red-500" /> {t("Cancel")}
            </button>
            <div className="px-2 py-1">
                <button className="w-full bg-blue-50 text-blue-600 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
                    {t("Join Meeting")}
                </button>
            </div>
        </div>
    );

    return (
        <Page title="HR - Meetings Management">
            <Table
                title="Meetings"
                headers={headers}
                rows={tableRows}
                isActions={false}
                customActions={customActions}
                showStatusFilter={true}
                showDatePicker={true}
                showListOfDepartments={true}
                isCheckInput={true}
                headerActions={
                    <button
                        onClick={handleOpenCreateModal}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        <IoAdd size={18} />
                        {t("Create a Meeting")}
                    </button>
                }
            />

            <CreateMeetingModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                isEdit={isEdit}
                editData={selectedMeeting}
            />

            <InviteNewEmployeeModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />

            <Alert isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Meeting"
                isBtns={true} btnApplyTitle="Yes, Delete"
                onClick={confirmDelete}
                className="lg:w-[30%] md:w-1/2 w-11/12 p-6"
                btnApplyClassName="bg-red-600 hover:bg-red-700 text-white"
                message={(
                    <div className="flex flex-col gap-2">
                        <p>Are you sure you want to delete this meeting?</p>
                    </div>
                )}
            />

            <CheckAlert
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                title="Cancel Meeting"
                isBtns={true}
                confirmBtnText="Yes, Cancel meeting"
                cancelBtnText="Cancel"
                onSubmit={confirmCancel}
                description={(
                    <div>
                        <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
                            Are you sure you want to cancel <span className="font-bold">"{selectedMeeting?.title}"</span>?
                        </p>
                    </div>
                )}
                className="lg:w-[30%] md:w-1/2 w-11/12 p-6"
                btnApplyClassName="bg-red-600 hover:bg-red-700 text-white"
            />

        </Page>
    );
}

export default MeetingManagementPage;
