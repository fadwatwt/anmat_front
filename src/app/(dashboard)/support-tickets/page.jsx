"use client";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { useTranslation } from "react-i18next";
import { useDeferredValue, useMemo, useState } from "react";
import {
    useGetSupportTicketsQuery,
    useGetSupportMetricsQuery,
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
import PropTypes from "prop-types";

function SupportTicketsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const user = useSelector(selectUser);
    const isAdmin = user?.type === 'Admin';
    const canViewPlatformSupport = usePermission("admin.support_tickets.list");
    const isSupportStaff = isAdmin && canViewPlatformSupport;
    const canCreateTicket = usePermission("support_tickets.create");
    const canDeletePlatformTicket = usePermission("admin.support_tickets.delete");
    const canDeleteTicket = isAdmin && canDeletePlatformTicket;
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        priority: "",
        category: "",
        assignment: "all",
        sla: "all",
    });
    const deferredSearch = useDeferredValue(filters.search);
    const queryParams = useMemo(() => Object.fromEntries(Object.entries({
        ...filters,
        search: deferredSearch,
    }).filter(([, value]) => value && value !== "all")), [filters, deferredSearch]);
    const { data: response, isLoading, isFetching } = useGetSupportTicketsQuery(queryParams);
    const { data: metrics } = useGetSupportMetricsQuery(undefined, { skip: !isSupportStaff });
    const tickets = [...(response?.data || [])].sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt);
        const dateB = new Date(b.created_at || b.createdAt);
        if (dateB.getTime() !== dateA.getTime()) return dateB - dateA;
        return (b._id || '').localeCompare(a._id || '');
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const updateFilter = (name, value) => {
        setFilters((current) => ({ ...current, [name]: value }));
    };

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
            title: t("Archive Ticket"),
            message: t("Are you sure you want to archive this ticket? It will be removed from active views but retained for audit purposes."),
            onConfirm: async () => {
                try {
                    await deleteTicket(ticket._id).unwrap();
                    respond("success", t("Ticket archived successfully!"));
                } catch (err) {
                    respond("error", err?.data?.message || t("Failed to delete ticket."));
                }
            },
        });
    };

    const headers = [
        { label: t("Title") },
        ...(isSupportStaff ? [{ label: t("Subscriber") }] : []),
        ...(isSupportStaff ? [{ label: t("Category") }] : []),
        { label: t("Priority") },
        { label: t("Status") },
        ...(isSupportStaff ? [{ label: t("SLA") }] : []),
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

    const getSlaState = (ticket) => {
        if (["waiting-for-customer", "on-hold"].includes(ticket.status)) {
            return { label: t("Paused"), className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" };
        }
        const now = Date.now();
        const firstResponseOverdue = !ticket.first_response_at && ticket.first_response_due_at && new Date(ticket.first_response_due_at).getTime() < now;
        const resolutionOverdue = !ticket.resolved_at && ticket.resolution_due_at && new Date(ticket.resolution_due_at).getTime() < now;
        if (firstResponseOverdue || resolutionOverdue) {
            return { label: t("Overdue"), className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" };
        }
        return { label: t("On track"), className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" };
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
                text: t("Archive"),
                icon: <RiDeleteBin7Line size={18} className="text-red-500" />,
                onClick: () => handleDelete(ticket),
            });
        }
        return <StatusActions states={actions} />;
    };
    TicketActions.propTypes = {
        ticket: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string,
        }).isRequired,
    };

    const rows = tickets.map(ticket => {
        const sla = getSlaState(ticket);
        return [
        <div key={ticket._id} className="font-medium text-cell-primary">{ticket.title}</div>,
        ...(isSupportStaff ? [<div key={`sub-${ticket._id}`} className="text-sm text-cell-secondary">{ticket.subscriber?.name || '-'}</div>] : []),
        ...(isSupportStaff ? [<div key={`cat-${ticket._id}`} className="text-sm text-cell-secondary">{t(ticket.category || 'other')}</div>] : []),
        <span key={`pri-${ticket._id}`} className={`px-2 py-1 text-xs font-bold rounded-full ${getPriorityStyle(ticket.priority)}`}>
            {t(ticket.priority || 'LOW')}
        </span>,
        <Status key={`stat-${ticket._id}`} type={ticket.status} title={t(ticket.status)} />,
        ...(isSupportStaff ? [<span key={`sla-${ticket._id}`} className={`px-2 py-1 text-xs font-bold rounded-full ${sla.className}`}>{sla.label}</span>] : []),
        translateDate(ticket.created_at),
        ];
    });

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
            <div className="mb-5 rounded-2xl border border-status-border bg-surface p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    <input
                        type="search"
                        value={filters.search}
                        onChange={(event) => updateFilter("search", event.target.value)}
                        placeholder={t("Search tickets")}
                        className="min-h-11 rounded-xl border border-status-border bg-status-bg px-3 text-sm text-cell-primary outline-none focus:border-primary-500"
                    />
                    <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)} className="min-h-11 rounded-xl border border-status-border bg-status-bg px-3 text-sm text-cell-primary outline-none focus:border-primary-500">
                        <option value="">{t("All statuses")}</option>
                        <option value="open">{t("open")}</option>
                        <option value="in-progress">{t("in-progress")}</option>
                        <option value="waiting-for-customer">{t("waiting-for-customer")}</option>
                        <option value="on-hold">{t("on-hold")}</option>
                        <option value="resolved">{t("resolved")}</option>
                        <option value="closed">{t("closed")}</option>
                    </select>
                    <select value={filters.priority} onChange={(event) => updateFilter("priority", event.target.value)} className="min-h-11 rounded-xl border border-status-border bg-status-bg px-3 text-sm text-cell-primary outline-none focus:border-primary-500">
                        <option value="">{t("All priorities")}</option>
                        <option value="urgent">{t("Urgent")}</option>
                        <option value="high">{t("High")}</option>
                        <option value="medium">{t("Medium")}</option>
                        <option value="low">{t("Low")}</option>
                    </select>
                    {isSupportStaff && (
                        <select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)} className="min-h-11 rounded-xl border border-status-border bg-status-bg px-3 text-sm text-cell-primary outline-none focus:border-primary-500">
                            <option value="">{t("All categories")}</option>
                            {['technical', 'account', 'subscription', 'payment', 'usage', 'other'].map((category) => <option key={category} value={category}>{t(category)}</option>)}
                        </select>
                    )}
                    {isSupportStaff && (
                        <select value={filters.assignment} onChange={(event) => updateFilter("assignment", event.target.value)} className="min-h-11 rounded-xl border border-status-border bg-status-bg px-3 text-sm text-cell-primary outline-none focus:border-primary-500">
                            <option value="all">{t("All assignments")}</option>
                            <option value="mine">{t("Assigned to me")}</option>
                            <option value="unassigned">{t("Unassigned")}</option>
                        </select>
                    )}
                    {isSupportStaff && (
                        <select value={filters.sla} onChange={(event) => updateFilter("sla", event.target.value)} className="min-h-11 rounded-xl border border-status-border bg-status-bg px-3 text-sm text-cell-primary outline-none focus:border-primary-500">
                            <option value="all">{t("All SLA states")}</option>
                            <option value="overdue">{t("Overdue")}</option>
                            <option value="on-track">{t("On track")}</option>
                            <option value="paused">{t("Paused")}</option>
                        </select>
                    )}
                </div>
                {isFetching && !isLoading && <p className="mt-2 text-xs text-cell-secondary">{t("Updating results...")}</p>}
            </div>
            {isSupportStaff && metrics && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
                    {[
                        [t("Total Tickets"), metrics.total],
                        [t("Open Tickets"), metrics.open],
                        [t("Resolved Tickets"), metrics.resolved],
                        [t("Average First Response"), metrics.average_first_response_ms == null ? "—" : `${Math.max(1, Math.round(metrics.average_first_response_ms / 60000))} ${t("min")}`],
                        [t("Overdue SLA Targets"), (metrics.overdue_first_response || 0) + (metrics.overdue_resolution || 0)],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-status-border bg-surface p-4">
                            <p className="text-xs text-cell-secondary m-0 mb-1">{label}</p>
                            <p className="text-xl font-bold text-cell-primary m-0">{value}</p>
                        </div>
                    ))}
                </div>
            )}
            <Table
                headers={headers}
                rows={rows}
                isLoading={isLoading}
                isActions={false}
                isCheckInput={false}
                hideSearchInput={true}
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
                confirmBtnText={t("Yes, Archive")}
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
