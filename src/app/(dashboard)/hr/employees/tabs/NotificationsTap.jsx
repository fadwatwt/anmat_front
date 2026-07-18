"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import { useGetSentSubscriberNotificationsQuery } from "@/redux/subscriber-notifications/subscriberNotificationsApi";
import { usePermission } from "@/Hooks/usePermission";
import SendNotificationModal from "@/app/(dashboard)/hr/employees/modals/SendNotification.modal";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status";
import { translateDate } from "@/functions/Days";
import {
    RiErrorWarningLine,
    RiBellLine,
    RiInformationLine,
    RiNotification4Line,
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

    const { data: notificationsData, isLoading } = useGetSentSubscriberNotificationsQuery({
        page: currentPage,
        limit,
    });

    const notifications = notificationsData?.data?.data || [];
    const totalPages = notificationsData?.data?.pagination?.totalPages || 1;

    const [isOpenSendNotifyModal, setIsOpenSendNotifyModal] = useState(false);

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
            const colorClass = COLOR_MAP[type.color] || "text-gray-500 bg-gray-50 dark:bg-gray-500/10";
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
                    path={`/hr/employees/${employee._id}/profile`}
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
            <Table
                title="Notifications"
                headers={headers}
                rows={getNotificationRows()}
                isActions={false}
                isCheckInput={false}
                isLoading={isLoading}
                headerActions={
                    canSendNotification && (
                        <button
                            onClick={() => setIsOpenSendNotifyModal(true)}
                            className="bg-[#EEF2FF] text-[#375DFB] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            <RiNotification4Line size={16} />
                            {t("Send Notification")}
                        </button>
                    )
                }
                showStatusFilter={true}
                statusOptions={[
                    { name: "Delivered", value: "delivered" },
                    { name: "Read", value: "read" },
                ]}
            />

            <SendNotificationModal
                isOpen={isOpenSendNotifyModal}
                onClose={() => setIsOpenSendNotifyModal(false)}
            />
        </>
    );
}

export default NotificationsTap;
