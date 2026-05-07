import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import { useState, useEffect } from "react";
import EmployeeInfoForm from "@/app/(dashboard)/hr/employees/components/EmployeeInfoForm";
import WorkAndRatingInfoForm from "@/app/(dashboard)/hr/employees/components/WorkAndRatingInfoForm";
import { useUpdateEmployeeMutation } from "@/redux/employees/employeesApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ProcessingOverlay from "@/components/Feedback/ProcessingOverlay";
import { useTranslation } from "react-i18next";

function EditAnEmployeeModal({ isOpen, onClose, employeeData }) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

    // Alerts State
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        phone: "",
        employee_detail: {
            department_id: null,
            position_id: null,
            country: "",
            city: "",
            work_hours: 0,
            salary: 0,
            yearly_day_offs: 0,
            weekend_days: [],
            date_of_birth: "",
            roles_ids: []
        }
    });

    useEffect(() => {
        if (isOpen && employeeData) {
            setFormData({
                email: employeeData.user?.email || "",
                name: employeeData.user?.name || "",
                phone: employeeData.user?.phone || "",
                employee_detail: {
                    department_id: employeeData.department_id?._id || employeeData.department_id || null,
                    position_id: employeeData.position_id?._id || employeeData.position_id || null,
                    country: employeeData.country || "",
                    city: employeeData.city || "",
                    work_hours: employeeData.work_hours || 0,
                    salary: employeeData.salary || 0,
                    yearly_day_offs: employeeData.yearly_day_offs || 0,
                    weekend_days: employeeData.weekend_days || [],
                    date_of_birth: employeeData.date_of_birth ? new Date(employeeData.date_of_birth).toISOString().split('T')[0] : "",
                    roles_ids: employeeData.roles_ids || [],
                    storage_quota: employeeData.storage_quota !== undefined && employeeData.storage_quota !== null ? (employeeData.storage_quota / (1024 * 1024)) : ""
                }
            });
            setCurrentStep(1);
        }
    }, [isOpen, employeeData]);

    const updateFormData = (field, value, isDetail = false) => {
        if (isDetail) {
            setFormData(prev => ({
                ...prev,
                employee_detail: {
                    ...prev.employee_detail,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSaveRequest = () => {
        setIsApprovalOpen(true);
    };

    const onConfirmSave = async () => {
        try {
            // Clean payload: remove null or "none" values and flattern for API if needed
            // Based on previous EditAnEmployeeModal, it expects:
            // { name, phone, employee_details: { ... } }
            // Note: the previous one used plural `employee_details` but the Create one used singular.
            // I'll stick to plural `employee_details` if that's what the update API expects.
            
            const payload = {
                id: employeeData.user_id,
                name: formData.name,
                phone: formData.phone,
                employee_details: {
                    ...formData.employee_detail,
                    work_hours: Number(formData.employee_detail.work_hours),
                    salary: Number(formData.employee_detail.salary),
                    yearly_day_offs: Number(formData.employee_detail.yearly_day_offs),
                }
            };

            if (formData.employee_detail.storage_quota !== "" && formData.employee_detail.storage_quota !== null) {
                payload.employee_details.storage_quota = Number(formData.employee_detail.storage_quota) * 1024 * 1024;
            } else {
                payload.employee_details.storage_quota = null; // null means unlimited
            }

            // Remove nulls and "none" from department/position
            if (!payload.employee_details.department_id || payload.employee_details.department_id === "none") {
                delete payload.employee_details.department_id;
            }
            if (!payload.employee_details.position_id) {
                delete payload.employee_details.position_id;
            }
            if (!payload.employee_details.date_of_birth) {
                delete payload.employee_details.date_of_birth;
            }

            await updateEmployee(payload).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Employee updated successfully")
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update employee")
            });
        }
    };

    const steps = [
        {
            title: t("Employee Info"),
            content: (
                <EmployeeInfoForm formData={formData} updateFormData={updateFormData} isEdit={true} />
            ),
        },
        {
            title: t("Work Info"),
            content: (
                <WorkAndRatingInfoForm formData={formData} updateFormData={updateFormData} isEdit={true} />
            )
        }
    ];

    const handleCloseApiResponse = () => {
        setApiResponse(prev => ({ ...prev, isOpen: false }));
        if (apiResponse.status === "success") {
            onClose();
        }
    };

    return (
        <>
            <Modal
                className="lg:w-[45%] md:w-10/12 sm:w-11/12 w-11/12 p-6 "
                isOpen={isOpen}
                onClose={onClose}
                customBtns={
                    <CustomBtnModal
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        isLoading={isUpdating}
                        handleNext={() =>
                            setCurrentStep((prev) => Math.min(prev + 1, steps.length))
                        }
                        handleBack={() =>
                            setCurrentStep((prev) => Math.max(prev - 1, 1))
                        }
                        handleSave={handleSaveRequest}
                    />
                }
                title={t("Edit Employee")}
            >
                <StepsComponent
                    type="edit"
                    steps={steps}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                />
            </Modal>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={onConfirmSave}
                title={t("Update Employee")}
                message={t("Are you sure you want to update this employee's details?")}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleCloseApiResponse}
            />

            <ProcessingOverlay isOpen={isUpdating} message={t("Updating Employee...")} />
        </>
    );
}

function CustomBtnModal({
    currentStep,
    totalSteps,
    handleNext,
    handleBack,
    handleSave,
    isLoading
}) {
    const { t } = useTranslation();
    return (
        <div className="w-full flex items-center gap-2 justify-between pt-3">
            {currentStep > 1 && (
                <button
                    onClick={handleBack}
                    className="bg-badge-bg text-sm border flex-1 border-status-border flex justify-center items-center text-primary-500 hover:bg-opacity-80 h-full text-center py-2.5 rounded-xl transition-all font-semibold"
                >
                    {t("Back")}
                </button>
            )}
            
            {currentStep === totalSteps ? (
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-primary-500 hover:bg-primary-600 transition-colors text-sm flex flex-1 justify-center items-center h-full text-center text-white py-2.5 rounded-xl disabled:opacity-50 font-semibold"
                >
                    {isLoading ? t("Saving...") : t("Save Changes")}
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    className="bg-primary-500 hover:bg-primary-600 transition-colors text-sm flex flex-1 justify-center items-center h-full text-center text-white py-2.5 rounded-xl transition-all font-semibold"
                >
                    {t("Next")}
                </button>
            )}
        </div>
    );
}

EditAnEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    employeeData: PropTypes.object,
};

CustomBtnModal.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    handleNext: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

export default EditAnEmployeeModal;
