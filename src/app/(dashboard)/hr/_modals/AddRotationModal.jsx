"use client";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import TimeInput from "@/components/Form/TimeInput.jsx"; // Assuming TimeInput exists from previous task
import DateInput from "@/components/Form/DateInput";
import ElementsSelect from "@/components/Form/ElementsSelect";

function AddRotationModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        employee: "",
        date: "",
        timeFrom: "",
        timeTo: "",
        status: "active"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving rotation:", formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("Add a rotation shift")}
            size="md"
        >
            <div className="flex flex-col gap-4">
                <ElementsSelect
                    title="Employee"
                    name="employee"
                    value={formData.employee}
                    onChange={handleChange}
                    options={[
                        { id: "1", element: "Fatima Ahmed" },
                        { id: "2", element: "Sophia Williams" },
                        { id: "3", element: "James Brown" }
                    ]}
                    placeholder={t("Select Employee")}
                />

                <DateInput
                    title="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />

                <div className="flex gap-4">
                    {/* Using Input type="time" if TimeInput is not available or compatible, but trying standard Input first as TimeInput might be custom */}
                    <TimeInput
                        label={t("Time From")}
                        name="timeFrom"
                        value={formData.timeFrom}
                        onChange={handleChange}
                        containerClassName="w-full"
                    />
                    <TimeInput
                        label={t("Time To")}
                        name="timeTo"
                        value={formData.timeTo}
                        onChange={handleChange}
                        containerClassName="w-full"
                    />
                </div>

                <ElementsSelect
                    title="Rotation"
                    name="rotation"
                    value={formData.rotation}
                    onChange={handleChange}
                    options={[
                        { id: "1", element: "Rotation 1" },
                        { id: "2", element: "Rotation 2" },
                        { id: "3", element: "Rotation 3" }
                    ]}
                    placeholder={t("Select Rotation")}
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
                        {t("Save")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

AddRotationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AddRotationModal;
