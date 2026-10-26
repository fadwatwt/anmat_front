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

const createInitialFormData = () => ({
    email: "", name: "", phone: "", password: "", password_confirmation: "",
    employee_detail: {
        department_id: null, position_id: null, country: "", city: "",
        work_hours: 8, shift_type: "HOURS", shift_start_time: "", shift_end_time: "",
        salary: "", yearly_day_offs: 14, weekend_days: [], date_of_birth: "",
        roles_ids: [], storage_quota: ""
        , employee_number: "", hire_date: "", employment_status: "ACTIVE",
        employment_type: "FULL_TIME", manager_id: null, work_location: "", legal_entity: ""
    }
});

function CreateEmployeeModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [formData, setFormData] = useState(createInitialFormData);
    const [errors, setErrors] = useState({});

    const resetModal = () => {
        setFormData(createInitialFormData());
        setErrors({});
        setCurrentStep(1);
        setIsApprovalOpen(false);
    };

    const handleClose = () => { resetModal(); onClose(); };

    const updateFormData = (field, value, isDetail = false) => {
        setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
        setFormData(prev => isDetail
            ? { ...prev, employee_detail: { ...prev.employee_detail, [field]: value } }
            : { ...prev, [field]: value });
    };

    const validateStep = (step) => {
        const nextErrors = {};
        const details = formData.employee_detail;
        if (step === 1) {
            if (formData.name.trim().length < 2) nextErrors.name = t("Name must be at least 2 characters");
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) nextErrors.email = t("Enter a valid email address");
            if (!/^\+?\d{7,15}$/.test(formData.phone.trim())) nextErrors.phone = t("Enter a valid phone number");
            if (formData.password.length < 6) nextErrors.password = t("Password must be at least 6 characters");
            if (formData.password !== formData.password_confirmation) nextErrors.password_confirmation = t("Passwords do not match");
            if (!details.date_of_birth) nextErrors.date_of_birth = t("Date of birth is required");
            else if (new Date(details.date_of_birth) > new Date()) nextErrors.date_of_birth = t("Date of birth cannot be in the future");
        } else {
            if (details.salary === "" || Number(details.salary) < 0) nextErrors.salary = t("Enter a valid salary");
            if (!details.shift_type) nextErrors.shift_type = t("Shift type is required");
            if (details.shift_type === "HOURS" && (Number(details.work_hours) <= 0 || Number(details.work_hours) > 24)) nextErrors.work_hours = t("Work hours must be between 1 and 24");
            if (details.shift_type === "FIXED_SHIFT") {
                if (!details.shift_start_time) nextErrors.shift_start_time = t("Shift start time is required");
                if (!details.shift_end_time) nextErrors.shift_end_time = t("Shift end time is required");
                if (details.shift_start_time && details.shift_end_time && details.shift_start_time === details.shift_end_time) nextErrors.shift_end_time = t("Shift times cannot be the same");
            }
            if (Number(details.yearly_day_offs) < 0 || Number(details.yearly_day_offs) > 365) nextErrors.yearly_day_offs = t("Yearly days off must be between 0 and 365");
            if (details.storage_quota !== "" && Number(details.storage_quota) < 0) nextErrors.storage_quota = t("Storage quota cannot be negative");
            if (details.employee_number && !/^[A-Za-z0-9_-]+$/.test(details.employee_number)) nextErrors.employee_number = t("Employee number may contain letters, numbers, dashes, and underscores only");
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleNext = () => { if (validateStep(1)) setCurrentStep(2); };
    const handleSaveRequest = () => { if (validateStep(2)) setIsApprovalOpen(true); };

    const onConfirmSave = async () => {
        try {
            const cleansedData = JSON.parse(JSON.stringify(formData));
            cleansedData.name = cleansedData.name.trim();
            cleansedData.email = cleansedData.email.trim().toLowerCase();
            cleansedData.phone = cleansedData.phone.trim();
            if (!cleansedData.employee_detail.department_id || cleansedData.employee_detail.department_id === "none") delete cleansedData.employee_detail.department_id;
            if (!cleansedData.employee_detail.position_id) delete cleansedData.employee_detail.position_id;
            if (!cleansedData.employee_detail.employee_number) delete cleansedData.employee_detail.employee_number;
            if (!cleansedData.employee_detail.hire_date) delete cleansedData.employee_detail.hire_date;
            if (cleansedData.employee_detail.shift_type === "HOURS") {
                delete cleansedData.employee_detail.shift_start_time;
                delete cleansedData.employee_detail.shift_end_time;
            }
            cleansedData.employee_detail.storage_quota = cleansedData.employee_detail.storage_quota !== "" && cleansedData.employee_detail.storage_quota !== null
                ? Number(cleansedData.employee_detail.storage_quota) * 1024 * 1024 : null;
            await createEmployee(cleansedData).unwrap();
            setIsApprovalOpen(false);
            setApiResponse({ isOpen: true, status: "success", message: t("Employee created successfully") });
        } catch (error) {
            setIsApprovalOpen(false);
            setApiResponse({ isOpen: true, status: "error", message: t(error?.data?.message || "Failed to create employee") });
        }
    };

    const steps = [
        { title: t("Employee Info"), content: <EmployeeInfoForm formData={formData} updateFormData={updateFormData} errors={errors} isEdit={false} /> },
        { title: t("Work Info"), content: <WorkAndRatingInfoForm formData={formData} updateFormData={updateFormData} errors={errors} isEdit={false} /> }
    ];
    const handleCloseApiResponse = () => {
        setApiResponse(prev => ({ ...prev, isOpen: false }));
        if (apiResponse.status === "success") handleClose();
    };

    return <>
        <Modal className="lg:w-[45%] md:w-10/12 sm:w-11/12 w-11/12 p-6" isOpen={isOpen} onClose={handleClose}
            customBtns={<CustomBtnModal currentStep={currentStep} totalSteps={steps.length} isLoading={isCreating} handleNext={handleNext} handleSave={handleSaveRequest} />}
            title={t("Add New Employee")}>
            <div className="mb-4 rounded-xl border border-primary-200 bg-primary-50/60 p-3 text-xs leading-5 text-primary-700 dark:border-primary-900 dark:bg-primary-950/20 dark:text-primary-200">
                {t("The password entered here is temporary. The employee will receive an email to verify the account.")}
            </div>
            <StepsComponent type="edit" steps={steps} currentStep={currentStep} setCurrentStep={(step) => { if (step < currentStep || validateStep(currentStep)) setCurrentStep(step); }} />
        </Modal>
        <ApprovalAlert isOpen={isApprovalOpen} onClose={() => setIsApprovalOpen(false)} onConfirm={onConfirmSave} title={t("Create Employee")} message={t("Are you sure you want to create this employee?")} />
        <ApiResponseAlert isOpen={apiResponse.isOpen} status={apiResponse.status} message={apiResponse.message} onClose={handleCloseApiResponse} />
        <ProcessingOverlay isOpen={isCreating} message={t("Creating Employee...")} />
    </>;
}

function CustomBtnModal({ currentStep, totalSteps, handleNext, handleSave, isLoading }) {
    const { t } = useTranslation();
    return <div className="w-full flex items-center gap-2 justify-between pt-3">
        {currentStep === totalSteps && <button onClick={handleSave} disabled={isLoading} className="bg-primary-500 hover:bg-primary-600 transition-colors text-sm flex flex-1 justify-center items-center text-white py-2.5 rounded-xl disabled:opacity-50 font-semibold">{isLoading ? t("Saving...") : t("Save")}</button>}
        {currentStep < totalSteps && <button onClick={handleNext} className="bg-badge-bg text-sm border flex-1 border-status-border flex justify-center items-center text-primary-500 py-2.5 rounded-xl font-semibold">{t("Next")}</button>}
    </div>;
}

CreateEmployeeModal.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };
CustomBtnModal.propTypes = { currentStep: PropTypes.number.isRequired, totalSteps: PropTypes.number.isRequired, handleNext: PropTypes.func.isRequired, handleSave: PropTypes.func.isRequired, isLoading: PropTypes.bool };
export default CreateEmployeeModal;
