"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
// استيراد المودالات خاصة بالأقسام
import CreateDepartmentModal from "@/app/(dashboard)/hr/departments/modals/CreateDepartment.modal";
import CreateChatGroupModal from "@/app/(dashboard)/hr/departments/modals/CreateChatGroup.modal";
import EditDepartmentModal from "@/app/(dashboard)/hr/departments/modals/EditDepartmentModal";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import { RiEditLine, RiGroupLine, RiNotification4Line, RiChat1Line, RiDeleteBin7Line } from "@remixicon/react";
import StatusActions from "@/components/Dropdowns/StatusActions";
import SendNotificationModal from "@/app/(dashboard)/hr/employees/modals/SendNotification.modal";
import Alert from "@/components/Alerts/Alert";
import Table from "@/components/Tables/Table"
import Page from "@/components/Page";
import Rating from "@/app/(dashboard)/hr/Rating.jsx";

import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";

function DepartmentsPage() {
    const { t } = useTranslation();
    const { data: departments = [], isLoading } = useGetDepartmentsQuery();

    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenCreateChatGroupModal, setIsOpenCreateChatGroupModal] = useState(false);
    const [isOpenSendNotifyModal, setIsOpenSendNotifyModal] = useState(false);

    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDeleteDepartment, setSelectedDeleteDepartment] = useState(null);
    const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
    const [isOpenSuccessDeleteAlert, setIsOpenSuccessDeleteAlert] = useState(false);

    const headers = [
        { label: t("Departments"), width: "20%" },
        { label: t("No. of Active Tasks / Projects"), width: "15%" },
        { label: t("No. of Employees"), width: "15%" },
        { label: t("Rating"), width: "15%" },
        { label: t("Positions"), width: "30%" },
        { label: "", width: "5%" },
    ];

    const DepartmentActions = ({ actualRowIndex }) => {
        const { t, i18n } = useTranslation();
        const department = departments[actualRowIndex];

        const statesActions = [
            {
                text: t("Edit"),
                icon: <RiEditLine size={20} className="text-primary-400" />,
                onClick: () => {
                    setSelectedDepartment(department);
                    setIsOpenEditModal(true);
                },
            },
            {
                text: t("Send Notification"),
                icon: <RiNotification4Line size={20} className="text-primary-400" />,
                onClick: () => {
                    setSelectedDepartment(department);
                    setIsOpenSendNotifyModal(true);
                }
            },
            {
                text: t("Create Team"),
                icon: <RiGroupLine size={20} className="text-primary-400" />,
                onClick: () => {
                    console.log("Create Team for:", department.name);
                }
            },
            {
                text: t("Create Chat Group"),
                icon: <RiChat1Line size={20} className="text-primary-400" />,
                onClick: () => {
                    setSelectedDepartment(department);
                    setIsOpenCreateChatGroupModal(true);
                }
            },
            {
                text: t("Delete"),
                icon: <RiDeleteBin7Line size={20} className="text-red-500" />,
                onClick: () => handleDeleteDepartment(department),
            }
        ]
        return (
            <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
                }`} />
        );
    }

    const DepartmentRowTable = (depts) => {
        return depts?.map((dept, index) => [
            <AccountDetails
                key={`dept-${dept._id}`}
                path={`/hr/departments/${dept._id}`}
                account={{
                    name: dept.name || t("Unknown Department"),
                    imageProfile: dept.icon || "/images/department/departmentBrand1.png",
                }}
            />,
            <div key={`stats-${dept._id}`} className="flex flex-col text-sm text-gray-500 py-2">
                <span className="font-medium text-gray-600">
                    {t("Projects")}: {dept.stats?.projects_count ?? 0}
                </span>
                <span className="text-gray-400">
                    {t("Tasks")}: {dept.stats?.tasks_count ?? 0}
                </span>
            </div>,
            <p key={`emp-count-${dept._id}`} className="text-sm font-medium text-gray-700">
                {dept.stats?.employees_count ?? 0}
            </p>,
            <div key={`rating-${dept._id}`} className="flex items-center">
                <Rating value={(dept.rate || 0) * 5} showPercentage={false} />
            </div>,
            <div key={`positions-${dept._id}`} className="flex flex-wrap gap-1">
                {dept.positions_ids?.map((pos) => (
                    <span
                        key={pos._id}
                        className="bg-blue-50 text-blue-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-blue-100"
                    >
                        {pos.title}
                    </span>
                ))}
                {(!dept.positions_ids || dept.positions_ids.length === 0) && (
                    <span className="text-gray-400 text-xs italic">{t("No Positions")}</span>
                )}
            </div>,
        ]);
    };

    const handleDeleteDepartment = (department) => {
        setSelectedDeleteDepartment(department);
        setIsOpenDeleteAlert(true);
    };

    const handleDeleteConfirmation = async (isConfirmed) => {
        setIsOpenDeleteAlert(false);
        if (isConfirmed && selectedDeleteDepartment) {
            // TODO: Implement delete API
            console.log("Deleting department:", selectedDeleteDepartment._id);
            setIsOpenSuccessDeleteAlert(true);
        }
    };

    return (
        <Page title={t("HR - Departments Management")}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 h-full">
                    <Table
                        title={t("Departments")}
                        headers={headers}
                        isActions={false}
                        customActions={(actualRowIndex) => (
                            <DepartmentActions actualRowIndex={actualRowIndex} />
                        )}
                        rows={DepartmentRowTable(departments)}
                        headerActions={
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpenSendNotifyModal(true)}
                                    className="bg-[#EEF2FF] text-[#375DFB] px-4 py-2 rounded-lg text-sm font-medium">
                                    {t("Send Notification")}
                                </button>
                                <button
                                    onClick={() => setIsOpenCreateModal(true)}
                                    className="bg-[#375DFB] text-white px-4 py-2 rounded-lg text-sm font-medium">
                                    {t("Create a Department")}
                                </button>
                            </div>
                        }
                    />
                </div>
            </div>

            <CreateDepartmentModal
                isOpen={isOpenCreateModal}
                onClose={() => setIsOpenCreateModal(false)}
            />

            <CreateChatGroupModal
                isOpen={isOpenCreateChatGroupModal}
                onClose={() => {
                    setIsOpenCreateChatGroupModal(false);
                    setSelectedDepartment(null);
                }}
                departmentData={selectedDepartment}
            />

            <SendNotificationModal
                isOpen={isOpenSendNotifyModal}
                onClose={() => {
                    setIsOpenSendNotifyModal(false);
                    setSelectedDepartment(null);
                }}
                departmentData={selectedDepartment}
            />

            <EditDepartmentModal
                isOpen={isOpenEditModal}
                onClose={() => {
                    setIsOpenEditModal(false);
                    setSelectedDepartment(null);
                }}
                department={selectedDepartment}
            />

            {/* تنبيه الحذف بالنوع المحدث delete */}
            <Alert
                type="delete"
                isOpen={isOpenDeleteAlert}
                onClose={() => setIsOpenDeleteAlert(false)}
                title="Delete Department"
                message={
                    <span>
                        Are you sure you want to <b>Delete {selectedDeleteDepartment?.name}</b>?
                    </span>
                }
                isBtns={true}
                titleSubmitBtn="Yes, Delete"
                titleCancelBtn="Cancel"
                onSubmit={handleDeleteConfirmation}
            />
            <Alert
                type="success"
                title="Department Deleted"
                isBtns={false}
                message={`The department "${selectedDeleteDepartment?.name}" has been successfully deleted.`}
                isOpen={isOpenSuccessDeleteAlert}
                onClose={() => setIsOpenSuccessDeleteAlert(false)}
            />
        </Page>
    );
}

export default DepartmentsPage;