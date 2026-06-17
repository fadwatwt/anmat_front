"use client";
import { useState } from "react";
import Page from "@/components/Page";
import Table from "@/components/Tables/Table";
import { statusCell } from "@/components/StatusCell";
import { useTranslation } from "react-i18next";
import { RiEyeLine, RiPencilLine, RiDeleteBinLine, RiUserAddLine, RiCalendarEventLine, RiFileCopyLine, RiShareForwardLine, RiLink } from "@remixicon/react";
import { IoAdd } from "react-icons/io5";
import CreateMeetingModal from "./modals/CreateMeetingModal";
import InviteNewEmployeeModal from "../employees/modals/InviteNewEmployee,modal";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import Alert from "@/components/Alerts/Alert";
import {
    useGetMeetingsQuery,
    useCreateMeetingMutation,
    useUpdateMeetingMutation,
    useUpdateMeetingStatusMutation,
    useDeleteMeetingMutation,
} from "@/redux/meetings/meetingsApi";
import { useCreateAppointmentMutation } from "@/redux/appointments/appointmentsApi";

const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
};

// eslint-disable-next-line react/prop-types
const DateTimeCell = ({ value }) => {
    const formatted = formatDateTime(value);
    if (formatted === "-") return <span className="text-gray-600 dark:text-gray-400 text-xs">-</span>;
    return (
        <div className="text-gray-600 dark:text-gray-400 text-xs">
            <div>{formatted.date}</div>
            <div>{formatted.time}</div>
        </div>
    );
};

