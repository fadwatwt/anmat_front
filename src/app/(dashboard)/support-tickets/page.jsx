"use client";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useGetSupportTicketsQuery } from "@/redux/support-tickets/supportTicketsApi";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { translateDate } from "@/functions/Days";
import { useRouter } from "next/navigation";
import CreateTicketModal from "./_modals/CreateTicketModal";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";

function SupportTicketsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const user = useSelector(selectUser);
    const isAdmin = user?.type === 'Admin';
    const { data: response, isLoading } = useGetSupportTicketsQuery();
    const tickets = response?.data || [];
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const headers = [
        { label: t("Title") },
        ...(isAdmin ? [{ label: t("Subscriber") }] : []),
        { label: t("Priority") },
        { label: t("Status") },
        { label: t("Created At") },
    ];

    const getPriorityStyle = (priority) => {
        const p = priority?.toUpperCase();
        switch (p) {
            case 'URGENT': return 'bg-red-100 text-red-600';
            case 'HIGH': return 'bg-orange-100 text-orange-600';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-600';
            case 'LOW': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const rows = tickets.map(ticket => [
        <div key={ticket._id} className="font-medium text-cell-primary">{ticket.title}</div>,
        ...(isAdmin ? [<div key={`sub-${ticket._id}`} className="text-sm text-cell-secondary">{ticket.subscriber?.name || '-'}</div>] : []),
        <span key={`pri-${ticket._id}`} className={`px-2 py-1 text-xs font-bold rounded-full ${getPriorityStyle(ticket.priority)}`}>
            {t(ticket.priority || 'LOW')}
        </span>,
        <Status key={`stat-${ticket._id}`} type={ticket.status} title={t(ticket.status)} />,
        translateDate(ticket.created_at)
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
            isBtn={!isAdmin}
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
            />

            <CreateTicketModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </Page>
    );
}

export default SupportTicketsPage;
