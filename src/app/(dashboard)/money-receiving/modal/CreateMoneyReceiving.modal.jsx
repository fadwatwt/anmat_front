import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import { useTranslation } from "react-i18next";
import CreateMoneyRecevivingForm from "@/app/(dashboard)/money-receiving/components/CreateMoneyRecevivingForm";
import IntegrationSettingsForm from "@/app/(dashboard)/money-receiving/components/IntegrationSettingsForm";
import {useState} from "react";

function CreateMoneyReceivingModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(1);
    const { t } = useTranslation();


    const steps = [
        {
            title: t("Form Fields"),
            content: (
                <CreateMoneyRecevivingForm />
            ),
        },
        {
            title: t("Integration Settings"),
            content: (
                <IntegrationSettingsForm />
            ),
        }
    ];

    return (
        <Modal
            className="lg:w-[28%] md:w-9/12 sm:w-7/12 w-10/12 p-4 "
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
            title={t("Add Money Receiving Method")}
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
        <div className="w-full flex items-center justify-between pt-3">
            <button
                onClick={handleSave}
                className="bg-primary-base text-sm flex justify-center items-center h-full text-center dark:bg-primary-200 dark:text-black w-40 text-white p-[10px] rounded-[10px]"
            >
                {t("Save")}
            </button>
            {currentStep < totalSteps && (
                <button
                    onClick={handleNext}
                    className="bg-none text-sm border border-primary-base flex justify-center items-center text-primary-base dark:border-soft-400 dark:text-soft-400 h-full text-center w-40 p-[10px] rounded-[10px]"
                >
                    {t("Next")}
                </button>
            )}
        </div>
    );
}

CreateMoneyReceivingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

CustomBtnModal.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    handleNext: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
};

export default CreateMoneyReceivingModal;
