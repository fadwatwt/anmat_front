"use client";
import Modal from "@/components/Modal/Modal";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import InputWithIcon from "@/components/Form/InputWithIcon";
import DateInput from "@/components/Form/DateInput";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";

const toDateInput = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
};

function AddHolidayModal({ isOpen, onClose, onSubmit, editData, isSaving }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: "", date: "", description: "" });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: editData?.name || "",
                date: toDateInput(editData?.date),
                description: editData?.description || "",
            });
        }
    }, [isOpen, editData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.date) return;
        onSubmit?.(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editData ? t("Edit Holiday") : t("Add a Holiday")}
            size="md"
        >
            <div className="flex flex-col gap-4">
                <InputWithIcon
                    title={t("Holiday Name")}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("Enter holiday name")}
                />

                <DateInput
                    title={t("Date")}
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />

                <TextAreaWithLabel
                    title={t("Description")}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t("Enter description")}
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                    >
                        {editData ? t("Save") : t("Create")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

AddHolidayModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    editData: PropTypes.object,
    isSaving: PropTypes.bool,
};

export default AddHolidayModal;
