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
            <span className=" text-md text-gray-900">
                {role.name}
            </span>
        </div>,
        <div key="permissions" className="flex items-center justify-start gap-2 px-4">
            <div className={"grid grid-cols-3 gap-2 w-full"}>
                {role.permissions.map((permission, index) => (
                    <span
                        key={index}
                        title={permission?.name}
                        className="bg-primary-100 text-primary-500 text-xs text-center px-3 py-1 rounded-2xl max-w-[140px] truncate"
                    >
                        {permission?.name}
                    </span>
                ))}
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
                <div className={"flex md:w-[37.5%] w-screen"}>
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
                        <span className="font-bold text-black">
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