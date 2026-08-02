"use client";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import { useTranslation } from "react-i18next";
import CreateMoneyRecevivingForm from "@/app/(dashboard)/money-receiving/components/CreateMoneyRecevivingForm";
import IntegrationSettingsForm from "@/app/(dashboard)/money-receiving/components/IntegrationSettingsForm";
import { useEffect, useRef, useState } from "react";
import {
    useCreateMoneyReceivingMethodMutation,
    useUpdateMoneyReceivingMethodMutation,
} from "@/redux/money-receiving/moneyReceivingApi";

const emptyInitialValues = {
    title: "",
    type: "",
    is_active: true,
    is_default: false,
    sort_order: 0,
    attributes: [],
};

function buildInitialValues(method) {
    if (!method) return { ...emptyInitialValues };
    return {
        title: method.title || "",
        type: method.type || "",
        is_active: method.is_active ?? true,
        is_default: method.is_default ?? false,
        sort_order: method.sort_order ?? 0,
        attributes: (method.attributes || []).map((attr) => ({
            key: attr.key,
            value: attr.value,
            is_secret: attr.is_secret,
            is_masked: attr.is_masked,
        })),
    };
}

function CreateMoneyReceivingModal({ isOpen, onClose, method }) {
    const { t } = useTranslation();
    const isEdit = Boolean(method);
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const formikRef = useRef(null);

    const [createMethod] = useCreateMoneyReceivingMethodMutation();
    const [updateMethod] = useUpdateMoneyReceivingMethodMutation();

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setError("");
            setSaving(false);
        }
    }, [isOpen]);

    const initialValues = buildInitialValues(method);

    const handleSave = async () => {
        setError("");
        const values = formikRef.current?.values || initialValues;
        if (!values.title?.trim()) {
            setError(t("Method name is required."));
            return;
        }
        if (!values.type) {
            setError(t("Method type is required."));
            return;
        }

        const payload = {
            title: values.title.trim(),
            type: values.type,
            is_active: values.is_active,
            is_default: values.is_default,
            sort_order: values.sort_order || 0,
            attributes: (values.attributes || [])
                .filter((attr) => attr.key?.trim())
                .map(({ key, value, is_secret }) => ({
                    key: key.trim(),
                    value: value || "",
                    is_secret: Boolean(is_secret),
                })),
        };

        setSaving(true);
        try {
            if (isEdit) {
                await updateMethod({ id: method._id, ...payload }).unwrap();
            } else {
                await createMethod(payload).unwrap();
            }
            onClose();
        } catch (err) {
            setError(err?.data?.message || t("Failed to save method."));
        } finally {
            setSaving(false);
        }
    };

    const steps = [
        {
            title: t("Form Fields"),
            content: <CreateMoneyRecevivingForm />,
        },
        {
            title: t("Integration Settings"),
            content: <IntegrationSettingsForm />,
        },
    ];

    return (
        <Modal
            className="lg:w-[28%] md:w-9/12 sm:w-7/12 w-10/12 p-4"
            isOpen={isOpen}
            onClose={onClose}
            customBtns={
                <CustomBtnModal
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    handleNext={() =>
                        setCurrentStep((prev) =>
                            Math.min(prev + 1, steps.length)
                        )
                    }
                    handleBack={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                    handleSave={handleSave}
                    saving={saving}
                />
            }
            title={
                isEdit
                    ? t("Edit Money Receiving Method")
                    : t("Add Money Receiving Method")
            }
        >
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <StepsComponent
                type="edit"
                steps={steps}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                initialValues={initialValues}
                formikRef={formikRef}
            />
        </Modal>
    );
}

function CustomBtnModal({
    currentStep,
    totalSteps,
    handleNext,
    handleBack,
    handleSave,
    saving,
}) {
    const { t } = useTranslation();
    const isLastStep = currentStep >= totalSteps;
    const isFirstStep = currentStep === 1;
    return (
        <div className="w-full flex items-center justify-between pt-3">
            <div className="flex gap-2">
                {isFirstStep ? (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-transparent text-sm border border-primary-500 flex justify-center items-center text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 h-full text-center w-40 p-[10px] rounded-[10px] transition-colors disabled:opacity-50"
                    >
                        {saving ? t("Saving...") : t("Save")}
                    </button>
                ) : (
                    <button
                        onClick={handleBack}
                        className="bg-transparent text-sm border border-status-border flex justify-center items-center text-cell-primary hover:bg-status-bg h-full text-center w-40 p-[10px] rounded-[10px] transition-colors"
                    >
                        {t("Back")}
                    </button>
                )}
            </div>
            {isLastStep ? (
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary-500 hover:bg-primary-600 text-sm flex justify-center items-center h-full text-center w-40 text-white p-[10px] rounded-[10px] transition-colors disabled:opacity-50"
                >
                    {saving ? t("Saving...") : t("Save")}
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    className="bg-primary-500 hover:bg-primary-600 text-sm flex justify-center items-center h-full text-center w-40 text-white p-[10px] rounded-[10px] transition-colors"
                >
                    {t("Next")}
                </button>
            )}
        </div>
    );
}

CustomBtnModal.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    handleNext: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    saving: PropTypes.bool,
};

export default CreateMoneyReceivingModal;
