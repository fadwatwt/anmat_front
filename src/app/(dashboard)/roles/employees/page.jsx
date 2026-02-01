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
import { useGetSubscriberRolesQuery, useDeleteSubscriberRoleMutation } from "@/redux/roles/subscriberRolesApi";
import AddSubscriberRoleModal from "../../permissions/_components/AddSubscriberRoleModal";
import SyncSubscriberPermissionsModal from "../../permissions/_components/SyncSubscriberPermissionsModal";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import Table from "@/components/Tables/Table";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { useTranslation } from "react-i18next";
import { RiDeleteBin7Line } from "react-icons/ri";

function PermissionsPage() {
    const { data: rolesData, isLoading, isError, error } = useGetSubscriberRolesQuery();
    const [deleteRole, { isLoading: isDeleting }] = useDeleteSubscriberRoleMutation();

    const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);
    const [syncPermissionsModalOpen, setSyncPermissionsModalOpen] = useState(false);
    const [isDeleteRoleAlert, setIsDeleteRoleAlert] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    const headers = [
        { label: t("Role Name"), width: "200px" },
        { label: t("Permissions"), width: "400px" },
        { label: "", width: "50px" },
    ];

    const rows = (rolesData || []).map(role => [
        <div key="name" className="flex items-center justify-start gap-2">
            <span className=" text-md text-gray-900 font-medium">
                {role.name}
            </span>
        </div>,
        <div key="permissions" className="flex items-center justify-start gap-2 px-4">
            <div className={"grid grid-cols-3 gap-2 w-full"}>
                {
                    role.permissions_ids?.map((permission, index) => (
                        <span
                            key={index}
                            className="bg-primary-100 text-primary-500 text-xs text-center px-3 py-1 rounded-2xl truncate"
                            title={permission.name}
                        >
                            {permission.name}
                        </span>
                    ))
                }
            </div>
        </div>,
    ]);

    const SubscriptionActions = ({ actualRowIndex }) => {
        const { t, i18n } = useTranslation();
        const role = rolesData[actualRowIndex];

        const statesActions = [
            {
                text: "Sync Permissions", icon: <RiEditLine className="text-primary-400" />, onClick: () => {
                    setSelectedRole(role);
                    setSyncPermissionsModalOpen(true);
                },
            },
            {
                text: "Delete", icon: <RiDeleteBin7Line className="text-red-500" />, onClick: () => {
                    setSelectedRole(role);
                    setIsDeleteRoleAlert(true);
                },
            }
        ]
        return (
            <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
                }`} />
        );
    }

    const toggleAddRoleModal = () => {
        setAddRoleModalOpen(!addRoleModalOpen);
    }

    const handleConfirmDelete = async () => {
        if (!selectedRole?._id) return;
        try {
            const response = await deleteRole(selectedRole._id).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || "Role deleted successfully!",
            });
        } catch (e) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: e?.data?.message || "Failed to delete role",
            });
        } finally {
            setIsDeleteRoleAlert(false);
        }
    };

    if (isLoading) {
        return (
            <Page title={"Roles"}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-primary-500 animate-pulse font-medium">{t("Loading roles...")}</div>
                </div>
            </Page>
        );
    }

    if (isError) {
        return (
            <Page title={"Roles"}>
                <div className="flex items-center justify-center h-64 text-red-500 font-medium">
                    {error?.data?.message || t("Error loading roles")}
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
            </div>

            <AddSubscriberRoleModal
                isOpen={addRoleModalOpen}
                onClose={toggleAddRoleModal}
            />

            <SyncSubscriberPermissionsModal
                isOpen={syncPermissionsModalOpen}
                onClose={() => setSyncPermissionsModalOpen(false)}
                roleId={selectedRole?._id}
                roleName={selectedRole?.name}
                currentPermissions={selectedRole?.permissions_ids || []}
            />

            <ApprovalAlert
                isOpen={isDeleteRoleAlert}
                onClose={() => setIsDeleteRoleAlert(false)}
                type="danger"
                title="Delete Role"
                confirmBtnText={isDeleting ? "Deleting..." : "Yes, Delete"}
                message={`Are you sure you want to delete the ${selectedRole?.name} role?`}
                onConfirm={handleConfirmDelete}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
            />
        </Page>
    );
}

export default PermissionsPage;
