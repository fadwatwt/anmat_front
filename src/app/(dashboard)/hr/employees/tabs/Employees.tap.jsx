import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Table from "../../../../../components/Tables/Table.jsx";
import EditAnEmployeeModal from "@/app/(dashboard)/hr/_modals/EditAnEmployeeModal.jsx";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import Rating from "../../Rating.jsx";
import Alert from "../../../../../components/Alerts/Alert.jsx";
import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
} from "@/redux/employees/employeesApi";
import { RiEditLine, RiNotification4Line } from "@remixicon/react";
import StatusActions from "@/components/Dropdowns/StatusActions";
import CreateEmployeeModal from "@/app/(dashboard)/hr/employees/modals/CreateEmployee.modal";
import InviteNewEmployeeModal from "@/app/(dashboard)/hr/employees/modals/InviteNewEmployee,modal";
import SendNotificationModal from "@/app/(dashboard)/hr/employees/modals/SendNotification.modal";
import { RiDeleteBin7Line } from "react-icons/ri";

function EmployeesTap() {
  const { t } = useTranslation();
  const { data: employees = [], error, isLoading } = useGetEmployeesQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenInviteModal, setIsOpenInviteModal] = useState(false);
  const [isOpenSendNotifyModal, setIsOpenSendNotifyModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDeleteEmployee, setSelectedDeleteEmployee] = useState(null);
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [isOpenSuccessDeleteAlert, setIsOpenSuccessDeleteAlert] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const headers = [
    { label: t("Employees"), width: "200px" },
    { label: t("Contact"), width: "200px" },
    { label: t("Department"), width: "150px" },
    { label: t("Salary"), width: "100px" },
    { label: t("Status"), width: "100px" },
    { label: "", width: "50px" },
  ];

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter((employee) =>
      (employee.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const EmployeeActions = ({ actualRowIndex }) => {
    const { t, i18n } = useTranslation();
    const employee = filteredEmployees[actualRowIndex];

    const statesActions = [
      {
        text: t("Edit"),
        icon: <RiEditLine className="text-primary-400" />,
        onClick: () => {
          setSelectedEmployee(employee);
          setIsOpenEditModal(true);
        },
      },
      {
        text: t("Send Notification"),
        icon: <RiNotification4Line className="text-primary-400" />,
        onClick: () => {
          setSelectedEmployee(employee);
          setIsOpenSendNotifyModal(true);
        }
      },
      {
        text: t("Delete"),
        icon: <RiDeleteBin7Line className="text-red-500" />,
        onClick: () => handleDeleteEmployee(employee),
      }
    ]
    return (
      <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
        }`} />
    );
  }

  const EmployeeRowTable = (employeesToShow) => {
    return employeesToShow?.map((employee, index) => {
      const userData = employee.user || {};
      return [
        <AccountDetails
          key={`account-details-${index}`}
          path={`/employee-profile/${employee._id}-${encodeURIComponent(userData.name || "")}`}
          account={{
            name: userData.name || t("Unknown"),
            rule: employee.position_id?.title || (userData.is_active ? t("Active") : t("Inactive")),
            imageProfile: "https://ui-avatars.com/api/?name=" + (userData.name || "User") + "&background=random",
          }}
        />,
        <div key={`contact-${index}`} className="flex flex-col gap-1">
          <p className="text-sm font-medium dark:text-gray-200">{userData.email || "N/A"}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{userData.phone || "N/A"}</p>
        </div>,
        <div key={`department-${index}`} className="flex flex-col">
          <p className="text-sm dark:text-sub-300 font-semibold">{employee.department_id?.name || t("N/A")}</p>
          <p className="text-xs text-gray-400 capitalize">{employee.country}, {employee.city}</p>
        </div>,
        <div key={`salary-${index}`} className="flex flex-col">
          <p className="text-sm font-bold text-primary-base dark:text-primary-300 ">${employee.salary?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">{employee.work_hours} {t("hrs/day")}</p>
        </div>,
        <div key={`status-${index}`}>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${userData.is_active
              ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}>
            {userData.is_active ? t("Active") : t("Inactive")}
          </span>
        </div>,
      ];
    });
  };

  const handleDeleteEmployee = (employee) => {
    setSelectedDeleteEmployee(employee);
    setIsOpenDeleteAlert(true);
  };

  const handleDeleteConfirmation = async (isConfirmed) => {
    setIsOpenDeleteAlert(false);
    if (isConfirmed && selectedDeleteEmployee) {
      try {
        await deleteEmployee(selectedDeleteEmployee._id).unwrap();
        setIsOpenSuccessDeleteAlert(true);
      } catch (err) {
        console.error("Delete employee failed:", err);
      }
    }
  };

  if (isLoading) return <div className="p-4">{t("Loading...")}</div>;
  if (error) return <div className="text-red-500 p-4">{t("Error loading employees")}</div>;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 h-full">
          <Table
            title="Employees"
            headers={headers}
            isActions={false}
            customActions={(actualRowIndex) => (
              <EmployeeActions actualRowIndex={actualRowIndex} />
            )}
            rows={EmployeeRowTable(employees)}
            headerActions={
              <div className="flex gap-2">
                {/* ربط أزرار الهيدر بالحالات */}
                <button
                  onClick={() => setIsOpenSendNotifyModal(true)}
                  className="bg-[#EEF2FF] text-[#375DFB] px-4 py-2 rounded-lg text-sm font-medium">
                  {t("Send Notification")}
                </button>
                <button
                  onClick={() => setIsOpenInviteModal(true)}
                  className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium">
                  {t("Invite Employee")}
                </button>
                <button
                  onClick={() => setIsOpenCreateModal(true)}
                  className="bg-[#375DFB] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {t("Add New Employee")}
                </button>
              </div>
            }
          />
        </div>
      </div>

      {/* 2. استدعاء المودالات وتمرير الحالات والدوال */}
      <CreateEmployeeModal
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
      />

      <InviteNewEmployeeModal
        isOpen={isOpenInviteModal}
        onClose={() => setIsOpenInviteModal(false)}
      />

      <SendNotificationModal
        isOpen={isOpenSendNotifyModal}
        onClose={() => {
          setIsOpenSendNotifyModal(false);
          setSelectedEmployee(null); // مسح الموظف المحدد عند الإغلاق
        }}
        employeeData={selectedEmployee} // تمرير بيانات الموظف إذا أردت إرسال إشعار لموظف معين
      />

      <EditAnEmployeeModal
        isOpen={isOpenEditModal}
        onClose={() => {
          setIsOpenEditModal(false);
          setSelectedEmployee(null);
        }}
        employeeData={selectedEmployee}
      />


      {/* Delete Confirmation Alert */}
      <Alert
        type="warning"
        title="Delete Employee?"
        message="Are you sure you want to delete this employee?"
        onSubmit={handleDeleteConfirmation}
        titleCancelBtn="Cancel"
        titleSubmitBtn="Delete"
        isOpen={isOpenDeleteAlert}
        onClose={() => setIsOpenDeleteAlert(false)}
        isBtns={1}
      />

      {/* Success Delete Alert */}
      <Alert
        type="success"
        title="Employee Deleted"
        isBtns={false}
        message={`The employee ${selectedDeleteEmployee?.name} and all associated data have been successfully deleted.`}
        isOpen={isOpenSuccessDeleteAlert}
        onClose={() => setIsOpenSuccessDeleteAlert(false)}
      />
    </>
  );
}

export default EmployeesTap;