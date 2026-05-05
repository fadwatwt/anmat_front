"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "@/components/Form/InputAndLabel";
import IconPicker from "@/components/Form/IconPicker";
import Switch2 from "@/components/Form/Switch2";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ProcessingOverlay from "@/components/Feedback/ProcessingOverlay.jsx";
import { useTranslation } from "react-i18next";
import { useCreateIndustryMutation, useUpdateIndustryMutation } from "@/redux/industries/industriesApi";

function CreateIndustryModal({ isOpen, onClose, item }) {
    const { t } = useTranslation();
    const isEditMode = !!item;

    const [createIndustry, { isLoading: isCreating }] = useCreateIndustryMutation();
    const [updateIndustry, { isLoading: isUpdating }] = useUpdateIndustryMutation();
    const isLoading = isCreating || isUpdating;

    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const [isAllowed, setIsAllowed] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setName(item.name || "");
                setIcon(item.icon_name || "");
                setIsAllowed(item.is_allowed !== undefined ? item.is_allowed : true);
            } else {
                setName("");
                setIcon("");
                setIsAllowed(true);
            }
        }
    }, [item, isOpen]);

    const handleSubmit = () => {
        if (!name.trim()) return;
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        try {
            if (isEditMode) {
                await updateIndustry({ id: item._id, name, icon_name: icon, is_allowed: isAllowed }).unwrap();
                setApiResponse({ isOpen: true, status: "success", message: t("Industry updated successfully!") });
            } else {
                await createIndustry({ name, icon_name: icon, is_allowed: isAllowed }).unwrap();
                setApiResponse({ isOpen: true, status: "success", message: t("Industry created successfully!") });
            }
        } catch (err) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: err?.data?.message || t("Operation failed. Please try again."),
            });
        }
    };

    const handleResponseClose = () => {
        const wasSuccess = apiResponse.status === "success";
        setApiResponse({ isOpen: false, status: "", message: "" });
        if (wasSuccess) onClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                title={isEditMode ? t("Edit Industry") : t("Add New Industry")}
                btnApplyTitle={isEditMode ? t("Update") : t("Add")}
                classNameBtns={"mt-5"}
                onClick={handleSubmit}
                disabled={!name.trim() || isLoading}
            >
                <div className="w-full flex flex-col gap-6 px-1">
                    <InputAndLabel
                        title={t("Industry Name")}
                        placeholder={t("Enter name")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        isRequired={true}
                    />
                    <IconPicker
                        title={t("Choose Icon")}
                        value={icon}
                        onChange={setIcon}
                    />
                    <div className="flex items-center justify-between p-4 bg-status-bg rounded-2xl border border-status-border">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-cell-primary">{t("Is Allowed")}</span>
                            <span className="text-xs text-cell-secondary">{t("Enable or disable this industry")}</span>
                        </div>
                        <Switch2 isOn={isAllowed} handleToggle={() => setIsAllowed(!isAllowed)} />
                    </div>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirm}
                title={isEditMode ? t("Confirm Update") : t("Confirm Creation")}
                message={
                    isEditMode
                        ? t(`Are you sure you want to update "${name}"?`)
                        : t(`Are you sure you want to add "${name}"?`)
                }
                confirmBtnText={isEditMode ? t("Yes, Update") : t("Yes, Add")}
                cancelBtnText={t("Cancel")}
                type="warning"
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleResponseClose}
            />

            <ProcessingOverlay
                isOpen={isLoading}
                message={isEditMode ? t("Updating industry...") : t("Creating industry...")}
            />
        </>
    );
}

CreateIndustryModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    item: PropTypes.object,
};

export default CreateIndustryModal;
