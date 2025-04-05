"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table.jsx";
import EditDepartmentModal from "@/app/dashboard/hr/_modals/EditDepartmentModal.jsx";
import Alert from "@/components/Alert.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  deleteDepartment,
} from "@/redux/departments/departmentAPI";
import * as Yup from "yup";

function DepartmentsTab() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { departments, loading, error } = useSelector(
    (state) => state.departments
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDeleteDepartment, setSelectedDeleteDepartment] =
    useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [isEditSuccessAlertOpen, setIsEditSuccessAlertOpen] = useState(false);

  const headers = [
    { label: t("Name"), width: "200px" },
    { label: t("Manager"), width: "100px" },
    { label: t("No. of Active Tasks / Projects"), width: "200px" },
    { label: t("No. of Employees"), width: "150px" },
    { label: t("Score"), width: "200px" },
    { label: "", width: "50px" },
  ];

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const DepartmentRowTable = () => {
    return departments?.map((dept, index) => [
      dept.name,
      dept.manager?.name || t("Not assigned"),
      dept.employeeCount || 0,
      dept.description || t("No description"),
      dept.score || 0,
    ]);
  };

  const handleEditSuccess = () => {
    setIsEditSuccessAlertOpen(true);
    dispatch(fetchDepartments());
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 h-full">
          <Table
            title={"All Departments"}
            headers={headers}
            handelDelete={(index) => {
              setSelectedDeleteDepartment(departments[index]);
              setIsDeleteAlertOpen(true);
            }}
            handelEdit={(index) => {
              setSelectedDepartment(departments[index]);
              setIsEditModalOpen(true);
            }}
            isActions={true}
            rows={DepartmentRowTable()}
            isFilter={true}
          />
        </div>
      </div>

      <EditDepartmentModal
        isOpen={isEditModalOpen}
        department={selectedDepartment}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Alerts */}
      <Alert
        type="warning"
        title={t("Delete Department?")}
        message={t("Are you sure you want to delete this department?")}
        onSubmit={(confirmed) => {
          if (confirmed && selectedDeleteDepartment) {
            dispatch(deleteDepartment(selectedDeleteDepartment._id))
              .then(() => setIsSuccessAlertOpen(true))
              .catch(console.error);
          }
          setIsDeleteAlertOpen(false);
        }}
        titleCancelBtn={t("Cancel")}
        titleSubmitBtn={t("Delete")}
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        isBtns={true}
      />

      <Alert
        type="success"
        title={t("Department Deleted")}
        message={t("The department has been successfully deleted.")}
        isOpen={isSuccessAlertOpen}
        onClose={() => setIsSuccessAlertOpen(false)}
      />

      {/* Edit Success Alert */}

      <Alert
        type="success"
        title={t("Department Updated")}
        message={t("The department has been successfully updated.")}
        isOpen={isEditSuccessAlertOpen}
        onClose={() => setIsEditSuccessAlertOpen(false)}
      />
    </>
  );
}

export default DepartmentsTab;
