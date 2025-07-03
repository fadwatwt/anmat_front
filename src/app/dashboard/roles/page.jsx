"use client"
import { t } from "i18next";
import { RiCheckboxCircleFill, RiCloseCircleFill, RiQuestionLine } from "@remixicon/react";
import { useState } from "react";
import Page from "@/components/Page";
import AddRoleModal from "../permissions/components/AddRoleModal";
import Table from "@/components/Tables/Table";


function PermissionsPage() {
    const headers = [
        { label: t("Role Name"), width: "200px" },
        { label: t("Permissions"), width: "400px" },
        { label: t("Status"), width: "100px" },
        { label: "", width: "50px" },
    ];

    const rolesData = [
        {
            name: 'Manager',
            permissions: ['Add Employee', 'Edit Project', 'Edit Task', 'Delete Task'],
            status: 'Active'
        },
        {
            name: 'Manager',
            permissions: ['Add Employee', 'Edit Project', 'Edit Task', 'Delete Task'],
            status: 'Not-active'
        }
    ];

    const statusConfig = {
        Active: {
            bgColor: "bg-white",
            icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
            textColor: "text-green-700",
        },
        'Not-active': {
            bgColor: "bg-white",
            icon: <RiCloseCircleFill size={15} className="text-red-700" />,
            textColor: "text-red-700",
        }
    };

    const statusCell = (status) => {
        const config = statusConfig[status] || {
            bgColor: "bg-white",
            icon: <RiQuestionLine size={15} className="text-gray-700" />,
            textColor: "text-gray-700",
        };

        return (
            <div
                key={`status-${status}`}
                className={`flex items-center justify-center gap-1 ${config.bgColor} border px-1 py-1 rounded-md w-24`}
            >
                {config.icon}
                <span className={`text-xs ${config.textColor}`}>
                    {status}
                </span>
            </div>
        );
    };

    const rows = rolesData.map(role => [
        <div key="name" className="flex items-center justify-start gap-2">
            <span className="text-lg text-gray-900">
                {role.name}
            </span>
        </div>,

        <div key="permissions" className="flex items-center justify-start gap-2">
            {
                role.permissions.map(permission => [
                    <span className="bg-primary-100 text-primary-500 px-3 py-1 rounded-2xl">
                        {permission}
                    </span>
                ])
            }
        </div>,

        // Status cell
        statusCell(role.status)
    ]);

    const [addRoleModalOpen, setBillingInfoModalOpen] = useState(false);

    const toggleAddRoleModal = () => {
        setBillingInfoModalOpen(!addRoleModalOpen);
    }

    return (
        <Page title={"Roles"} isBtn={true} btnTitle={"Add Role"} btnOnClick={toggleAddRoleModal} >
            <div className={"flex flex-col gap-6"}>
                <div className="flex flex-col gap-2 h-full">
                    <Table className="custom-class" title={"All Roles"}
                        headers={headers} isActions={true} rows={rows}
                        isFilter={true} />
                </div>
                <div className={"flex md:w-[37.5%] w-screen"}>
                    {/* <TimeLine /> */}
                </div>
            </div>
            <AddRoleModal isOpen={addRoleModalOpen} onClose={toggleAddRoleModal} />
        </Page>
    );
}

export default PermissionsPage;