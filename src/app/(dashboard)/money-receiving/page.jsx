"use client";

import { ImSpinner2 } from "react-icons/im";
import { RiCheckboxCircleLine, RiCloseCircleLine, RiEditLine } from "@remixicon/react";
import { RiDeleteBin7Line } from "react-icons/ri";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { statusCell } from "@/components/StatusCell";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import PermissionGuard from "@/components/PermissionGuard";
import { usePermission } from "@/Hooks/usePermission";
import CreateMoneyReceivingModal from "./modal/CreateMoneyReceiving.modal";
import { getMoneyReceivingTypeLabel } from "./moneyReceivingConstants";
import {
    useGetMoneyReceivingMethodsQuery,
    useDeleteMoneyReceivingMethodMutation,
    useToggleMoneyReceivingMethodActiveStatusMutation,
} from "@/redux/money-receiving/moneyReceivingApi";
import PropTypes from "prop-types";

function MoneyReceivingMethodsTab({ canCreate, canUpdate, canDelete, canToggleActivity }) {
    const { t, i18n } = useTranslation();
    const { data: methods, isLoading, error } = useGetMoneyReceivingMethodsQuery();

    const headers = [
        { label: t("Name"), width: "250px" },
        { label: t("Type"), width: "180px" },
        { label: t("Default"), width: "120px" },
        { label: t("Status"), width: "140px" },
        { label: "", width: "50px" },
    ];

    const [deleteMethod] = useDeleteMoneyReceivingMethodMutation();
    const [toggleActiveStatus] = useToggleMoneyReceivingMethodActiveStatusMutation();

    const [approvalConfig, setApprovalConfig] = useState({ isOpen: false, type: "warning", title: "", message: "", onConfirm: null });
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    const handleAction = async (action, method) => {
        let config = {
            isOpen: true,
            title: "",
            message: "",
            type: "warning",
            onConfirm: null,
        };

        if (action === "delete") {
            config = {
                ...config,
                title: t("Delete Money Receiving Method"),
                message: t(
                    'Are you sure you want to delete the method "{{name}}"? This action cannot be undone.',
                    { name: method.title }
                ),
                type: "danger",
                onConfirm: async () => {
                    try {
                        await deleteMethod(method._id).unwrap();
                        setApiResponse({ isOpen: true, status: "success", message: t("Method deleted successfully!") });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || t("Failed to delete method.") });
                    }
                },
            };
        } else if (action === "toggle-status") {
            config = {
                ...config,
                title: method.is_active ? t("Deactivate Money Receiving Method") : t("Activate Money Receiving Method"),
                message: method.is_active
                    ? t('Are you sure you want to deactivate the method "{{name}}"?', { name: method.title })
                    : t('Are you sure you want to activate the method "{{name}}"?', { name: method.title }),
                type: "warning",
                onConfirm: async () => {
                    try {
                        await toggleActiveStatus(method._id).unwrap();
                        setApiResponse({
                            isOpen: true,
                            status: "success",
                            message: t(method.is_active ? "Method deactivated successfully!" : "Method activated successfully!"),
                        });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || t("Failed to update status.") });
                    }
                },
            };
        }

        setApprovalConfig(config);
    };

    const MethodActions = ({ method }) => {
        const statesActions = [
            canUpdate && {
                text: t("Edit"),
                icon: <RiEditLine className="text-primary-400" />,
                onClick: () => {
                    setSelectedMethod(method);
                    setModalOpen(true);
                },
            },
            canToggleActivity && {
                text: method.is_active ? t("Deactivate Money Receiving Method") : t("Activate Money Receiving Method"),
                icon: method.is_active ? (
                    <RiCloseCircleLine className="text-orange-500" />
                ) : (
                    <RiCheckboxCircleLine className="text-green-500" />
                ),
                onClick: () => handleAction("toggle-status", method),
            },
            canDelete && {
                text: t("Delete"),
                icon: <RiDeleteBin7Line className="text-red-500" />,
                onClick: () => handleAction("delete", method),
            },
        ].filter(Boolean);

        return (
            <StatusActions
                states={statesActions}
                className={`${i18n.language === "ar" ? "left-0" : "right-0"}`}
            />
        );
    };

    MethodActions.propTypes = { method: PropTypes.object };

    const rows = methods?.map((method) => [
        <div key={`${method._id}_title`} className="flex items-center justify-start gap-2">
            <span className="text-sm font-medium text-cell-primary max-w-[200px] truncate" title={method.title}>
                {method.title}
            </span>
        </div>,

        <div key={`${method._id}_type`} className="text-sm text-cell-secondary capitalize">
            {t(getMoneyReceivingTypeLabel(method.type))}
        </div>,

        <div key={`${method._id}_default`} className="text-sm">
            {method.is_default ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                    {t("Yes")}
                </span>
            ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-badge-bg text-badge-text border border-status-border">
                    {t("No")}
                </span>
            )}
        </div>,

        <div
            key={`${method._id}_status_wrapper`}
            className={`cursor-pointer ${canToggleActivity ? "" : "cursor-default"}`}
            onClick={() => canToggleActivity && handleAction("toggle-status", method)}
        >
            {statusCell(method.is_active ? "active" : "in-active", method._id)}
        </div>,
    ]) || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full p-10">
                <div className="flex items-center justify-center w-full p-4">
                    <ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full p-10 text-red-500">
                {t("Error loading money receiving methods.")}
            </div>
        );
    }

    return (
        <div>
            {canCreate && (
                <div className="flex justify-end mb-4 px-2">
                    <button
                        onClick={() => {
                            setSelectedMethod(null);
                            setModalOpen(true);
                        }}
                        className="bg-primary-base dark:bg-primary-200 flex gap-1 items-center px-3 py-2 rounded-lg text-sm"
                    >
                        <span className="text-white dark:text-black font-medium">+ {t("Add Money Receiving Method")}</span>
                    </button>
                </div>
            )}

            <Table
                classContainer={"rounded-2xl px-8"}
                title={t("All money receiving methods")}
                headers={headers}
                isActions={false}
                rows={rows}
                customActions={(actualRowIndex) => (
                    <MethodActions method={methods?.[actualRowIndex]} />
                )}
                isFilter={true}
            />

            <ApprovalAlert
                isOpen={approvalConfig.isOpen}
                onClose={() => setApprovalConfig((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={approvalConfig.onConfirm}
                title={approvalConfig.title}
                message={approvalConfig.message}
                type={approvalConfig.type}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse((prev) => ({ ...prev, isOpen: false }))}
            />

            <CreateMoneyReceivingModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedMethod(null);
                }}
                method={selectedMethod}
            />
        </div>
    );
}

function MoneyReceivingPageContent() {
    const { t } = useTranslation();

    const canCreate = usePermission("admin.money_receiving_methods.create");
    const canUpdate = usePermission("admin.money_receiving_methods.update");
    const canDelete = usePermission("admin.money_receiving_methods.delete");
    const canToggleActivity = usePermission("admin.money_receiving_methods.toggle_activity");

    return (
        <Page title={t("Money Receiving Methods")}>
            <MoneyReceivingMethodsTab
                canCreate={canCreate}
                canUpdate={canUpdate}
                canDelete={canDelete}
                canToggleActivity={canToggleActivity}
            />
        </Page>
    );
}

export default function MoneyReceivingPage() {
    return (
        <PermissionGuard permission="admin.money_receiving_methods.list">
            <MoneyReceivingPageContent />
        </PermissionGuard>
    );
}

MoneyReceivingMethodsTab.propTypes = {
    canCreate: PropTypes.bool,
    canUpdate: PropTypes.bool,
    canDelete: PropTypes.bool,
    canToggleActivity: PropTypes.bool,
};

