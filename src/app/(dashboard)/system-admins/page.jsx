"use client"

import Table from "@/components/Tables/Table";
import { statusCell } from "@/components/StatusCell";
import Page from "@/components/Page";
import { useTranslation } from "react-i18next";
import { RiCloseCircleLine, RiEditLine, RiEyeLine } from "@remixicon/react";
import { useState } from "react";
import StatusActions from "@/components/Dropdowns/StatusActions";
import CreateAdminModal from "./_components/modals/CreateAdmin.modal";
import Alert from "@/components/Alerts/Alert";

function SystemAdminsPage() {
    const [isSuccessCreated,setIsSuccessCreated]=useState(false)
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
    const adminsData = [
        { _id: "1", name: "Fatma Ahmed Mohamed", email: "Fatma@company.com", rules: ["Manager", "Admin"], status: "Active" },
        { _id: "1", name: "Fatma Ahmed Mohamed", email: "Fatma@company.com", rules: ["Manager", "Admin"], status: "Active" },
        { _id: "1", name: "Fatma Ahmed Mohamed", email: "Fatma@company.com", rules: ["Manager", "Admin"], status: "Active" },
        { _id: "1", name: "Fatma Ahmed Mohamed", email: "Fatma@company.com", rules: ["Manager", "Admin"], status: "Active" },
        { _id: "1", name: "Fatma Ahmed Mohamed", email: "Fatma@company.com", rules: ["Manager", "Admin"], status: "Active" },
        { _id: "1", name: "Fatma Ahmed Mohamed", email: "Fatma@company.com", rules: ["Manager", "Admin"], status: "Active" },
        { _id: "1", name: "Fatma Ahmed Mohamed", email: "Fatma@company.com", rules: ["Manager", "Admin"], status: "Active" },
        { _id: "1", name: "Fatma Ahmed Mohamed", email: "Fatma@company.com", rules: ["Manager", "Admin"], status: "Active" },
    ]

    const headers = [
        { label: "Name", width: "200px" },
        { label: "Email", width: "150px" },
        { label: "Rule", width: "150px" },
        { label: "Status", width: "80px" },
        { label: "", width: "50px" }
    ];
    const rows = adminsData.map(adminUser => [
        // Plan Cell
        <div key={`${adminUser._id}_admin`} className="flex items-center justify-start gap-2">
            <div className={"p-1 rounded-full bg-white"}>
                <div className="w-10 h-10">
                    <img className={"max-w-full h-full rounded-full "} src={"https://www.svgrepo.com/show/404545/avatar-man-profile-user-3.svg"} alt={"img"} />
                </div>
            </div>
            <span className="text-md text-gray-900 dark:text-gray-50">
                {adminUser.name}
            </span>
        </div>,

        // Price cell
        <div key={`${adminUser._id}_email`}>{adminUser.email}</div>,

        // Created at cell
        <div key={`${adminUser._id}_rules`} className={"flex justify-start items-center gap-1 flex-wrap"}>
            {adminUser?.rules?.map((element, index) => (
                <span key={index} className={"py-1 px-2 rounded-lg bg-blue-100 text-blue-500 "}>{element}</span>
            ))}</div>,

        // Status cell
        statusCell(adminUser.status, adminUser._id)
    ]);

    const handelCreateAdminModalOpen = () => {
        setIsCreateAdminModalOpen(!isCreateAdminModalOpen);
    }
    const handelSuccessCreated = ()=>{
        setIsSuccessCreated(!isSuccessCreated)
    }

    const AdminUserActions = ({ actualRowIndex, handelDeactivateAction }) => {
        const { t, i18n } = useTranslation();
        const statesActions = [
            {
                text: "View", icon: <RiEyeLine className="text-primary-400" />, onClick: () => {
                    console.log(actualRowIndex)
                }
            },
            {
                text: "Edit", icon: <RiEditLine className="text-primary-400" />, onClick: () => {
                    console.log(actualRowIndex)
                },
            },
            {
                text: "Deactivate", icon: <RiCloseCircleLine className="text-red-500" />, onClick: () => {
                    console.log(actualRowIndex)
                    handelDeactivateAction()
                },
            },
        ]
        return (
            <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
                }`} />
        );
    }

    return (
        <Page title="Admins" isBtn={true} btnTitle="Add User" btnOnClick={handelCreateAdminModalOpen}>
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

            <CreateAdminModal isOpen={isCreateAdminModalOpen} onClose={handelCreateAdminModalOpen} onClick={handelSuccessCreated} />
            <Alert type={"success"} title={"User created successfully!"} message={"User has been added"} isOpen={isSuccessCreated} onClose={handelSuccessCreated} />
        </Page>
    );
}

export default SystemAdminsPage;