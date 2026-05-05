"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    RiEditLine,
    RiDeleteBin7Line,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
} from "@remixicon/react";
import * as Iconsax from "iconsax-react";

import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { statusCell } from "@/components/StatusCell";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ProcessingOverlay from "@/components/Feedback/ProcessingOverlay.jsx";
import CreateIndustryModal from "./modals/CreateIndustry.modal.jsx";

import {
    useGetIndustriesQuery,
    useDeleteIndustryMutation,
    useUpdateIndustryMutation,
} from "@/redux/industries/industriesApi";

const headers = [
    { label: "Industry Name", width: "25%" },
    { label: "Icon",          width: "12%" },
    { label: "Created By",    width: "12%" },
    { label: "Subscribers",   width: "12%" },
    { label: "Allowed",       width: "12%" },
    { label: "Status",        width: "15%" },
    { label: "",              width: "12%" },
];

function IndustriesPage() {
    const { t, i18n } = useTranslation();

    const { data: industries = [], isLoading, error } = useGetIndustriesQuery();
    const [deleteIndustry, { isLoading: isDeleting }] = useDeleteIndustryMutation();
    const [updateIndustry, { isLoading: isToggling }] = useUpdateIndustryMutation();

    const [isModalOpen,  setIsModalOpen]  = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [approvalConfig, setApprovalConfig] = useState({
        isOpen: false, type: "warning", title: "", message: "", onConfirm: null,
    });
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    /* ── helpers ─────────────────────────────────────────────────── */
    const openCreate  = () => { setSelectedItem(null); setIsModalOpen(true); };
    const openEdit    = (industry) => { setSelectedItem(industry); setIsModalOpen(true); };
    const closeModal  = () => { setIsModalOpen(false); setSelectedItem(null); };

    const confirm      = (cfg) => setApprovalConfig({ ...cfg, isOpen: true });
    const closeApproval = () => setApprovalConfig((p) => ({ ...p, isOpen: false }));
    const respond      = (status, message) => setApiResponse({ isOpen: true, status, message });
    const closeResponse = () => setApiResponse((p) => ({ ...p, isOpen: false }));

    const handleDelete = (industry) => {
        confirm({
            type: "danger",
            title: t("Delete Industry"),
            message: t(`Are you sure you want to delete "${industry.name}"? This action cannot be undone.`),
            onConfirm: async () => {
                try {
                    await deleteIndustry(industry._id).unwrap();
                    respond("success", t("Industry deleted successfully!"));
                } catch (err) {
                    respond("error", err?.data?.message || t("Failed to delete industry."));
                }
            },
        });
    };

    const handleToggleAllowed = (industry) => {
        const next = !industry.is_allowed;
        confirm({
            type: "warning",
            title: next ? t("Enable Industry") : t("Disable Industry"),
            message: t(`Are you sure you want to ${next ? "enable" : "disable"} "${industry.name}"?`),
            onConfirm: async () => {
                try {
                    await updateIndustry({ id: industry._id, is_allowed: next }).unwrap();
                    respond("success", t(`Industry ${next ? "enabled" : "disabled"} successfully!`));
                } catch (err) {
                    respond("error", err?.data?.message || t("Failed to update status."));
                }
            },
        });
    };

    /* ── per-row actions dropdown ────────────────────────────────── */
    const IndustryActions = ({ industry }) => {
        const actions = [
            {
                text: t("Edit"),
                icon: <RiEditLine size={18} className="text-primary-400" />,
                onClick: () => openEdit(industry),
            },
            {
                text: industry.is_allowed ? t("Disable") : t("Enable"),
                icon: industry.is_allowed
                    ? <RiCloseCircleLine size={18} className="text-orange-500" />
                    : <RiCheckboxCircleLine size={18} className="text-green-500" />,
                onClick: () => handleToggleAllowed(industry),
            },
            {
                text: t("Delete"),
                icon: <RiDeleteBin7Line size={18} className="text-red-500" />,
                onClick: () => handleDelete(industry),
            },
        ];

        return (
            <StatusActions
                states={actions}
                className={i18n.language === "ar" ? "left-0" : "right-0"}
            />
        );
    };

    /* ── row data ────────────────────────────────────────────────── */
    const rows = industries.map((industry) => {
        const iconKey       = industry.icon_name || industry.logo;
        const IconComponent = iconKey && Iconsax[iconKey];

        return [
            /* Industry name + icon preview */
            <div key={`${industry._id}_name`} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 border border-status-border">
                    {IconComponent
                        ? <IconComponent size={20} variant="Bold" className="text-primary-base" />
                        : <span className="text-base">{iconKey || "🏭"}</span>
                    }
                </div>
                <span className="text-sm font-semibold text-cell-primary truncate max-w-[160px]" title={industry.name}>
                    {industry.name}
                </span>
            </div>,

            /* Icon key badge */
            <div key={`${industry._id}_icon`}>
                {iconKey ? (
                    <span className="px-2 py-1 bg-status-bg border border-status-border rounded-lg text-xs text-cell-secondary font-mono">
                        {iconKey}
                    </span>
                ) : (
                    <span className="text-xs text-cell-secondary italic">{t("None")}</span>
                )}
            </div>,

            /* Created by */
            <div key={`${industry._id}_by`}>
                <span className={`px-2 py-1 rounded-full text-xs border ${
                    industry.by_subscriber
                        ? "bg-badge-bg text-badge-text border-status-border"
                        : "bg-status-bg text-cell-secondary border-status-border"
                }`}>
                    {industry.by_subscriber ? t("Subscriber") : t("Admin")}
                </span>
            </div>,

            /* Subscribers count */
            <div key={`${industry._id}_subs`}>
                <span className="text-sm font-semibold text-cell-primary">
                    {industry.subscribers_count ?? 0}
                </span>
            </div>,

            /* Allowed badge — click to toggle */
            <div key={`${industry._id}_allowed`} className="cursor-pointer" onClick={() => handleToggleAllowed(industry)}>
                <span className={`px-2 py-1 rounded-full text-xs border ${
                    industry.is_allowed
                        ? "bg-green-50 text-green-600 border-green-100"
                        : "bg-red-50 text-red-600 border-red-100"
                }`}>
                    {industry.is_allowed ? t("Allowed") : t("Blocked")}
                </span>
            </div>,

            /* Status cell */
            statusCell(industry.is_allowed ? "active" : "in-active", industry._id),
        ];
    });

    /* ── render ─────────────────────────────────────────────────── */
    if (isLoading) return <div className="flex justify-center items-center h-full p-10">{t("Loading...")}</div>;
    if (error)     return <div className="flex justify-center items-center h-full p-10 text-red-500">{t("Error loading industries.")}</div>;

    return (
        <Page
            title={t("Industries")}
            isBtn={true}
            btnTitle={t("Add Industry")}
            btnOnClick={openCreate}
        >
            <Table
                classContainer="rounded-2xl px-8"
                title={t("All Industries")}
                headers={headers}
                rows={rows}
                isActions={false}
                customActions={(idx) => <IndustryActions industry={industries[idx]} />}
                isFilter={true}
            />

            <ProcessingOverlay
                isOpen={isDeleting || isToggling}
                message={isDeleting ? t("Deleting industry...") : t("Updating status...")}
            />

            <CreateIndustryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                item={selectedItem}
            />

            <ApprovalAlert
                isOpen={approvalConfig.isOpen}
                onClose={closeApproval}
                onConfirm={approvalConfig.onConfirm}
                title={approvalConfig.title}
                message={approvalConfig.message}
                type={approvalConfig.type}
                confirmBtnText={t("Yes, Confirm")}
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

export default IndustriesPage;
