"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import { useGetSentSubscriberNotificationsQuery, useLazyGetSentSubscriberNotificationsQuery, useGetSubscriberNotificationTypesQuery, useRetrySubscriberNotificationMutation } from "@/redux/subscriber-notifications/subscriberNotificationsApi";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { downloadCsvFile } from "./requestsExport.js";
import { usePermission } from "@/Hooks/usePermission";
import SendNotificationModal from "@/app/(dashboard)/hr/employees/modals/SendNotification.modal";
import NotificationDetailsModal from "@/app/(dashboard)/notifications/_components/modals/NotificationDetails.modal";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status";
import { translateDate } from "@/functions/Days";
import {
    RiErrorWarningLine,
    RiBellLine,
    RiInformationLine,
    RiNotification4Line,
    RiRefreshLine,
    RiSearchLine,
    RiDownload2Line,
} from "@remixicon/react";

const ICON_MAP = {
    RiErrorWarningLine: <RiErrorWarningLine size={16} />,
    RiBellLine: <RiBellLine size={16} />,
    RiInformationLine: <RiInformationLine size={16} />,
};

const COLOR_MAP = {
    red: "text-red-500 bg-red-50 dark:bg-red-500/10",
    yellow: "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
};

function NotificationsTap() {
    const { t } = useTranslation();
    const canSendNotification = usePermission("notifications.create");

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [employeeFilter, setEmployeeFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data: notificationsData, isLoading } = useGetSentSubscriberNotificationsQuery({
        page: currentPage,
        limit,
        status: statusFilter,
        typeId: typeFilter,
        search: search || undefined,
        employeeId: employeeFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    });
    const [fetchAllNotifications, { isFetching: isExporting }] = useLazyGetSentSubscriberNotificationsQuery();
    const { data: employeesData = [] } = useGetEmployeesQuery();
    const { data: notificationTypesData } = useGetSubscriberNotificationTypesQuery();
    const [retryNotification, { isLoading: isRetrying }] = useRetrySubscriberNotificationMutation();

    const notifications = notificationsData?.data?.data || [];
    const totalPages = notificationsData?.data?.pagination?.totalPages || 1;
    const summary = notificationsData?.data?.summary || { pending: 0, delivered: 0, read: 0, failed: 0 };
    const notificationTypes = notificationTypesData?.data || [];

    const [isOpenSendNotifyModal, setIsOpenSendNotifyModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: "approval", status: "", message: "", title: "", onConfirm: null });

    const handleExport = async () => {
        const total = notificationsData?.data?.pagination?.total || 1;
        const response = await fetchAllNotifications({ page: 1, limit: total, status: statusFilter, typeId: typeFilter, search, employeeId: employeeFilter, startDate, endDate }).unwrap();
        const all = response?.data?.data || [];
        const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
        const csv = [
            [t("Date"), t("Type"), t("Title"), t("Message"), t("Employee"), t("Status")],
            ...all.map((item) => [item.created_at, item.notification_type_id?.name, item.title, item.message, item.notifiable_id?.name, item.status]),
        ].map((row) => row.map(escape).join(",")).join("\n");
        downloadCsvFile(`notifications-${new Date().toISOString().slice(0, 10)}.csv`, `\uFEFF${csv}`);
    };

    const handleRetry = (notif) => {
        setAlertConfig({
            isOpen: true,
            type: "approval",
            title: t("Resend notification"),
            message: t("Are you sure you want to resend this notification?"),
            onConfirm: async () => {
                try {
                    await retryNotification(notif._id).unwrap();
                    setAlertConfig({
                        isOpen: true,
                        type: "response",
                        status: "success",
                        message: t("Notification sent successfully"),
                    });
                } catch (error) {
                    setAlertConfig({
                        isOpen: true,
                        type: "response",
                        status: "error",
                        message: error?.data?.message || t("Failed to send notification"),
                    });
                }
            },
        });
    };

    const customActions = (rowIndex) => {
        const notif = notifications[rowIndex];
        if (!notif) return null;
        const canRetry = ["failed", "pending"].includes(notif.status);
        return (
            <div className="flex flex-col bg-surface shadow-xl rounded-xl border border-status-border min-w-40 overflow-hidden py-1">
                <button
                    onClick={() => setSelectedNotification(notif)}
                    className="w-full px-4 py-2 text-sm text-cell-primary flex gap-3 items-center text-left hover:bg-status-bg transition-colors"
                >
                    {t("View Details")}
                </button>
                {canRetry && (
                    <button
                        onClick={() => handleRetry(notif)}
                        disabled={isRetrying}
                        className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 text-blue-600 hover:bg-status-bg transition-colors disabled:opacity-50"
                    >
                        <RiRefreshLine size={15} />
                        {t("Retry")}
                    </button>
                )}
            </div>
        );
    };

    const headers = [
        { label: t("Date"), width: "120px" },
        { label: t("Type"), width: "150px" },
        { label: t("Title & Message"), width: "300px" },
        { label: t("Employee"), width: "200px" },
        { label: t("Status"), width: "120px" },
    ];

    const getNotificationRows = () => {
        return notifications.map((notif) => {
            const type = notif.notification_type_id || {};
            const Icon = ICON_MAP[type.icon] || <RiInformationLine size={16} />;
            const colorClass = COLOR_MAP[type.color] || "text-cell-secondary bg-status-bg dark:bg-gray-500/10";
            const employee = notif.notifiable_id || {};

            return [
                notif.created_at ? translateDate(notif.created_at) : "-",
                <div key={`type-${notif._id}`} className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-full ${colorClass}`}>
                        {Icon}
                    </span>
                    <span className="font-medium text-sm text-cell-primary">{t(type.name) || t("Notification")}</span>
                </div>,
                <div key={`info-${notif._id}`} className="flex flex-col max-w-xs">
                    <span className="font-semibold text-cell-primary text-sm truncate" title={notif.title}>{notif.title}</span>
                    <span className="text-xs text-cell-secondary truncate" title={notif.message}>{notif.message}</span>
                </div>,
                <AccountDetails
                    key={`employee-${notif._id}`}
                    path={employee._id ? `/hr/employees/${employee._id}/profile` : undefined}
                    account={{
                        name: employee.name || t("Unknown"),
                        imageProfile: "https://ui-avatars.com/api/?name=" + (employee.name || "User") + "&background=random",
                    }}
                />,
                <Status key={`status-${notif._id}`} type={notif.status} />,
            ];
        });
    };

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                    ["Pending", summary.pending, "text-amber-600 bg-amber-50 dark:bg-amber-900/20"],
                    ["Delivered", summary.delivered, "text-blue-600 bg-blue-50 dark:bg-blue-900/20"],
                    ["Read", summary.read, "text-green-600 bg-green-50 dark:bg-green-900/20"],
                    ["Failed", summary.failed, "text-red-600 bg-red-50 dark:bg-red-900/20"],
                ].map(([label, count, classes]) => (
                    <div key={label} className={`rounded-xl border border-status-border p-3 ${classes}`}>
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-xs font-medium">{t(label)}</div>
                    </div>
                ))}
            </div>
            <Table
                title={t("Notifications")}
                headers={headers}
                rows={getNotificationRows()}
                isActions={false}
                isCheckInput={false}
                isLoading={isLoading}
                headerActions={
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg border border-status-border bg-surface">
                            <RiSearchLine size={16} className="text-cell-secondary shrink-0" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder={t("Search notifications...")}
                                className="bg-transparent outline-none text-sm text-cell-primary placeholder:text-cell-secondary w-40"
                                aria-label={t("Search notifications...")}
                            />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={(event) => { setTypeFilter(event.target.value); setCurrentPage(1); }}
                            className="p-2 rounded-lg border border-status-border bg-surface text-sm text-cell-primary"
                            aria-label={t("Notification Type")}
                        >
                            <option value="">{t("All Types")}</option>
                            {notificationTypes.map((type) => (
                                <option key={type._id} value={type._id}>{t(type.name)}</option>
                            ))}
                        </select>
                        <select value={employeeFilter} onChange={(event) => { setEmployeeFilter(event.target.value); setCurrentPage(1); }} className="p-2 rounded-lg border border-status-border bg-surface text-sm text-cell-primary">
                            <option value="">{t("All Employees")}</option>
                            {employeesData.map((employee) => <option key={employee._id} value={employee._id}>{employee.user?.name || t("Unknown")}</option>)}
                        </select>
                        <input type="date" value={startDate} onChange={(event) => { setStartDate(event.target.value); setCurrentPage(1); }} className="p-2 rounded-lg border border-status-border bg-surface text-sm text-cell-primary" aria-label={t("Start Date")} />
                        <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => { setEndDate(event.target.value); setCurrentPage(1); }} className="p-2 rounded-lg border border-status-border bg-surface text-sm text-cell-primary" aria-label={t("End Date")} />
                        <button type="button" onClick={handleExport} disabled={isExporting} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-status-border text-sm text-cell-primary disabled:opacity-50">
                            <RiDownload2Line size={16} /> {t("Export CSV")}
                        </button>
                        {canSendNotification && (
                        <button
                            onClick={() => setIsOpenSendNotifyModal(true)}
                            className="bg-badge-bg text-primary-base px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            <RiNotification4Line size={16} />
                            {t("Send Notification")}
                        </button>
                        )}
                    </div>
                }
                showStatusFilter={true}
                statusOptions={[
                    { name: "All Statuses", value: "all" },
                    { name: "Pending", value: "pending" },
                    { name: "Delivered", value: "delivered" },
                    { name: "Read", value: "read" },
                    { name: "Failed", value: "failed" },
                ]}
                selectedStatus={statusFilter}
                onStatusChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
                defaultRowsPerPage={limit}
                hidePagination={true}
                customActions={customActions}
                onRowClick={(index) => setSelectedNotification(notifications[index])}
            />

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-3">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        className="px-4 py-2 rounded-lg border border-status-border text-sm text-cell-primary disabled:opacity-40"
                    >
                        {t("Previous")}
                    </button>
                    <span className="text-sm text-cell-secondary">
                        {t("Page")} {currentPage} {t("of")} {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        className="px-4 py-2 rounded-lg border border-status-border text-sm text-cell-primary disabled:opacity-40"
                    >
                        {t("Next")}
                    </button>
                </div>
            )}

            <SendNotificationModal
                isOpen={isOpenSendNotifyModal}
                onClose={() => setIsOpenSendNotifyModal(false)}
            />
            <NotificationDetailsModal
                isOpen={Boolean(selectedNotification)}
                onClose={() => setSelectedNotification(null)}
                notification={selectedNotification}
            />

            {alertConfig.type === "approval" ? (
                <ApprovalAlert
                    isOpen={alertConfig.isOpen}
                    onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={alertConfig.onConfirm}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    confirmBtnText={t("Confirm")}
                    cancelBtnText={t("Cancel")}
                />
            ) : (
                <ApiResponseAlert
                    isOpen={alertConfig.isOpen}
                    status={alertConfig.status}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                />
            )}
        </>
    );
}

export default NotificationsTap;
