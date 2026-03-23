"use client"
import { t } from "i18next";
import {
    RiCheckboxCircleFill,
    RiCheckboxCircleLine,
    RiCloseCircleFill, RiCloseCircleLine,
    RiEditLine, RiEyeLine,
    RiQuestionLine
} from "@remixicon/react";
import { useState } from "react";
import Page from "@/components/Page";
import AddRoleModal from "../../permissions/_components/AddRoleModal";
import SyncPermissionsModal from "../../permissions/_components/SyncPermissionsModal";
import Table from "@/components/Tables/Table";
import { useTranslation } from "react-i18next";
import { RiDeleteBin7Line } from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { statusCell } from "@/components/StatusCell";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useGetAdminRolesQuery, useDeleteAdminRoleMutation } from "@/redux/roles/adminRolesAPI";


function PermissionsPage() {
    const headers = [
        { label: t("Role Name"), width: "200px" },
        { label: t("Permissions"), width: "400px" },
        { label: "", width: "50px" },
    ];

    const { data, isLoading, isError, error } = useGetAdminRolesQuery();
    const [deleteAdminRole, { isLoading: isDeleting }] = useDeleteAdminRoleMutation();
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });
    const apiData = data?.data || [];

    const rolesData = apiData.map((role) => ({
        id: role._id,
        name: role.name,
        // Permissions come populated from API
        permissions: role.admin_permissions_ids || [],
        status: role.status || "Active",
    }));

    const rows = rolesData.map(role => [
        <div key="name" className="flex items-center justify-start gap-2">
            <span className="text-md text-cell-primary font-medium">
                {role.name}
            </span>
        </div>,
        <div key="permissions" className="group relative flex items-center justify-start gap-2 px-4 h-full">
            {/* Desktop/Tablet: Grid View with Hover Title */}
            <div className="hidden min-[1100px]:grid grid-cols-2 xl:grid-cols-3 gap-2 w-full max-w-[420px] whitespace-normal">
                {role.permissions.slice(0, 6).map((permission, index) => (
                    <span
                        key={index}
                        title={permission?.name}
                        className="bg-badge-bg text-badge-text text-[10px] xl:text-[11px] text-center px-2 py-1 rounded-2xl truncate border border-status-border hover:bg-primary-base/10 hover:border-primary-base/30 transition-all cursor-help block max-w-[120px]"
                    >
                        {permission?.name}
                    </span>
                ))}
                {role.permissions.length > 6 && (
                    <span className="text-[11px] text-primary-base font-bold flex items-center justify-center bg-badge-bg px-2 py-1 rounded-full border border-status-border">
                        +{role.permissions.length - 6}
                    </span>
                )}
            </div>

            {/* Mobile/Small Tablet: Compact List Trigger and Hover Panel */}
            <div className="min-[1100px]:hidden">
                <div className="text-xs text-primary-base bg-badge-bg hover:bg-primary-base/10 px-3 py-1.5 rounded-lg border border-status-border cursor-pointer flex items-center gap-2 transition-all">
                    <RiEyeLine size={14} className="flex-shrink-0 text-primary-base" />
                    <span className="whitespace-nowrap font-medium">{role.permissions.length} {t("Permissions")}</span>
                </div>
            </div>

            {/* Premium Hover List Design (appears for both on trigger hover) */}
            <div className="invisible group-hover:visible absolute top-1/2 left-0 -translate-y-1/2 ml-full lg:ml-0 lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:mt-2 z-[60] w-64 p-4 bg-surface rounded-2xl shadow-2xl border border-status-border scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 origin-left lg:origin-top pointer-events-none group-hover:pointer-events-auto">
                <div className="flex items-center justify-between border-b border-status-border pb-2 mb-3">
                    <h4 className="text-[11px] font-bold text-cell-primary uppercase tracking-wider">{t("Full Permissions List")}</h4>
                    <span className="text-[10px] bg-badge-bg px-2 py-0.5 rounded-full text-badge-text font-bold">{role.permissions.length}</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scroll pr-2 flex flex-col gap-2 bg-transparent">
                    {role.permissions.map((p, i) => (
                        <div key={i} className="flex items-start gap-2.5 group/item py-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-base mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform shadow-[0_0_8px_rgba(55,93,251,0.4)]"></div>
                            <span className="text-xs text-cell-secondary group-hover/item:text-cell-primary transition-colors leading-relaxed">
                                {p.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ]);

    const SubscriptionActions = ({ actualRowIndex }) => {
        const { t, i18n } = useTranslation();
        const statesActions = [
            {
                text: "Sync Permissions", icon: <RiEditLine className="text-primary-400" />, onClick: () => {
                    openSyncPermissionsModal(actualRowIndex);
                },
            },
            // {
            //     text: "View Permissions", icon: <RiEyeLine className="text-primary-400" />, onClick: () => {
            //         console.log(actualRowIndex)
            //     }
            // },
            {
                text: "Delete", icon: <RiDeleteBin7Line className="text-red-500" />, onClick: () => {
                    openDeleteRoleAlert(actualRowIndex);
                },
            }
        ]
        return (
            <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
                }`} />
        );
    }

    const [addRoleModalOpen, setBillingInfoModalOpen] = useState(false);
    const [isDeleteRoleAert, setIsDeleteRoleAert] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [syncPermissionsModalOpen, setSyncPermissionsModalOpen] = useState(false);
    const [roleToSync, setRoleToSync] = useState(null);

    const toggleAddRoleModal = () => {
        setBillingInfoModalOpen(!addRoleModalOpen);
    };

    const openDeleteRoleAlert = (rowIndex) => {
        const selectedRole = rolesData[rowIndex];
        if (!selectedRole) return;
        setRoleToDelete(selectedRole);
        setIsDeleteRoleAert(true);
    };

    const closeDeleteRoleAlert = () => {
        setIsDeleteRoleAert(false);
        setRoleToDelete(null);
    };

    const openSyncPermissionsModal = (rowIndex) => {
        const selectedRole = rolesData[rowIndex];
        if (!selectedRole) return;
        setRoleToSync(selectedRole);
        setSyncPermissionsModalOpen(true);
    };

    const closeSyncPermissionsModal = () => {
        setSyncPermissionsModalOpen(false);
        setRoleToSync(null);
    };

    const handleConfirmDelete = async () => {
        if (!roleToDelete?.id) return;
        try {
            const response = await deleteAdminRole(roleToDelete.id).unwrap();
            const status = response?.status || "success";
            setApiResponse({
                isOpen: true,
                status,
                message: response?.message || "Role deleted successfully!",
            });
        } catch (e) {
            console.error("Failed to delete role", e);
            const errorMessage =
                e?.data?.message ||
                e?.data?.error ||
                e?.error ||
                "Failed to delete role. Please try again.";
            setApiResponse({
                isOpen: true,
                status: "error",
                message: errorMessage,
            });
        } finally {
            closeDeleteRoleAlert();
        }
    };

    const handleApiResponseClose = () => {
        setApiResponse({ isOpen: false, status: null, message: "" });
    };

    if (isLoading) {
        return (
            <Page title={"Roles"}>
                <div className="flex items-center justify-center h-full">
                    <span className="text-gray-500 text-sm">{t("Loading roles...")}</span>
                </div>
            </Page>
        );
    }

    if (isError) {
        const message =
            error?.data?.message ||
            error?.error ||
            t("Failed to load roles");

        return (
            <Page title={"Roles"}>
                <div className="flex items-center justify-center h-full">
                    <span className="text-red-500 text-sm">{message}</span>
                </div>
            </Page>
        );
    }

    return (
        <Page title={"Roles"} isBtn={true} btnTitle={"Add Role"} btnOnClick={toggleAddRoleModal} >
            <div className={"flex flex-col gap-6"}>
                <div className="flex flex-col gap-2 h-full">
                    <Table className="custom-class" title={"All Roles"}
                        headers={headers} isActions={false} rows={rows}
                        customActions={(actualRowIndex) => (
                            <SubscriptionActions actualRowIndex={actualRowIndex} />)
                        }
                        isFilter={true} />
                </div>
                <div className={"flex md:w-[37.5%] w-full"}>
                    {/* <TimeLine /> */}
                </div>
            </div>
            <AddRoleModal isOpen={addRoleModalOpen} onClose={toggleAddRoleModal} />
            <SyncPermissionsModal
                isOpen={syncPermissionsModalOpen}
                onClose={closeSyncPermissionsModal}
                roleId={roleToSync?.id}
                roleName={roleToSync?.name}
                currentPermissions={roleToSync?.permissions || []}
            />
            <CheckAlert
                isOpen={isDeleteRoleAert}
                onClose={closeDeleteRoleAlert}
                type="cancel"
                title="Delete Role"
                confirmBtnText={isDeleting ? "Deleting..." : "Yes, Delete"}
                description={
                    <p>
                        Are you sure you want to{" "}
                        <span className="font-bold text-table-title">
                            Delete {roleToDelete?.name} Role
                        </span>
                        ?
                    </p>
                }
                onSubmit={handleConfirmDelete}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleApiResponseClose}
            />
        </Page>
    );
}

export default PermissionsPage;