import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "../../../components/Tables/Table.jsx";
import EditDepartmentModal from "../modals/EditDepartmentModal.jsx";
import Alert from "../../../components/Alert.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  deleteDepartment,
} from "../../../redux/departments/departmentAPI";

function DepartmentsTab() {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(
    (state) => state.departments
  );
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDeleteDepartment, setSelectedDeleteDepartment] =
    useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

  const headers = [
    { label: t("Name"), width: "200px" },
    { label: t("Manager"), width: "200px" },
    { label: t("Employees Count"), width: "150px" },
    { label: t("Description"), width: "300px" },
    { label: "", width: "50px" },
  ];

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const DepartmentRowTable = () => {
    return departments?.map((dept, index) => [
      <p key={`name-${index}`} className="text-sm dark:text-sub-300">
        {dept.name}
      </p>,
      <p key={`manager-${index}`} className="text-sm dark:text-sub-300">
        {dept.manager?.name || t("Not assigned")}
      </p>,
      <p key={`count-${index}`} className="text-sm dark:text-sub-300">
        {dept.employeeCount || 0}
      </p>,
      <p key={`desc-${index}`} className="text-sm dark:text-sub-300">
        {dept.description || t("No description")}
      </p>,
    ]);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  const handleDelete = (department) => {
    setSelectedDeleteDepartment(department);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirmation = (isConfirmed) => {
    if (isConfirmed && selectedDeleteDepartment) {
      dispatch(deleteDepartment(selectedDeleteDepartment._id))
        .then(() => setIsSuccessAlertOpen(true))
        .catch((error) => console.error("Delete failed:", error));
    }
    setIsDeleteAlertOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 h-full">
          <Table
            title={t("Departments")}
            headers={headers}
            handelDelete={(index) => handleDelete(departments[index])}
            handelEdit={(index) => handleEdit(departments[index])}
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
      />

      <Alert
        type="warning"
        title={t("Delete Department?")}
        message={t("Are you sure you want to delete this department?")}
        onSubmit={handleDeleteConfirmation}
        titleCancelBtn={t("Cancel")}
        titleSubmitBtn={t("Delete")}
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
      />

      <Alert
        type="success"
        title={t("Department Deleted")}
        message={t("The department has been successfully deleted.")}
        isOpen={isSuccessAlertOpen}
        onClose={() => setIsSuccessAlertOpen(false)}
      />
    </>
  );
}

export default DepartmentsTab;
