import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../../../components/Tables/Table.jsx";
import EditAnEmployeeModal from "@/app/(dashboard)/hr/_modals/EditAnEmployeeModal.jsx";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import Rating from "../../Rating.jsx";
import Alert from "../../../../../components/Alerts/Alert.jsx";
import {
  fetchEmployees,
  deleteEmployee,
} from "@/redux/employees/employeeAPI";
import {RiEditLine, RiNotification4Line} from "@remixicon/react";
import StatusActions from "@/components/Dropdowns/StatusActions";
import CreateEmployeeModal from "@/app/(dashboard)/hr/employees/modals/CreateEmployee.modal";
import InviteNewEmployeeModal from "@/app/(dashboard)/hr/employees/modals/InviteNewEmployee,modal";
import SendNotificationModal from "@/app/(dashboard)/hr/employees/modals/SendNotification.modal";
import {RiDeleteBin7Line} from "react-icons/ri";


function EmployeesTap() {
  const dispatch = useDispatch();
  const { employees, error } = useSelector((state) => state.employees);
  const { t } = useTranslation();

  // 1. تعريف حالات المودالات (State for modals)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenInviteModal, setIsOpenInviteModal] = useState(false);
  const [isOpenSendNotifyModal, setIsOpenSendNotifyModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDeleteEmployee, setSelectedDeleteEmployee] = useState(null);
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [isOpenSuccessDeleteAlert, setIsOpenSuccessDeleteAlert] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const headers = [
    { label: t("Employees"), width: "200px" },
    { label: t("Department"), width: "150px" },
    { label: t("Work type"), width: "150px" },
    { label: t("Salary"), width: "100px" },
    { label: t("Score"), width: "100px" },
    { label: "", width: "50px" },
  ];

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter((employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [employees, searchTerm]);

  // دالة التعامل مع الأكشن داخل الجدول (Edit, Delete, Notify)
  const EmployeeActions = ({actualRowIndex}) => {
    const {t, i18n} = useTranslation();
    const employee = employees[actualRowIndex]; // جلب بيانات الموظف بناءً على الاندكس

    const statesActions = [
      {
        text: t("Edit"),
        icon: <RiEditLine className="text-primary-400"/>,
        onClick: () => {
          setSelectedEmployee(employee);
          setIsOpenEditModal(true);
        },
      },
      {
        text: t("Send Notification"),
        icon: <RiNotification4Line className="text-primary-400"/>,
        onClick: () => {
          setSelectedEmployee(employee);
          setIsOpenSendNotifyModal(true);
        }
      },
      {
        text: t("Delete"),
        icon: <RiDeleteBin7Line className="text-red-500"/>,
        onClick: () => handleDeleteEmployee(employee),
      }
    ]
    return (
        <StatusActions states={statesActions}  className={`${
            i18n.language === "ar" ? "left-0" : "right-0"
        }`}/>
    );
  }

  const EmployeeRowTable = (employeesToShow) => {
    return employeesToShow?.map((employee, index) => [
      <AccountDetails
          key={`account-details-${index}`}
          path={`/employee-profile/${employee._id}-${encodeURIComponent(employee.name)}`}
          account={{
            name: employee.name,
            rule: employee.role?.name || "N/A",
            imageProfile: employee?.profilePicture || "https://ui-avatars.com/api/?name=John+Doe",
          }}
      />,
      <p key={`department-${index}`} className="text-sm dark:text-sub-300">{employee.department?.name || "N/A"}</p>,
      <p key={`work-type-${index}`} className="text-sm dark:text-sub-300">{employee.jobType || employee.workType || "N/A"}</p>,
      <p key={`salary-${index}`} className="text-sm dark:text-sub-300">${employee.salary?.toLocaleString() || 0}</p>,
      <Rating key={`rating-${index}`} value={employee.rating / 20} />,
    ]);
  };

  const handleDeleteEmployee = (employee) => {
    setSelectedDeleteEmployee(employee);
    setIsOpenDeleteAlert(true);
  };

  const handleDeleteConfirmation = async (isConfirmed) => {
    setIsOpenDeleteAlert(false);
    if (isConfirmed && selectedDeleteEmployee) {
      try {
        await dispatch(deleteEmployee(selectedDeleteEmployee._id));
        setIsOpenSuccessDeleteAlert(true);
        dispatch(fetchEmployees());
      } catch (error) {
        console.error("Delete employee failed:", error);
      }
    }
  };

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

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