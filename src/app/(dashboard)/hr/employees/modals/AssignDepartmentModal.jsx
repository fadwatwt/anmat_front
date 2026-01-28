import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetDepartmentsQuery, useAssignEmployeesToDepartmentMutation } from "@/redux/departments/departmentsApi";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function AssignDepartmentModal({ isOpen, onClose, initialSelectedEmployee }) {
    const { t } = useTranslation();
    const { data: departments = [] } = useGetDepartmentsQuery();
    const { data: employees = [] } = useGetEmployeesQuery();
    const [assignEmployees, { isLoading }] = useAssignEmployeesToDepartmentMutation();

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    // Alerts State
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    // Filter employees that don't have a department
    const employeesWithoutDepartment = useMemo(() => {
        return employees.filter(emp => !emp.department && !emp.department_id);
    }, [employees]);

    // Handle initial selection
    useEffect(() => {
        if (isOpen && initialSelectedEmployee && !selectedEmployees.includes(initialSelectedEmployee._id)) {
            setSelectedEmployees([initialSelectedEmployee._id]);
        }
    }, [isOpen, initialSelectedEmployee]);

    const handleEmployeeToggle = (employeeId) => {
        setSelectedEmployees(prev => {
            if (prev.includes(employeeId)) {
                return prev.filter(id => id !== employeeId);
            } else {
                return [...prev, employeeId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedEmployees.length === employeesWithoutDepartment.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employeesWithoutDepartment.map(emp => emp._id));
        }
    };

    const handleSaveRequest = () => {
        if (!selectedDepartment) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Please select a department")
            });
            return;
        }
        if (selectedEmployees.length === 0) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Please select at least one employee")
            });
            return;
        }
        setIsApprovalOpen(true);
    };

    const onConfirmSave = async () => {
        try {
            await assignEmployees({
                department_id: selectedDepartment,
                employeeIds: selectedEmployees
            }).unwrap();

            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Employees assigned to department successfully")
            });

            // Reset form
            setSelectedDepartment("");
            setSelectedEmployees([]);
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to assign employees to department")
            });
        }
    };

    const handleCloseApiResponse = () => {
        setApiResponse(prev => ({ ...prev, isOpen: false }));
        if (apiResponse.status === "success") {
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedDepartment("");
        setSelectedEmployees([]);
        onClose();
    };

    return (
        <>
            <Modal
                className="lg:w-[40%] md:w-10/12 sm:w-11/12 w-11/12 p-6"
                isOpen={isOpen}
                onClose={handleClose}
                title={t("Assign Department to Employees")}
                customBtns={
                    <div className="w-full flex items-center gap-2 justify-between pt-3">
                        <button
                            onClick={handleSaveRequest}
                            disabled={isLoading}
                            className="bg-primary-base text-sm flex flex-1 justify-center items-center h-full text-center dark:bg-primary-200 dark:text-black w-full text-white p-[10px] rounded-[10px] disabled:opacity-50"
                        >
                            {isLoading ? t("Assigning...") : t("Assign Department")}
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col gap-6">
                    {/* Department Select */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium dark:text-gray-200">
                            {t("Select Department")} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-base/20"
                        >
                            <option value="">{t("Choose a department")}</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Employees Multi-Select */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium dark:text-gray-200">
                                {t("Select Employees")} <span className="text-red-500">*</span>
                                <span className="text-gray-400 text-xs ml-2">
                                    ({t("Only employees without department")})
                                </span>
                            </label>
                            {employeesWithoutDepartment.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="text-xs text-primary-base hover:underline"
                                >
                                    {selectedEmployees.length === employeesWithoutDepartment.length
                                        ? t("Deselect All")
                                        : t("Select All")}
                                </button>
                            )}
                        </div>

                        <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            {employeesWithoutDepartment.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    {t("No employees without department")}
                                </div>
                            ) : (
                                employeesWithoutDepartment.map((employee) => (
                                    <label
                                        key={employee._id}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees.includes(employee._id)}
                                            onChange={() => handleEmployeeToggle(employee._id)}
                                            className="w-4 h-4 text-primary-base rounded border-gray-300 focus:ring-primary-base"
                                        />
                                        <div className="flex items-center gap-3 flex-1">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${employee.user?.name || "User"}&background=random`}
                                                alt={employee.user?.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium dark:text-gray-200">
                                                    {employee.user?.name || t("Unknown")}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {employee.user?.email || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>

                        {selectedEmployees.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t("Selected")}: {selectedEmployees.length} {t("employee(s)")}
                            </p>
                        )}
                    </div>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={onConfirmSave}
                title={t("Assign Department")}
                message={t("Are you sure you want to assign the selected employees to this department?")}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleCloseApiResponse}
            />
        </>
    );
}

AssignDepartmentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    initialSelectedEmployee: PropTypes.object,
};

export default AssignDepartmentModal;
