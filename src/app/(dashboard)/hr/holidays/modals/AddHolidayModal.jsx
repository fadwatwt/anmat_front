"use client";
import Modal from "@/components/Modal/Modal";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import InputWithIcon from "@/components/Form/InputWithIcon";
import DateInput from "@/components/Form/DateInput";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";

function AddHolidayModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving holiday:", formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("Add a Holiday")}
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
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        {t("Create")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

AddHolidayModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AddHolidayModal;
