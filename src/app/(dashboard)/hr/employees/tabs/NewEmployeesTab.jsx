import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Table from "../../../../../components/Tables/Table.jsx";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import { useGetNewEmployeesQuery } from "@/redux/employees/employeesApi";
import { RiUserAddLine } from "@remixicon/react";
import StatusActions from "@/components/Dropdowns/StatusActions";
import CompleteEmployeeProfileModal from "@/app/(dashboard)/hr/employees/modals/CompleteEmployeeProfileModal";

function NewEmployeesTab() {
    const { t } = useTranslation();
    const { data: newEmployees = [], isLoading, error } = useGetNewEmployeesQuery();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const headers = [
        { label: t("Employee"), width: "250px" },
        { label: t("Contact"), width: "250px" },
        { label: t("Registered At"), width: "200px" },
        { label: "", width: "50px" },
    ];

    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return newEmployees;
        return newEmployees.filter((emp) =>
            (emp.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.email || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [newEmployees, searchTerm]);

    const EmployeeActions = ({ actualRowIndex }) => {
        const { t, i18n } = useTranslation();
        const employee = filteredEmployees[actualRowIndex];

        const actions = [
            {
                text: t("Complete Profile"),
                icon: <RiUserAddLine className="text-primary-500" />,
                onClick: () => {
                    setSelectedEmployee(employee);
                    setIsCompleteModalOpen(true);
                },
            },
        ];

        return (
            <StatusActions
                states={actions}
                className={`${i18n.language === "ar" ? "left-0" : "right-0"}`}
            />
        );
    };

    const EmployeeRows = (employeesToShow) => {
        return employeesToShow?.map((emp, index) => [
            <AccountDetails
                key={`account-${index}`}
                path="#"
                account={{
                    name: emp.name || t("Unknown"),
                    rule: t("New Registration"),
                    imageProfile: "https://ui-avatars.com/api/?name=" + (emp.name || "User") + "&background=random",
                }}
            />,
            <div key={`contact-${index}`} className="flex flex-col gap-1">
                <p className="text-sm font-medium dark:text-gray-200">{emp.email || "N/A"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{emp.phone || "N/A"}</p>
            </div>,
            <div key={`date-${index}`} className="text-sm text-gray-500">
                {new Date(emp.createdAt).toLocaleDateString()}
            </div>,
        ]);
    };

    if (isLoading) return <div className="p-4">{t("Loading...")}</div>;
    if (error) return <div className="text-red-500 p-4">{t("Error loading new employees")}</div>;

    return (
        <>
            <div className="flex flex-col gap-6">
                <Table
                    title={t("New Employee Registrations")}
                    headers={headers}
                    isActions={false}
                    customActions={(index) => <EmployeeActions actualRowIndex={index} />}
                    rows={EmployeeRows(filteredEmployees)}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder={t("Search by name or email...")}
                />
            </div>

            <CompleteEmployeeProfileModal
                isOpen={isCompleteModalOpen}
                onClose={() => {
                    setIsCompleteModalOpen(false);
                    setSelectedEmployee(null);
                }}
                employee={selectedEmployee}
            />
        </>
    );
}

export default NewEmployeesTab;
