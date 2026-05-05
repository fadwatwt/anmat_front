import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import { useState } from "react";
import EmployeeInfoForm from "@/app/(dashboard)/hr/employees/components/EmployeeInfoForm";
import WorkAndRatingInfoForm from "@/app/(dashboard)/hr/employees/components/WorkAndRatingInfoForm";
import { useCreateEmployeeMutation } from "@/redux/employees/employeesApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ProcessingOverlay from "@/components/Feedback/ProcessingOverlay";
import { useTranslation } from "react-i18next";

function CreateEmployeeModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();

    // Alerts State
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        phone: "",
        password: "",
        password_confirmation: "",
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
            // Clean payload: remove null or "none" values
            const cleansedData = JSON.parse(JSON.stringify(formData));
            if (!cleansedData.employee_detail.department_id || cleansedData.employee_detail.department_id === "none") {
                delete cleansedData.employee_detail.department_id;
            }
            if (!cleansedData.employee_detail.position_id) {
                delete cleansedData.employee_detail.position_id;
            }

            const response = await createEmployee(cleansedData).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Employee created successfully")
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to create employee")
            });
        }
    };

    const steps = [
        {
            title: t("Employee Info"),
            content: (
                <EmployeeInfoForm formData={formData} updateFormData={updateFormData} isEdit={false} />
            ),
        },
        {
            title: t("Work Info"),
            content: (
                <WorkAndRatingInfoForm formData={formData} updateFormData={updateFormData} isEdit={false} />
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
                        isLoading={isCreating}
                        handleNext={() =>
                            setCurrentStep((prev) => Math.min(prev + 1, steps.length))
                        }
                        handleSave={handleSaveRequest}
                    />
                }
                title={t("Add New Employee")}
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
                title="Create Employee"
                message="Are you sure you want to create this employee?"
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleCloseApiResponse}
            />

            <ProcessingOverlay isOpen={isCreating} message={t("Creating Employee...")} />
        </>
    );
}

function CustomBtnModal({
    currentStep,
    totalSteps,
    handleNext,
    handleSave,
    isLoading
}) {
    const { t } = useTranslation();
    return (
        <div className="w-full flex items-center gap-2 justify-between pt-3">
            {currentStep === totalSteps && (
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-primary-500 hover:bg-primary-600 transition-colors text-sm flex flex-1 justify-center items-center h-full text-center text-white py-2.5 rounded-xl disabled:opacity-50 font-semibold"
                >
                    {isLoading ? t("Saving...") : t("Save")}
                </button>
            )}
            {currentStep < totalSteps && (
                <button
                    onClick={handleNext}
                    className="bg-badge-bg text-sm border flex-1 border-status-border flex justify-center items-center text-primary-500 hover:bg-opacity-80 h-full text-center py-2.5 rounded-xl transition-all font-semibold"
                >
                    {t("Next")}
                </button>
            )}
        </div>
    );
}

CreateEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

CustomBtnModal.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    handleNext: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
};

export default CreateEmployeeModal;
