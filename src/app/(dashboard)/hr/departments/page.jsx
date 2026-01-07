"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
// استيراد المودالات الخاصة بالأقسام
import CreateDepartmentModal from "@/app/(dashboard)/hr/departments/modals/CreateDepartment.modal";
import CreateChatGroupModal from "@/app/(dashboard)/hr/departments/modals/CreateChatGroup.modal";
import EditAnEmployeeModal from "@/app/(dashboard)/hr/_modals/EditAnEmployeeModal.jsx"; // تأكد من استبداله لاحقاً بمودال تعديل قسم
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import { RiEditLine, RiGroupLine, RiNotification4Line, RiChat1Line, RiDeleteBin7Line } from "@remixicon/react";
import StatusActions from "@/components/Dropdowns/StatusActions";
import SendNotificationModal from "@/app/(dashboard)/hr/employees/modals/SendNotification.modal";
import Alert from "@/components/Alerts/Alert";
import Table from "@/components/Tables/Table"
import Page from "@/components/Page";
import { departmentsFactory } from "@/functions/FactoryData";

function DepartmentsPage() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenCreateChatGroupModal, setIsOpenCreateChatGroupModal] = useState(false);
    const [isOpenSendNotifyModal, setIsOpenSendNotifyModal] = useState(false);

    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDeleteDepartment, setSelectedDeleteDepartment] = useState(null);
    const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
    const [isOpenSuccessDeleteAlert, setIsOpenSuccessDeleteAlert] = useState(false);

    const headers = [
        { label: t("Departments"), width: "250px" },
        { label: t("No. of Active Tasks / Projects"), width: "200px" },
        { label: t("No. of Employees"), width: "150px" },
        { label: "", width: "50px" },
    ];

    const DepartmentActions = ({ actualRowIndex }) => {
        const { t, i18n } = useTranslation();
        const department = departmentsFactory[actualRowIndex];

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

    const DepartmentRowTable = (departments) => {
        return departments?.map((dept, index) => [
            <AccountDetails
                key={`dept-${index}`}
                path={`/hr/departments/${dept.id}`}
                account={{
                    name: dept.name || t("Unknown Department"),
                    imageProfile: dept.icon || "/images/department/departmentBrand1.png",
                }}
            />,
            <div key={`stats-${index}`} className="flex flex-col text-sm text-gray-500 py-2">
                <span className="font-medium text-gray-600">
                    {t("Projects")}: {dept.stats?.projects_count ?? 0}
                </span>
                <span className="text-gray-400">
                    {t("Tasks")}: {dept.stats?.tasks_count ?? 0}
                </span>
            </div>,
            <p key={`emp-count-${index}`} className="text-sm font-medium text-gray-700">
                {dept.stats?.employees_count ?? 0}
            </p>,
        ]);
    };

    const handleDeleteDepartment = (department) => {
        setSelectedDeleteDepartment(department);
        setIsOpenDeleteAlert(true);
    };

    const handleDeleteConfirmation = async (isConfirmed) => {
        setIsOpenDeleteAlert(false);
        if (isConfirmed && selectedDeleteDepartment) {
            // هنا تضع dispatch الخاص بحذف القسم لاحقاً
            console.log("Deleting department:", selectedDeleteDepartment.id);
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
                        rows={DepartmentRowTable(departmentsFactory)}
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

            <EditAnEmployeeModal
                isOpen={isOpenEditModal}
                onClose={() => {
                    setIsOpenEditModal(false);
                    setSelectedDepartment(null);
                }}
                data={selectedDepartment}
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