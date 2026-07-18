"use client";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
    useGetSupportTicketsQuery,
    useDeleteSupportTicketMutation,
} from "@/redux/support-tickets/supportTicketsApi";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { translateDate } from "@/functions/Days";
import { useRouter } from "next/navigation";
import CreateTicketModal from "./_modals/CreateTicketModal";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";
import { usePermission } from "@/Hooks/usePermission";
import StatusActions from "@/components/Dropdowns/StatusActions";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ProcessingOverlay from "@/components/Feedback/ProcessingOverlay.jsx";
import { RiDeleteBin7Line, RiEyeLine } from "@remixicon/react";

function SupportTicketsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const user = useSelector(selectUser);
    const isAdmin = user?.type === 'Admin';
    const canCreateTicket = usePermission("support_tickets.create");
    const canDeleteTicket = usePermission("support_tickets.delete");
    const { data: response, isLoading } = useGetSupportTicketsQuery();
    const tickets = [...(response?.data || [])].sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt);
        const dateB = new Date(b.created_at || b.createdAt);
        if (dateB.getTime() !== dateA.getTime()) return dateB - dateA;
        return (b._id || '').localeCompare(a._id || '');
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [deleteTicket, { isLoading: isDeleting }] = useDeleteSupportTicketMutation();

    const [approvalConfig, setApprovalConfig] = useState({
        isOpen: false, type: "warning", title: "", message: "", onConfirm: null,
    });
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const confirm = (cfg) => setApprovalConfig({ ...cfg, isOpen: true });
    const closeApproval = () => setApprovalConfig((p) => ({ ...p, isOpen: false }));
    const respond = (status, message) => setApiResponse({ isOpen: true, status, message });
    const closeResponse = () => setApiResponse((p) => ({ ...p, isOpen: false }));

    const handleDelete = (ticket) => {
        confirm({
            type: "danger",
            title: t("Delete Ticket"),
            message: t(`Are you sure you want to delete "${ticket.title}"? This action cannot be undone.`),
            onConfirm: async () => {
                try {
                    await deleteTicket(ticket._id).unwrap();
                    respond("success", t("Ticket deleted successfully!"));
                } catch (err) {
                    respond("error", err?.data?.message || t("Failed to delete ticket."));
                }
            },
        });
    };

    const headers = [
        { label: t("Title") },
        ...(isAdmin ? [{ label: t("Subscriber") }] : []),
        { label: t("Priority") },
        { label: t("Status") },
        { label: t("Created At") },
        { label: "", width: "8%" },
    ];

    const getPriorityStyle = (priority) => {
        const p = priority?.toUpperCase();
        switch (p) {
            case 'URGENT': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            case 'HIGH': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'LOW': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const TicketActions = ({ ticket }) => {
        const actions = [
            {
                text: t("View"),
                icon: <RiEyeLine size={18} className="text-primary-400" />,
                onClick: () => router.push(`/support-tickets/${ticket._id}`),
            },
        ];
        if (canDeleteTicket) {
            actions.push({
                text: t("Delete"),
                icon: <RiDeleteBin7Line size={18} className="text-red-500" />,
                onClick: () => handleDelete(ticket),
            });
        }
        return <StatusActions states={actions} />;
    };

    const rows = tickets.map(ticket => [
        <div key={ticket._id} className="font-medium text-cell-primary">{ticket.title}</div>,
        ...(isAdmin ? [<div key={`sub-${ticket._id}`} className="text-sm text-cell-secondary">{ticket.subscriber?.name || '-'}</div>] : []),
        <span key={`pri-${ticket._id}`} className={`px-2 py-1 text-xs font-bold rounded-full ${getPriorityStyle(ticket.priority)}`}>
            {t(ticket.priority || 'LOW')}
        </span>,
        <Status key={`stat-${ticket._id}`} type={ticket.status} title={t(ticket.status)} />,
        translateDate(ticket.created_at),
    ]);

    const handleRowClick = (rowIndex) => {
        const ticketId = tickets[rowIndex]?._id;
        if (ticketId) {
            router.push(`/support-tickets/${ticketId}`);
        }
    };

    return (
        <Page
            title={t("Support Tickets")}
            isBtn={!isAdmin && canCreateTicket}
            btnTitle={t("Open Ticket")}
            btnOnClick={() => setIsCreateModalOpen(true)}
        >
            <Table
                headers={headers}
                rows={rows}
                isLoading={isLoading}
                isActions={false}
                isCheckInput={false}
                onRowClick={handleRowClick}
                emptyMessage={t("No support tickets found")}
                customActions={(idx) => <TicketActions ticket={tickets[idx]} />}
            />

            <ProcessingOverlay
                isOpen={isDeleting}
                message={t("Deleting ticket...")}
            />

            <CreateTicketModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <ApprovalAlert
                isOpen={approvalConfig.isOpen}
                onClose={closeApproval}
                onConfirm={approvalConfig.onConfirm}
                title={approvalConfig.title}
                message={approvalConfig.message}
                type={approvalConfig.type}
                confirmBtnText={t("Yes, Delete")}
                cancelBtnText={t("Cancel")}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={closeResponse}
            />
        </Page>
    );
}

export default SupportTicketsPage;
