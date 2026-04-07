"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiEditLine } from "@remixicon/react";
import { RiDeleteBin7Line } from "react-icons/ri";
import * as Iconsax from 'iconsax-react';

import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { statusCell } from "@/components/StatusCell";
import { useProcessing } from "@/app/providers";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import CreateIndustryModal from "./modals/CreateIndustry.modal.jsx";

import {
    useGetIndustriesQuery,
    useCreateIndustryMutation,
    useDeleteIndustryMutation
} from "@/redux/industries/industriesApi";

// 1. مكون الأكشنز المنفصل
const IndustryActions = ({ i18n, t, onEdit, onDelete }) => {
    const actions = [
        {
            text: t("Edit"),
            icon: <RiEditLine className="text-blue-500" />,
            onClick: onEdit
        },
        {
            text: t("Delete"),
            icon: <RiDeleteBin7Line className="text-red-500" />,
            onClick: onDelete
        }
    ];

    return (
        <StatusActions
            states={actions}
            className={i18n.language === "ar" ? "left-0" : "right-0"}
        />
    );
};

function IndustriesPage() {
    const { i18n, t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();

    const { data: industriesResponse, isLoading } = useGetIndustriesQuery();

    const tableHeaders = useMemo(() => [
        { label: t("Industry Name"), width: "200px" },
        { label: t("Icon"), width: "100px" },
        { label: t("By User"), width: "150px" },
        { label: t("Is Allowed"), width: "150px" },
        { label: t("Status"), width: "120px" },
        { label: "", width: "50px" }
    ], [t]);
    const [createIndustry] = useCreateIndustryMutation();
    const [deleteIndustry] = useDeleteIndustryMutation();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [apiAlert, setApiAlert] = useState({ isOpen: false, status: "", message: "" });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });
    const [createConfirm, setCreateConfirm] = useState({ isOpen: false, data: null });

    const industriesData = industriesResponse?.data || industriesResponse || [];

    // دالة التبديل (Toggles)
    const toggleCreateModal = () => {
        if (isCreateModalOpen) setSelectedIndustry(null);
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const handleAction = (formData) => {
        setCreateConfirm({ isOpen: true, data: formData });
    };

    const confirmAction = async () => {
        const formData = createConfirm.data;
        if (!formData) return;

        setCreateConfirm({ isOpen: false, data: null });
        showProcessing(formData._id ? t("Updating Industry…") : t("Creating Industry…"));
        try {
            if (formData._id) {
                // Keep the original logic (which seems to be using delete mutation for update)
                // for consistency with the existing code structure.
                await deleteIndustry(formData._id).unwrap();
            } else {
                await createIndustry(formData).unwrap();
            }
            setApiAlert({
                isOpen: true,
                status: "success",
                message: formData._id ? t("Industry updated successfully") : t("Industry created successfully")
            });
            setIsCreateModalOpen(false);
            setSelectedIndustry(null);
        } catch (error) {
            setApiAlert({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Something went wrong")
            });
        } finally {
            hideProcessing();
        }
    };

    const handleDeleteClick = (industry) => {
        setDeleteConfirm({ isOpen: true, item: industry });
    };

    const onConfirmDelete = async () => {
        const industry = deleteConfirm.item;
        if (!industry) return;

        showProcessing(t("Deleting Industry…"));
        setDeleteConfirm({ isOpen: false, item: null });
        try {
            await deleteIndustry(industry._id).unwrap();
            setApiAlert({
                isOpen: true,
                status: "success",
                message: t("Industry deleted successfully")
            });
        } catch (error) {
            setApiAlert({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to delete")
            });
        } finally {
            hideProcessing();
        }
    };

    // 3. معالجة البيانات وتحويلها لصفوف الجدول
    const rows = useMemo(() => {
        return industriesData.map((item) => {
            const IconName = item.icon_name || item.logo;
            const IconComponent = IconName && Iconsax[IconName];

            return [
                // اسم الصناعة
                <div key={`${item._id}_name`} className="text-cell-primary font-medium">{item.name}</div>,

                // اللوجو
                <div key={`${item._id}_icon`} className="w-12 h-12 flex items-center justify-center">
                    {IconComponent ? (
                        <div className="bg-badge-bg p-2 rounded-xl text-badge-text flex items-center justify-center border border-status-border">
                            <IconComponent size={24} variant="Bold" color="currentColor" />
                        </div>
                    ) : IconName && IconName.includes('/') ? (
                        <img className="w-full h-full object-contain" src={IconName} alt={item.name} />
                    ) : (
                        <div className="bg-status-bg border border-status-border w-full h-full rounded flex items-center justify-center text-[10px] text-cell-secondary">
                            {IconName || t("No Logo")}
                        </div>
                    )}
                </div>,

                // By Subscriber
                <div key={`${item._id}_bysub`} className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs border ${item.by_subscriber ? "bg-badge-bg text-badge-text border-status-border" : "bg-status-bg text-cell-secondary border-status-border"}`}>
                        {item.by_subscriber ? t("Subscriber") : t("Admin")}
                    </span>
                </div>,

                // Is Allowed
                <div key={`${item._id}_allowed`} className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs border ${item.is_allowed
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800"}`}>
                        {item.is_allowed ? t("Allowed") : t("Blocked")}
                    </span>
                </div>,

                statusCell(item.status || "Active", item._id),
                "" // Placeholder for actions
            ];
        });
    }, [industriesData, t]);

    if (isLoading) return <div className="p-10 text-center">{t("Loading...")}</div>;

    return (
        <Page
            title={t("Industries")}
            isBtn={true}
            btnTitle={t("Add Industry")}
            btnOnClick={toggleCreateModal}
        >
            <Table
                title={t("All Industries")}
                headers={tableHeaders}
                rows={rows}
                classContainer="rounded-2xl px-8"
                isActions={false}
                isFilter={true}
                customActions={(index) => {
                    const industry = industriesData[index];
                    return (
                        <IndustryActions
                            i18n={i18n}
                            t={t}
                            onEdit={() => {
                                setSelectedIndustry(industry);
                                setIsCreateModalOpen(true);
                            }}
                            onDelete={() => handleDeleteClick(industry)}
                        />
                    );
                }}
            />
            <CreateIndustryModal
                isOpen={isCreateModalOpen}
                onClose={toggleCreateModal}
                onClick={handleAction}
                item={selectedIndustry}
            />
            <ApiResponseAlert
                isOpen={apiAlert.isOpen}
                status={apiAlert.status}
                message={apiAlert.message}
                onClose={() => setApiAlert({ ...apiAlert, isOpen: false })}
                successTitle={t("Success")}
                errorTitle={t("Error")}
            />
            <ApprovalAlert
                isOpen={deleteConfirm.isOpen}
                title={t("Delete Industry")}
                message={t("Are you sure you want to delete \"{{name}}\"? This action cannot be undone.", { name: deleteConfirm.item?.name })}
                type="danger"
                onConfirm={onConfirmDelete}
                onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
                confirmBtnText={t("Yes, Delete")}
                cancelBtnText={t("Cancel")}
            />
            <ApprovalAlert
                isOpen={createConfirm.isOpen}
                title={createConfirm.data?._id ? t("Confirm Update") : t("Confirm Creation")}
                message={createConfirm.data?._id 
                    ? t("Are you sure you want to update this industry?") 
                    : t("Are you sure you want to create this new industry?")}
                type="info"
                onConfirm={confirmAction}
                onClose={() => setCreateConfirm({ isOpen: false, data: null })}
                confirmBtnText={createConfirm.data?._id ? t("Update") : t("Create")}
                cancelBtnText={t("Cancel")}
            />
        </Page>
    );
}

export default IndustriesPage;
