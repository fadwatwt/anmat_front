"use client";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import EmployeeInfoForm from "@/app/(dashboard)/hr/employees/components/EmployeeInfoForm";
import WorkAndRatingInfoForm from "@/app/(dashboard)/hr/employees/components/WorkAndRatingInfoForm";
import { useCreateEmployeeDetailMutation } from "@/redux/employees/employeesApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useTranslation } from "react-i18next";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";

function CompleteEmployeeProfileModal({ isOpen, onClose, employee }) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [createDetail, { isLoading }] = useCreateEmployeeDetailMutation();

    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        employee_detail: {
            department_id: null,
            position_id: null,
            roles_ids: [],
            country: "",
            city: "",
            work_hours: 8,
            salary: 0,
            yearly_day_offs: 14,
            weekend_days: ["Friday", "Saturday"],
            date_of_birth: ""
        }
    });

    useEffect(() => {
        if (employee) {
            setFormData(prev => ({
                ...prev,
                name: employee.name || "",
                email: employee.email || "",
                phone: employee.phone || "",
            }));
        }
    }, [employee]);

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

    const handleSave = () => {
        if (!formData.employee_detail.date_of_birth) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Date of birth is required")
            });
            return;
        }
        setIsApprovalOpen(true);
    };

    const onConfirmSave = async () => {
        setIsApprovalOpen(false);
        try {
            const payload = {
                user_id: employee._id,
                ...formData.employee_detail
            };

            // Clean optional fields
            if (!payload.department_id || payload.department_id === "none") delete payload.department_id;
            if (!payload.position_id) delete payload.position_id;
            if (!payload.roles_ids || payload.roles_ids.length === 0) delete payload.roles_ids;

            await createDetail(payload).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Employee profile completed successfully")
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to complete profile")
            });
        }
    };

    const steps = [
        {
            title: t("Personal Info"),
            content: <EmployeeInfoForm formData={formData} updateFormData={updateFormData} />,
        },
        {
            title: t("Employment Detail"),
            content: <WorkAndRatingInfoForm formData={formData} updateFormData={updateFormData} />,
        }
    ];

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={t("Complete Employee Profile")}
                className="lg:w-[45%] md:w-10/12 w-11/12 p-6"
                customBtns={
                    <div className="w-full flex items-center gap-2 justify-end pt-3">
                        {currentStep < steps.length ? (
                            <button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                className="bg-primary-base text-white text-sm px-10 h-[44px] rounded-xl hover:bg-primary-600 transition-colors"
                            >
                                {t("Next")}
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-primary-base text-sm px-10 h-[44px] text-white rounded-xl disabled:opacity-50 hover:bg-primary-600 transition-colors"
                            >
                                {isLoading ? t("Saving...") : t("Save & Activate")}
                            </button>
                        )}
                    </div>
                }
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
                title={t("Complete Profile")}
                message={t("Are you sure you want to save these details and activate this employee account?")}
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => {
                    setApiResponse(prev => ({ ...prev, isOpen: false }));
                    if (apiResponse.status === "success") onClose();
                }}
            />
        </>
    );
}

CompleteEmployeeProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    employee: PropTypes.object
};

export default CompleteEmployeeProfileModal;
