"use client";
import { t } from "i18next";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { RiCheckboxCircleFill, RiCloseCircleFill, RiQuestionLine } from "@remixicon/react";
import AddPermissionModal from "./_components/AddPermissionModal";
import { useState } from "react";


function PermissionsPage() {
    const headers = [
        { label: t("Permission Category"), width: "200px" },
        { label: t("View"), width: "50px" },
        { label: t("Add"), width: "50px" },
        { label: t("Edit"), width: "50px" },
        { label: t("Delete"), width: "50px" },
        { label: t("Status"), width: "100px" },
        { label: "", width: "50px" },
    ];

    const permissionsData = [
        {
            category: 'Projects',
            view: false,
            add: false,
            edit: false,
            delete: false,
            status: 'Active'
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

    const rows = permissionsData.map(permission => [
        <div key="category" className="flex items-center justify-start gap-2">
            <span className="text-lg text-gray-900">
                {permission.category}
            </span>
        </div>,

        <div key="view" className="flex items-center justify-start">
            <input type="checkbox" selected={permission.view} />
        </div>,

        <div key="add" className="flex items-center justify-start">
            <input type="checkbox" selected={permission.add} />
        </div>,

        <div key="edit" className="flex items-center justify-start">
            <input type="checkbox" selected={permission.edit} />
        </div>,

        <div key="delete" className="flex items-center justify-start">
            <input type="checkbox" selected={permission.delete} />
        </div>,

        // Status cell
        statusCell(permission.status)
    ]);

    const [addPermissionModalOpen, setBillingInfoModalOpen] = useState(false);

    const toggleAddPermissionsModal = () => {
        setBillingInfoModalOpen(!addPermissionModalOpen);
    }

    return (
        <Page title={"Permissions"} isBtn={true} btnTitle={"Add Permission"} btnOnClick={toggleAddPermissionsModal} >
            <div className={"flex flex-col gap-6"}>
                <div className="flex flex-col gap-2 h-full">
                    <Table className="custom-class" title={"All Manager Permissions"}
                        headers={headers} isActions={true} rows={rows}
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