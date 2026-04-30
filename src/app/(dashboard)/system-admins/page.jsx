"use client"

import Table from "@/components/Tables/Table";
import { statusCell } from "@/components/StatusCell";
import Page from "@/components/Page";
import { useTranslation } from "react-i18next";
import { RiCloseCircleLine, RiEditLine, RiEyeLine } from "@remixicon/react";
import { useState } from "react";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { useGetAdminsQuery } from "@/redux/system-admins/systemAdminsAPI";
import CreateAdminModal from "./_components/modals/CreateAdmin.modal";
import AssignRoleModal from "./_components/modals/AssignRole.modal";
import Alert from "@/components/Alerts/Alert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useUnassignRoleMutation } from "@/redux/roles/adminRolesAPI";
import { RiAddCircleLine, RiCloseLine, RiNotification4Line } from "@remixicon/react";
import SendAdminNotificationModal from "@/components/Modal/SendAdminNotificationModal";

function SystemAdminsPage() {
    const { data: adminsResponse, isLoading } = useGetAdminsQuery();
    const adminsData = adminsResponse?.data || [];

    const [isSuccessCreated, setIsSuccessCreated] = useState(false)
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
    const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [isResponseOpen, setIsResponseOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({ status: "", message: "" });
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
    const [notifyTarget, setNotifyTarget] = useState(null);
    const [unassignRole] = useUnassignRoleMutation();

    const headers = [
        { label: "Name", width: "200px" },
        { label: "Email", width: "150px" },
        { label: "Roles", width: "150px" },
        { label: "Status", width: "80px" },
        { label: "", width: "50px" }
    ];
    const rows = adminsData.map(adminUser => [
        // Plan Cell
        <div key={`${adminUser._id}_admin`} className="flex items-center justify-start gap-2">
            <div className={"p-1 rounded-full bg-status-bg border border-status-border"}>
                <div className="w-10 h-10">
                    <img className={"max-w-full h-full rounded-full "} src={adminUser.avatar || "https://www.svgrepo.com/show/404545/avatar-man-profile-user-3.svg"} alt={"img"} />
                </div>
            </div>
            <span className="text-md text-cell-primary">
                {adminUser.name}
            </span>
        </div>,

        // Price cell
        <div key={`${adminUser._id}_email`} className="text-cell-secondary">{adminUser.email}</div>,

        // Created at cell
        <div key={`${adminUser._id}_rules`} className={"flex justify-start items-center gap-1 flex-wrap"}>
            {adminUser?.admin_system_roles?.map((element, index) => (
                <span key={index} className={"py-1 px-2 rounded-lg bg-badge-bg text-badge-text flex items-center gap-1"}>
                    {element?.name}
                    <button
                        onClick={() => handleUnassignClick(adminUser, element)}
                        className="hover:text-red-500 transition-colors"
                    >
                        <RiCloseLine size={14} />
                    </button>
                </span>
            ))}</div>,

        // Status cell
        <div key={`${adminUser._id}_status`}>
            {adminUser?.is_active ? (
                <span className="py-1 px-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium border border-green-200 dark:border-green-800">Active</span>
            ) : (
                <span className="py-1 px-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-800">Inactive</span>
            )}
        </div>,
    ]);


    const handelCreateAdminModalOpen = () => {
        setIsCreateAdminModalOpen(!isCreateAdminModalOpen);
    }
    const handelSuccessCreated = () => {
        setIsSuccessCreated(!isSuccessCreated)
    }

    const handleUnassignClick = (admin, role) => {
        setSelectedAdmin(admin);
        setSelectedRole(role);
        setIsApprovalOpen(true);
    }

    const confirmUnassign = async () => {
        if (!selectedAdmin || !selectedRole) return;
        try {
            const result = await unassignRole({
                admin_id: selectedAdmin._id,
                role_id: selectedRole._id
            }).unwrap();
            setApiResponse({ status: "success", message: result.message || t("Role unassigned successfully") });
        } catch (err) {
            setApiResponse({ status: "error", message: err.data?.message || t("Failed to unassign role") });
        } finally {
            setIsResponseOpen(true);
            setSelectedAdmin(null);
            setSelectedRole(null);
        }
    }

    const handleShowResult = (response) => {
        setApiResponse(response);
        setIsResponseOpen(true);
    }

    const AdminUserActions = ({ actualRowIndex, handelDeactivateAction }) => {
        const { t, i18n } = useTranslation();
        const statesActions = [
            {
                text: "Assign Role", icon: <RiAddCircleLine className="text-primary-400" />, onClick: () => {
                    setSelectedAdmin(adminsData[actualRowIndex]);
                    setIsAssignRoleModalOpen(true);
                },
            },
            {
                text: t("Send Notification"), icon: <RiNotification4Line className="text-primary-400" />, onClick: () => {
                    setNotifyTarget(adminsData[actualRowIndex]);
                    setIsNotifyModalOpen(true);
                },
            },
            // {
            //     text: "View", icon: <RiEyeLine className="text-primary-400" />, onClick: () => {
            //         console.log(actualRowIndex)
            //     }
            // },
            // {
            //     text: "Edit", icon: <RiEditLine className="text-primary-400" />, onClick: () => {
            //         console.log(actualRowIndex)
            //     },
            // },
            // {
            //     text: "Deactivate", icon: <RiCloseCircleLine className="text-red-500" />, onClick: () => {
            //         console.log(actualRowIndex)
            //         handelDeactivateAction()
            //     },
            // },
        ]
        return (
            <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
                }`} />
        );
    }

    return (
        <Page title="Admins" isBtn={true} btnTitle="Add User" btnOnClick={handelCreateAdminModalOpen}>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <Table
                    classContainer={"rounded-2xl px-8"}
                    title="All System Admins"
                    headers={headers}
                    isActions={false}
                    handelDelete={() => { }}
                    rows={rows}
                    isFilter={true}
                    customActions={(actualRowIndex) => (
                        <AdminUserActions handelDeleteAction={() => { }}
                            actualRowIndex={actualRowIndex} />)
                    }
                />
            )}

            <CreateAdminModal isOpen={isCreateAdminModalOpen} onClose={handelCreateAdminModalOpen} onShowSuccess={handelSuccessCreated} />
            <AssignRoleModal
                isOpen={isAssignRoleModalOpen}
                onClose={() => setIsAssignRoleModalOpen(false)}
                admin={selectedAdmin}
                onShowResult={handleShowResult}
            />
            <Alert type={"success"} title={"User created successfully!"} message={"User has been added"} isOpen={isSuccessCreated} onClose={handelSuccessCreated} />

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={confirmUnassign}
                title="Unassign Role"
                message={`Are you sure you want to unassign the role "${selectedRole?.name}" from ${selectedAdmin?.name}?`}
                confirmBtnText="Unassign"
                type="danger"
            />

            <ApiResponseAlert
                isOpen={isResponseOpen}
                onClose={() => setIsResponseOpen(false)}
                status={apiResponse.status}
                message={apiResponse.message}
            />

            <SendAdminNotificationModal
                isOpen={isNotifyModalOpen}
                onClose={() => { setIsNotifyModalOpen(false); setNotifyTarget(null); }}
                preSelectedUser={notifyTarget}
                sourceType="admin"
            />
        </Page>
    );
}

export default SystemAdminsPage;