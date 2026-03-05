"use client";
import { t } from "i18next";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { RiCheckboxCircleFill, RiCloseCircleFill, RiQuestionLine } from "@remixicon/react";
import AddPermissionModal from "./_components/AddPermissionModal";
import { useState } from "react";


import { useGetPermissionsQuery } from "@/redux/permissions/subscriberPermissionsApi";
import dayjs from "dayjs";

function PermissionsPage() {
    const { data: permissionsData, isLoading, error } = useGetPermissionsQuery();

    const headers = [
        { label: t("Name"), width: "200px" },
        { label: t("Action"), width: "100px" },
        { label: t("Model Type"), width: "150px" },
        { label: t("Created At"), width: "200px" },
        { label: t("Updated At"), width: "200px" },
    ];

    const rows = (permissionsData || []).map(permission => [
        <div key="name" className="flex items-center justify-start gap-2">
            <span className="text-lg text-cell-primary font-medium">
                {permission.name}
            </span>
        </div>,
        <div key="action" className="flex items-center justify-start">
            <span className="px-2 py-1 bg-badge-bg text-badge-text rounded-md text-sm border border-status-border">
                {permission.action}
            </span>
        </div>,
        <div key="model_type" className="flex items-center justify-start">
            <span className="px-2 py-1 bg-status-bg text-cell-secondary rounded-md text-sm border border-status-border">
                {permission.model_type}
            </span>
        </div>,
        <div key="createdAt" className="flex items-center justify-start text-cell-secondary">
            {dayjs(permission.createdAt).format("YYYY-MM-DD HH:mm")}
        </div>,
        <div key="updatedAt" className="flex items-center justify-start text-cell-secondary">
            {dayjs(permission.updatedAt).format("YYYY-MM-DD HH:mm")}
        </div>
    ]);

    const [addPermissionModalOpen, setBillingInfoModalOpen] = useState(false);

    const toggleAddPermissionsModal = () => {
        setBillingInfoModalOpen(!addPermissionModalOpen);
    }

    if (isLoading) {
        return (
            <Page title={"Permissions"}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-primary-500 animate-pulse font-medium">{t("Loading permissions...")}</div>
                </div>
            </Page>
        );
    }

    if (error) {
        return (
            <Page title={"Permissions"}>
                <div className="flex items-center justify-center h-64 text-red-500 font-medium">
                    {t("Error loading permissions. Please try again later.")}
                </div>
            </Page>
        );
    }

    return (
        <Page title={"Permissions"} >
            <div className={"flex flex-col gap-6"}>
                <div className="flex flex-col gap-2 h-full">
                    <Table className="custom-class" title={"All Permissions"}
                        headers={headers} isActions={false} rows={rows}
                        isFilter={true} />
                </div>
                <div className={"flex md:w-[37.5%] w-screen"}>
                    {/* <TimeLine /> */}
                </div>
            </div>

            <AddPermissionModal isOpen={addPermissionModalOpen} onClose={toggleAddPermissionsModal} />
        </Page>
    );
}

export default PermissionsPage;