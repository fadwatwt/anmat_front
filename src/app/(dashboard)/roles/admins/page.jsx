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
import Table from "@/components/Tables/Table";
import { useTranslation } from "react-i18next";
import { RiDeleteBin7Line } from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { statusCell } from "@/components/StatusCell";
import CheckAlert from "@/components/Alerts/CheckِِAlert";


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

    const rows = rolesData.map(role => [
        <div key="name" className="flex items-center justify-start gap-2">
            <span className=" text-md text-gray-900">
                {role.name}
            </span>
        </div>,
        <div key="permissions" className="flex items-center justify-start gap-2 px-4">
            <div className={"grid grid-cols-3 gap-2 w-full"}>
                {
                    role.permissions.map((permission, index) => [
                        <span key={index} className="bg-primary-100 text-primary-500 text-xs text-center px-3 py-1 rounded-2xl">
                            {permission}
                        </span>
                    ])
                }
            </div>

        </div>,

        // Status cell
        statusCell(role.status)
    ]);

    const SubscriptionActions = ({ actualRowIndex }) => {
        const { t, i18n } = useTranslation();
        const statesActions = [
            {
                text: "Edit", icon: <RiEditLine className="text-primary-400" />, onClick: () => {
                    console.log(actualRowIndex)
                },
            },
            {
                text: "View Permissions", icon: <RiEyeLine className="text-primary-400" />, onClick: () => {
                    console.log(actualRowIndex)
                }
            },
            {
                text: "Delete", icon: <RiDeleteBin7Line className="text-red-500" />, onClick: () => {
                    console.log(actualRowIndex)
                    handleDeleteRoleAert()
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

    const toggleAddRoleModal = () => {
        setBillingInfoModalOpen(!addRoleModalOpen);
    }

    const handleDeleteRoleAert = () => {
        setIsDeleteRoleAert(!isDeleteRoleAert);
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
            <CheckAlert
                isOpen={isDeleteRoleAert}
                onClose={handleDeleteRoleAert}
                type="cancel"
                title="Delete Role"
                confirmBtnText="Yes, Delete"
                description={
                    <p>
                        Are you sure you want to <span className="font-bold text-black">Delete Manager Role</span>?
                    </p>
                }
                onSubmit={() => { }}
            />
        </Page>
    );
}

export default PermissionsPage;