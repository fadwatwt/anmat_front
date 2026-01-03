import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import { useTranslation } from "react-i18next";
import IntegrationSettingsForm from "@/app/(dashboard)/money-receiving/components/IntegrationSettingsForm";
import {useState} from "react";
import EmployeeInfoForm from "@/app/(dashboard)/hr/employees/components/EmployeeInfoForm";
import WorkAndRatingInfoForm from "@/app/(dashboard)/hr/employees/components/WorkAndRatingInfoForm";
import QualificationsForm from "@/app/(dashboard)/hr/employees/components/QualificationsForm";

function CreateEmployeeModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(1);
    const { t } = useTranslation();


    const steps = [
        {
            title: t("Employee Info"),
            content: (
                <EmployeeInfoForm />
            ),
        },
        {
            title: t("Work &Rating Info"),
            content: (
                <WorkAndRatingInfoForm />
            ),
        },
        {
            title: t("Qualifications"),
            content: (
                <QualificationsForm />
            ),
        }
    ];

    return (
        <Modal
            className="lg:w-[35%] md:w-9/12 sm:w-7/12 w-10/12 p-4 "
            isOpen={isOpen}
            onClose={onClose}
            customBtns={
                <CustomBtnModal
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    handleNext={() =>
                        setCurrentStep((prev) => Math.min(prev + 1, steps.length))
                    }
                    handleSave={() => {}} // Pass handleSave function
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
    );
}

function CustomBtnModal({
                            currentStep,
                            totalSteps,
                            handleNext,
                            handleSave,
                        }) {
    const { t } = useTranslation();
    return (
        <div className="w-full flex items-center gap-2 justify-between pt-3">
            <button
                onClick={handleSave}
                className="bg-primary-base text-sm flex flex-1 justify-center items-center h-full text-center dark:bg-primary-200 dark:text-black w-40 text-white p-[10px] rounded-[10px]"
            >
                {t("Update")}
            </button>
            {currentStep < totalSteps && (
                <button
                    onClick={handleNext}
                    className="bg-none text-sm border flex-1 border-primary-base flex justify-center items-center text-primary-base dark:border-soft-400 dark:text-soft-400 h-full text-center w-40 p-[10px] rounded-[10px]"
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