function MeetingManagementPage() {
    const { t } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const [copiedId, setCopiedId] = useState(null);
    const [reminderAlert, setReminderAlert] = useState({ open: false, success: true, title: "" });

    const { data: meetings = [], isLoading } = useGetMeetingsQuery();
    const [createMeeting] = useCreateMeetingMutation();
    const [updateMeeting] = useUpdateMeetingMutation();
    const [updateMeetingStatus] = useUpdateMeetingStatusMutation();
    const [deleteMeeting] = useDeleteMeetingMutation();
    const [createAppointment] = useCreateAppointmentMutation();

    const openMeetingLink = (link) => {
        if (!link) return;
        const url = /^https?:\/\//i.test(link) ? link : `https://${link}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const copyMeetingLink = async (meeting) => {
        if (!meeting?.meeting_link) return;
        try {
            await navigator.clipboard.writeText(meeting.meeting_link);
            setCopiedId(meeting._id);
            setTimeout(() => setCopiedId(null), 1500);
        } catch {
            // clipboard unavailable
        }
    };

    const shareMeetingLink = async (meeting) => {
        if (!meeting?.meeting_link) return;
        const shareData = {
            title: meeting.title,
            text: t("Join the meeting"),
            url: meeting.meeting_link,
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // user cancelled or share unavailable
            }
        } else {
            copyMeetingLink(meeting);
        }
    };

    // Create a reminder appointment from a meeting (so it shows in the agenda with alerts).
    const handleSetReminder = async (meeting) => {
        if (!meeting?._id) return;
        const scheduled = meeting.scheduled_at ? new Date(meeting.scheduled_at) : new Date();
        const date = scheduled.toISOString().slice(0, 10);
        const start_time = scheduled.toTimeString().slice(0, 5);
        try {
            await createAppointment({
                title: meeting.title,
                description: meeting.description || meeting.topics || undefined,
                location: meeting.meeting_link || undefined,
                date,
                start_time,
                category: "meeting",
                enable_reminders: true,
            }).unwrap();
            setReminderAlert({ open: true, success: true, title: meeting.title });
        } catch {
            setReminderAlert({ open: true, success: false, title: meeting.title });
        }
    };

    const headers = [
        { label: t("Meeting Title"), width: "150px" },
        { label: t("Departments"), width: "150px" },
        { label: t("Type"), width: "100px" },
        { label: t("Scheduled at"), width: "150px" },
        { label: t("Started at"), width: "150px" },
        { label: t("Finished at"), width: "150px" },
        { label: t("Created By"), width: "150px" },
        { label: t("Meeting Link"), width: "180px" },
        { label: t("Status"), width: "100px" },
        { label: "", width: "50px" },
    ];

    const handleOpenCreateModal = () => {
        setIsEdit(false);
        setSelectedMeeting(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (index) => {
        setIsEdit(true);
        setSelectedMeeting(meetings[index]);
        setIsCreateModalOpen(true);
    };

    const handleInvite = (index) => {
        setSelectedMeeting(meetings[index]);
        setIsInviteModalOpen(true);
    };

    const handleCancelClick = (index) => {
        setSelectedMeeting(meetings[index]);
        setIsCancelModalOpen(true);
    };

    // Map the modal's form shape into the backend payload.
    // ElementsSelect emits arrays of option objects ({ id, element, ... }).
    const idsOf = (val) => (Array.isArray(val) ? val.map((o) => o.id).filter(Boolean) : []);
    const firstId = (val) => (Array.isArray(val) && val[0] ? val[0].id : undefined);

    const buildPayload = (form) => {
        const scheduled_at = form.date
            ? new Date(`${form.date}T${form.time || "00:00"}`).toISOString()
            : undefined;
        const typeValue =
            typeof form.type === "string" ? form.type : firstId(form.type);
        return {
            title: form.title,
            type: typeValue || undefined,
            topics: form.topics || undefined,
            description: form.description || undefined,
            meeting_link: form.meetingLink || undefined,
            departments_ids: idsOf(form.departments),
            organizers_ids: idsOf(form.admins),
            participants_ids: idsOf(form.participants),
            ...(scheduled_at ? { scheduled_at } : {}),
        };
    };

    const handleSubmitMeeting = async (form) => {
        try {
            const payload = buildPayload(form);
            if (isEdit && selectedMeeting?._id) {
                await updateMeeting({ id: selectedMeeting._id, ...payload }).unwrap();
            } else {
                if (!payload.scheduled_at) payload.scheduled_at = new Date().toISOString();
                await createMeeting(payload).unwrap();
            }
            setIsCreateModalOpen(false);
            setSelectedMeeting(null);
        } catch {
            // error surfaced by RTK Query
        }
    };

    const confirmDelete = async () => {
        try {
            if (selectedMeeting?._id) await deleteMeeting(selectedMeeting._id).unwrap();
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedMeeting(null);
        }
    };

    const confirmCancel = async () => {
        try {
            if (selectedMeeting?._id) {
                await updateMeetingStatus({ id: selectedMeeting._id, status: "cancelled" }).unwrap();
            }
        } finally {
            setIsCancelModalOpen(false);
            setSelectedMeeting(null);
        }
    };

    const tableRows = meetings.map((row) => {
        const deptNames = Array.isArray(row.departments_ids)
            ? row.departments_ids.map((d) => d?.name).filter(Boolean).join(", ")
            : "";
        const creator = row.created_by || {};
        const creatorName = creator.name || "-";
        const creatorAvatar = creator.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}`;
        return [
            <div key={row._id} className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-200">
                {row.title}
            </div>,
            <div key={row._id + "_dept"} className="text-gray-600 dark:text-gray-400">
                {deptNames || "-"}
            </div>,
            <div key={row._id + "_type"} className="text-gray-600 dark:text-gray-400">
                {row.type || "-"}
            </div>,
            <DateTimeCell key={row._id + "_sched"} value={row.scheduled_at} />,
            <DateTimeCell key={row._id + "_start"} value={row.started_at} />,
            <DateTimeCell key={row._id + "_finish"} value={row.finished_at} />,
            <div key={row._id + "_creator"} className="flex items-center gap-2">
                <img src={creatorAvatar} alt={creatorName} className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{creatorName}</span>
                </div>
            </div>,
            row.meeting_link ? (
                <div key={row._id + "_link"} className="flex items-center gap-1.5">
                    <button
                        onClick={() => openMeetingLink(row.meeting_link)}
                        title={row.meeting_link}
                        className="flex items-center gap-1 text-blue-600 hover:underline max-w-[110px]"
                    >
                        <RiLink size={14} className="shrink-0" />
                        <span className="truncate text-xs">{row.meeting_link}</span>
                    </button>
                    <button
                        onClick={() => copyMeetingLink(row)}
                        title={t("Copy Link")}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    >
                        <RiFileCopyLine size={14} className={copiedId === row._id ? "text-green-600" : ""} />
                    </button>
                    <button
                        onClick={() => shareMeetingLink(row)}
                        title={t("Share")}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    >
                        <RiShareForwardLine size={14} />
                    </button>
                </div>
            ) : (
                <span key={row._id + "_link"} className="text-gray-400 text-xs">-</span>
            ),
            statusCell(row.status, row._id),
        ];
    });

    const customActions = (index) => {
        const meeting = meetings[index];
        const hasLink = !!meeting?.meeting_link;
        return (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                    <RiEyeLine size={16} className="text-blue-500" /> {t("View")}
                </button>
                <button onClick={() => handleEdit(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                    <RiPencilLine size={16} className="text-blue-500" /> {t("Edit")}
                </button>
                <button onClick={() => handleInvite(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                    <RiUserAddLine size={16} className="text-blue-500" /> {t("Invite Employee")}
                </button>
                <button onClick={() => handleSetReminder(meeting)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                    <RiCalendarEventLine size={16} className="text-amber-500" /> {t("Set Reminder")}
                </button>
                <button onClick={() => handleCancelClick(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left rounded-md">
                    <RiDeleteBinLine size={16} className="text-red-500" /> {t("Cancel")}
                </button>
                <div className="px-2 py-1">
                    <button
                        onClick={() => openMeetingLink(meeting?.meeting_link)}
                        disabled={!hasLink}
                        title={hasLink ? meeting.meeting_link : t("No meeting link")}
                        className="w-full bg-blue-50 text-blue-600 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t("Join Meeting")}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <Page title={t("HR - Meetings Management")}>
            <Table
                title={t("Meetings")}
                headers={headers}
                rows={tableRows}
                isLoading={isLoading}
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
                onSubmit={handleSubmitMeeting}
            />

            <InviteNewEmployeeModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />

            <Alert
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={t("Delete Meeting")}
                isBtns={true}
                btnApplyTitle={t("Yes, Delete")}
                onClick={confirmDelete}
                className="lg:w-[30%] md:w-1/2 w-11/12 p-6"
                btnApplyClassName="bg-red-600 hover:bg-red-700 text-white"
                message={(
                    <div className="flex flex-col gap-2">
                        <p>{t("Are you sure you want to delete this meeting?")}</p>
                    </div>
                )}
            />

            <CheckAlert
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                title={t("Cancel Meeting")}
                isBtns={true}
                confirmBtnText={t("Yes, Cancel meeting")}
                cancelBtnText={t("Cancel")}
                onSubmit={confirmCancel}
                description={(
                    <div>
                        <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
                            {t("Are you sure you want to cancel")} <span className="font-bold">&quot;{selectedMeeting?.title}&quot;</span>?
                        </p>
                    </div>
                )}
                className="lg:w-[30%] md:w-1/2 w-11/12 p-6"
                btnApplyClassName="bg-red-600 hover:bg-red-700 text-white"
            />

            <Alert
                type={reminderAlert.success ? "success" : "delete"}
                isOpen={reminderAlert.open}
                onClose={() => setReminderAlert((p) => ({ ...p, open: false }))}
                title={reminderAlert.success ? t("Reminder Set") : t("Error")}
                isBtns={false}
                message={
                    reminderAlert.success
                        ? t('A reminder for "{{name}}" has been added to your agenda.', { name: reminderAlert.title })
                        : t("Failed to set reminder")
                }
            />
        </Page>
    );
}

export default MeetingManagementPage;
