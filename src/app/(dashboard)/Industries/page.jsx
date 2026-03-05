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
import CreateIndustryModal from "./modals/CreateIndustry.modal.jsx";

import {
    useGetIndustriesQuery,
    useCreateIndustryMutation,
    useDeleteIndustryMutation
} from "@/redux/industries/industriesApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";

// 1. تعريف العناوين الثابتة خارج المكون
const TABLE_HEADERS = [
    { label: "Industry Name", width: "200px" },
    { label: "Icon", width: "100px" },
    { label: "By User", width: "150px" },
    { label: "Is Allowed", width: "150px" },
    { label: "Status", width: "120px" },
    { label: "", width: "50px" }
];

// 2. مكون الأكشنز المنفصل
const IndustryActions = ({ i18n, onDelete }) => {
    const actions = [
        {
            text: "Delete",
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
    const { data: industriesResponse, isLoading } = useGetIndustriesQuery();
    const [createIndustry] = useCreateIndustryMutation();
    const [deleteIndustry] = useDeleteIndustryMutation();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [apiAlert, setApiAlert] = useState({ isOpen: false, status: "", message: "" });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

    const industriesData = industriesResponse?.data || industriesResponse || [];

    // دالة التبديل (Toggles)
    const toggleCreateModal = () => {
        if (isCreateModalOpen) setSelectedIndustry(null);
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const handleAction = async (formData) => {
        try {
            if (formData._id) {
                res = await deleteIndustry(formData._id).unwrap();
            } else {
                await createIndustry(formData).unwrap();
            }
            setApiAlert({
                isOpen: true,
                status: "success",
                message: formData._id ? "Industry deleted successfully" : "Industry created successfully"
            });
            setIsCreateModalOpen(false);
            setSelectedIndustry(null);
        } catch (error) {
            setApiAlert({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Something went wrong")
            });
        }
    };

    const handleDeleteClick = (industry) => {
        setDeleteConfirm({ isOpen: true, item: industry });
    };

    const onConfirmDelete = async () => {
        const industry = deleteConfirm.item;
        if (!industry) return;

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
        }
        setDeleteConfirm({ isOpen: false, item: null });
    };

    // 3. معالجة البيانات وتحويلها لصفوف الجدول
    const rows = useMemo(() => {
        return industriesData.map((item) => {
            const IconName = item.icon_name || item.logo;
            const IconComponent = IconName && Iconsax[IconName];

            return [
                // اسم الصناعة
                <div key={`${item._id}_name`} className="font-medium">{item.name}</div>,

                // اللوجو
                <div key={`${item._id}_icon`} className="w-12 h-12 flex items-center justify-center">
                    {IconComponent ? (
                        <div className="bg-primary-50 p-2 rounded-xl text-primary-500 flex items-center justify-center">
                            <IconComponent size={24} variant="Bold" color="currentColor" />
                        </div>
                    ) : IconName && IconName.includes('/') ? (
                        <img className="w-full h-full object-contain" src={IconName} alt={item.name} />
                    ) : (
                        <div className="bg-gray-200 w-full h-full rounded flex items-center justify-center text-[10px] text-gray-400">
                            {IconName || t("No Logo")}
                        </div>
                    )}
                </div>,

                // By Subscriber
                <div key={`${item._id}_bysub`} className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.by_subscriber ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"}`}>
                        {item.by_subscriber ? t("Subscriber") : t("Admin")}
                    </span>
                </div>,

                // Is Allowed
                <div key={`${item._id}_allowed`} className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_allowed ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
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
            title="Industries"
            isBtn={true}
            btnTitle="Add Industry"
            btnOnClick={toggleCreateModal}
        >
            <Table
                title="All Industries"
                headers={TABLE_HEADERS}
                rows={rows}
                classContainer="rounded-2xl px-8"
                isActions={false}
                isFilter={true}
                customActions={(index) => {
                    const industry = industriesData[index];
                    return (
                        <IndustryActions
                            i18n={i18n}
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
            />
            <ApprovalAlert
                isOpen={deleteConfirm.isOpen}
                title="Delete Industry"
                message={`Are you sure you want to delete "${deleteConfirm.item?.name}"? This action cannot be undone.`}
                type="danger"
                onConfirm={onConfirmDelete}
                onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
                confirmBtnText="Yes, Delete"
            />
        </Page>
    );
}

export default IndustriesPage;
